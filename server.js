// Backend Server for WhatsApp Auto Poster
// Required packages: npm install express whatsapp-web.js qrcode puppeteer cheerio node-cron

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// WhatsApp Client
let whatsappClient = null;
let qrCodeData = null;
let isConnected = false;
let availableChats = [];

// Initialize WhatsApp Client
function initializeWhatsApp() {
    whatsappClient = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    whatsappClient.on('qr', async (qr) => {
        console.log('QR Code received');
        qrCodeData = await qrcode.toDataURL(qr);
    });

    whatsappClient.on('ready', async () => {
        console.log('WhatsApp Client is ready!');
        isConnected = true;
        
        // Load all chats
        const chats = await whatsappClient.getChats();
        availableChats = chats
            .filter(chat => chat.isGroup)
            .map(chat => ({
                id: chat.id._serialized,
                name: chat.name,
                participants: chat.participants ? chat.participants.length : 0
            }));
        
        console.log(`Loaded ${availableChats.length} groups`);
    });

    whatsappClient.on('authenticated', () => {
        console.log('WhatsApp authenticated');
    });

    whatsappClient.on('auth_failure', () => {
        console.error('WhatsApp authentication failed');
        isConnected = false;
    });

    whatsappClient.on('disconnected', () => {
        console.log('WhatsApp disconnected');
        isConnected = false;
    });

    whatsappClient.initialize();
}

// Web Scraper
async function scrapeWebsite(url, scrapeType, limit = 5, customSelector = null) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        const html = await page.content();
        const $ = cheerio.load(html);
        
        let results = [];
        
        switch(scrapeType) {
            case 'headlines':
                $('h1, h2, h3').each((i, el) => {
                    if (i < limit) {
                        const text = $(el).text().trim();
                        const link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
                        if (text) {
                            results.push({
                                title: text,
                                link: link ? new URL(link, url).href : url
                            });
                        }
                    }
                });
                break;
                
            case 'products':
                $('.product, [class*="product"]').each((i, el) => {
                    if (i < limit) {
                        const title = $(el).find('h1, h2, h3, .title, [class*="title"]').first().text().trim();
                        const price = $(el).find('.price, [class*="price"]').first().text().trim();
                        const link = $(el).find('a').first().attr('href');
                        
                        if (title) {
                            results.push({
                                title,
                                price: price || 'N/A',
                                link: link ? new URL(link, url).href : url
                            });
                        }
                    }
                });
                break;
                
            case 'images':
                $('img').each((i, el) => {
                    if (i < limit) {
                        const src = $(el).attr('src');
                        const alt = $(el).attr('alt') || 'Image';
                        if (src) {
                            results.push({
                                title: alt,
                                image: new URL(src, url).href
                            });
                        }
                    }
                });
                break;
                
            case 'custom':
                if (customSelector) {
                    $(customSelector).each((i, el) => {
                        if (i < limit) {
                            results.push({
                                title: $(el).text().trim(),
                                html: $(el).html()
                            });
                        }
                    });
                }
                break;
                
            default:
                $('article, .article, [class*="post"]').each((i, el) => {
                    if (i < limit) {
                        const title = $(el).find('h1, h2, h3').first().text().trim();
                        const description = $(el).find('p').first().text().trim();
                        const link = $(el).find('a').first().attr('href');
                        
                        if (title) {
                            results.push({
                                title,
                                description,
                                link: link ? new URL(link, url).href : url
                            });
                        }
                    }
                });
        }
        
        await browser.close();
        return results;
        
    } catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
}

// Send WhatsApp message
async function sendWhatsAppMessage(chatId, message, mediaUrl = null) {
    try {
        if (!isConnected) {
            throw new Error('WhatsApp not connected');
        }
        
        if (mediaUrl) {
            const media = await MessageMedia.fromUrl(mediaUrl);
            await whatsappClient.sendMessage(chatId, media, { caption: message });
        } else {
            await whatsappClient.sendMessage(chatId, message);
        }
        
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Format message with template
function formatMessage(template, data) {
    let message = template;
    Object.keys(data).forEach(key => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
    });
    return message;
}

// API Endpoints
app.get('/api/qrcode', (req, res) => {
    if (qrCodeData) {
        res.json({ qrCode: qrCodeData });
    } else {
        res.status(404).json({ error: 'QR Code not available' });
    }
});

app.get('/api/status', (req, res) => {
    res.json({ 
        connected: isConnected,
        groupsCount: availableChats.length 
    });
});

app.get('/api/groups', (req, res) => {
    if (isConnected) {
        res.json({ groups: availableChats });
    } else {
        res.status(400).json({ error: 'WhatsApp not connected' });
    }
});

app.post('/api/scrape', async (req, res) => {
    try {
        const { url, scrapeType, limit, customSelector } = req.body;
        const data = await scrapeWebsite(url, scrapeType, limit, customSelector);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/send', async (req, res) => {
    try {
        const { groups, template, url, scrapeType, limit } = req.body;
        
        // Scrape data
        const scrapedData = await scrapeWebsite(url, scrapeType, limit);
        
        // Send to each group
        for (const groupId of groups) {
            for (const item of scrapedData) {
                const message = formatMessage(template, item);
                await sendWhatsAppMessage(groupId, message);
                
                // Delay between messages
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        res.json({ success: true, sent: scrapedData.length * groups.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    initializeWhatsApp();
});

module.exports = app;