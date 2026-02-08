# WhatsApp Auto Poster Pro 🚀

**Real integration** for automatically extracting data from websites and posting to WhatsApp groups and channels.

## 🎯 Features

### ✅ Real WhatsApp Integration
- Connect via WhatsApp Web.js
- QR Code authentication
- Permission management system
- Access to all your groups and channels

### 🌐 Web Scraping
- Extract data from any website
- Support for:
  - Headlines/News
  - Products with prices
  - Images
  - Custom CSS selectors
- Automatic data parsing

### 📱 Auto-Posting
- Post to multiple groups simultaneously
- Customizable message templates
- Schedule posting intervals (instant, hourly, daily)
- Avoid duplicate posts
- Add timestamps
- Include images

### 📊 Management
- View active automations
- Pause/Resume posting
- Track sent messages
- Delete automations

## 🛠️ Installation

### Prerequisites
- Node.js 16+ installed
- Chrome/Chromium browser (for Puppeteer)
- WhatsApp account

### Setup Steps

1. **Clone the repository:**
```bash
git clone https://github.com/Meelad5815/whatsapp-auto-poster.git
cd whatsapp-auto-poster
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
node server.js
# or for development with auto-reload:
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 📖 How to Use

### Step 1: Connect WhatsApp
1. Click "Connect WhatsApp" button
2. Scan QR code with your WhatsApp mobile app
3. Wait for connection confirmation
4. Grant required permissions:
   - ✅ Send Messages (required)
   - ✅ Send Media Files (optional)
   - ✅ Read Messages (optional)

### Step 2: Configure Data Source
1. Enter website URL (e.g., `https://news.ycombinator.com`)
2. Select data type to extract:
   - Headlines
   - Products
   - Images
   - Custom selector
3. Set number of items to extract
4. Click "Test Extraction" to preview

### Step 3: Setup Auto-Post
1. Customize message template with variables:
   - `{{title}}` - Extracted title
   - `{{description}}` - Extracted description
   - `{{price}}` - Product price
   - `{{link}}` - URL link
   - `{{image}}` - Image URL

2. Select WhatsApp groups/channels
3. Set posting interval:
   - Instant (one-time)
   - Every 5/15/30 minutes
   - Hourly
   - Daily

4. Configure options:
   - Include images
   - Avoid duplicates
   - Add timestamp

5. Click "Start Auto-Posting" 🚀

## 💻 Technical Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Responsive design
- LocalStorage for persistence

### Backend
- **Node.js** with Express
- **whatsapp-web.js** - WhatsApp Web API
- **Puppeteer** - Headless browser for scraping
- **Cheerio** - HTML parsing
- **node-cron** - Task scheduling
- **qrcode** - QR code generation

## 🔧 API Endpoints

### `GET /api/status`
Check WhatsApp connection status
```json
{
  "connected": true,
  "groupsCount": 12
}
```

### `GET /api/qrcode`
Get QR code for WhatsApp authentication
```json
{
  "qrCode": "data:image/png;base64,..."
}
```

### `GET /api/groups`
Get available WhatsApp groups
```json
{
  "groups": [
    {
      "id": "123@g.us",
      "name": "Family Group",
      "participants": 15
    }
  ]
}
```

### `POST /api/scrape`
Extract data from website
```json
{
  "url": "https://example.com",
  "scrapeType": "headlines",
  "limit": 5
}
```

### `POST /api/send`
Send messages to groups
```json
{
  "groups": ["123@g.us"],
  "template": "{{title}}\n{{link}}",
  "url": "https://example.com",
  "scrapeType": "headlines",
  "limit": 5
}
```

## 🚀 Deployment

### Local Deployment
Run on your computer:
```bash
node server.js
```
Keep terminal open for 24/7 operation.

### Cloud Deployment (Recommended)

#### Heroku
```bash
heroku create whatsapp-auto-poster
git push heroku main
```

#### DigitalOcean/AWS/VPS
1. Upload files to server
2. Install Node.js
3. Run with PM2:
```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

## ⚠️ Important Notes

### Legal & Ethics
- ✅ Use only for personal/business purposes
- ✅ Get consent before adding to groups
- ✅ Follow WhatsApp Terms of Service
- ❌ Don't spam
- ❌ Don't send unsolicited messages
- ❌ Respect privacy

### Rate Limiting
- Add delays between messages (2-3 seconds)
- Don't send too many messages per hour
- WhatsApp may ban accounts for spam

### Data Privacy
- Scraped data is processed locally
- No data stored on external servers
- WhatsApp session saved locally

## 🐛 Troubleshooting

### WhatsApp won't connect
- Clear browser cache
- Delete `.wwebjs_auth` folder
- Restart server
- Check internet connection

### Scraping fails
- Website may block bots
- Try different selectors
- Check website structure
- Some sites need authentication

### Messages not sending
- Check permissions granted
- Verify group IDs
- Check rate limits
- Ensure WhatsApp is connected

## 📝 Example Use Cases

1. **News Aggregator**: Extract headlines from news sites and post to group
2. **Price Monitor**: Track product prices and notify group of changes
3. **Job Board**: Auto-post new job listings from websites
4. **Event Updates**: Share event information automatically
5. **Content Sharing**: Distribute blog posts/articles to multiple groups

## 🔐 Security

- Never share your `.wwebjs_auth` folder
- Use environment variables for sensitive data
- Run on secure networks
- Keep dependencies updated

## 📦 Dependencies

- `express` - Web server
- `whatsapp-web.js` - WhatsApp integration
- `puppeteer` - Web scraping
- `cheerio` - HTML parsing
- `node-cron` - Scheduling
- `qrcode` - QR code generation

## 🤝 Contributing

Pull requests welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - Free to use and modify

## 📧 Support

Issues? Open a GitHub issue or contact via repository.

## ⭐ Acknowledgments

- WhatsApp Web.js team
- Puppeteer developers
- Open source community

---

**Made with ❤️ by Meelad5815**

🌟 Star this repo if you find it useful!

**Repository**: https://github.com/Meelad5815/whatsapp-auto-poster