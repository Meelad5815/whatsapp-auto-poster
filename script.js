// Global state
let whatsappConnected = false;
let permissionsGranted = false;
let activeAutomations = [];
let availableGroups = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAutomations();
    setupFormHandlers();
});

// Connect to WhatsApp
function connectWhatsApp() {
    showLoading('Generating QR Code...');
    
    // Simulate QR code generation
    setTimeout(() => {
        const qrCode = document.getElementById('qrCode');
        qrCode.innerHTML = `
            <svg width="280" height="280" style="background:white;padding:10px;">
                <rect width="280" height="280" fill="white"/>
                <text x="140" y="140" text-anchor="middle" font-size="16" fill="#333">
                    QR Code Will Appear Here\n\n(Backend Integration Required)
                </text>
            </svg>
        `;
        
        hideLoading();
        showNotification('Scan QR code with WhatsApp mobile app', 'info');
        
        // Simulate successful connection after 3 seconds
        setTimeout(() => {
            whatsappConnected = true;
            updateConnectionStatus(true);
            document.getElementById('qrSection').style.display = 'none';
            document.getElementById('permissionSection').style.display = 'block';
            showNotification('WhatsApp Connected! Please grant permissions.', 'success');
        }, 3000);
    }, 1500);
}

// Grant permissions
function grantPermissions() {
    const sendMessages = document.getElementById('permSendMessages').checked;
    
    if (!sendMessages) {
        showNotification('Send Messages permission is required!', 'error');
        return;
    }
    
    permissionsGranted = true;
    showNotification('Permissions granted successfully!', 'success');
    
    // Load WhatsApp groups
    loadWhatsAppGroups();
}

// Update connection status
function updateConnectionStatus(connected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');
    
    if (connected) {
        statusDot.classList.remove('offline');
        statusDot.classList.add('online');
        statusText.textContent = 'WhatsApp Connected';
    } else {
        statusDot.classList.remove('online');
        statusDot.classList.add('offline');
        statusText.textContent = 'Not Connected';
    }
}

// Load WhatsApp groups (simulated)
function loadWhatsAppGroups() {
    availableGroups = [
        { id: '1', name: 'Family Group', members: 15 },
        { id: '2', name: 'Work Team', members: 8 },
        { id: '3', name: 'Friends Forever', members: 12 },
        { id: '4', name: 'Business Updates', members: 45 },
        { id: '5', name: 'Tech News Channel', members: 234 },
        { id: '6', name: 'Marketing Pro', members: 67 }
    ];
    
    displayGroups();
}

// Display groups
function displayGroups() {
    const groupsList = document.getElementById('groupsList');
    
    if (availableGroups.length === 0) {
        groupsList.innerHTML = '<p class="empty-state">Connect WhatsApp first to load groups</p>';
        return;
    }
    
    groupsList.innerHTML = availableGroups.map(group => `
        <div class="group-item">
            <input type="checkbox" id="group_${group.id}" value="${group.id}">
            <div class="group-info">
                <div class="group-name">📱 ${group.name}</div>
                <div class="group-members">${group.members} members</div>
            </div>
        </div>
    `).join('');
}

// Test extraction
function testExtraction() {
    const url = document.getElementById('websiteUrl').value;
    const scrapeType = document.getElementById('scrapeType').value;
    const limit = document.getElementById('dataLimit').value;
    
    if (!url) {
        showNotification('Please enter a website URL', 'error');
        return;
    }
    
    showLoading('Extracting data from website...');
    
    // Simulate data extraction
    setTimeout(() => {
        const mockData = generateMockData(scrapeType, limit);
        displayExtractedData(mockData);
        hideLoading();
        showNotification('Data extracted successfully!', 'success');
    }, 2000);
}

// Generate mock data
function generateMockData(type, limit) {
    const data = [];
    const count = parseInt(limit);
    
    for (let i = 1; i <= count; i++) {
        switch(type) {
            case 'headlines':
                data.push({
                    title: `Breaking News ${i}: Important Update`,
                    link: `https://example.com/news/${i}`
                });
                break;
            case 'products':
                data.push({
                    title: `Product ${i}`,
                    price: `$${(Math.random() * 100 + 10).toFixed(2)}`,
                    link: `https://example.com/product/${i}`
                });
                break;
            case 'text':
                data.push({
                    title: `Article ${i}`,
                    description: 'Sample content extracted from website...',
                    link: `https://example.com/article/${i}`
                });
                break;
            default:
                data.push({
                    title: `Item ${i}`,
                    link: `https://example.com/item/${i}`
                });
        }
    }
    
    return data;
}

// Display extracted data
function displayExtractedData(data) {
    const preview = document.getElementById('extractedPreview');
    const content = document.getElementById('previewContent');
    
    content.innerHTML = data.map((item, index) => `
        <div class="preview-item">
            <strong>${index + 1}. ${item.title}</strong><br>
            ${item.price ? `<span>Price: ${item.price}</span><br>` : ''}
            ${item.description ? `<span>${item.description}</span><br>` : ''}
            <small>${item.link}</small>
        </div>
    `).join('');
    
    preview.style.display = 'block';
}

// Setup form handlers
function setupFormHandlers() {
    document.getElementById('autoPostForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!whatsappConnected || !permissionsGranted) {
            showNotification('Please connect WhatsApp and grant permissions first!', 'error');
            return;
        }
        
        const selectedGroups = Array.from(document.querySelectorAll('#groupsList input:checked'))
            .map(input => {
                const groupId = input.value;
                return availableGroups.find(g => g.id === groupId);
            });
        
        if (selectedGroups.length === 0) {
            showNotification('Please select at least one group!', 'error');
            return;
        }
        
        const automation = {
            id: Date.now(),
            url: document.getElementById('websiteUrl').value,
            scrapeType: document.getElementById('scrapeType').value,
            template: document.getElementById('messageTemplate').value,
            groups: selectedGroups,
            interval: document.getElementById('postInterval').value,
            maxPosts: document.getElementById('maxPosts').value,
            includeImages: document.getElementById('includeImages').checked,
            avoidDuplicates: document.getElementById('avoidDuplicates').checked,
            addTimestamp: document.getElementById('addTimestamp').checked,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastRun: null,
            totalPosts: 0
        };
        
        activeAutomations.push(automation);
        saveAutomations();
        displayAutomations();
        
        showNotification('Auto-posting activated! 🚀', 'success');
        this.reset();
    });
}

// Display automations
function displayAutomations() {
    const list = document.getElementById('automationsList');
    
    if (activeAutomations.length === 0) {
        list.innerHTML = '<p class="empty-state">No active automations. Create one above!</p>';
        return;
    }
    
    list.innerHTML = activeAutomations.map(auto => `
        <div class="automation-card">
            <div class="automation-info">
                <h4>🌐 ${auto.url}</h4>
                <div class="automation-meta">
                    <span>📊 Type: ${auto.scrapeType}</span>
                    <span>⏱️ Interval: ${formatInterval(auto.interval)}</span>
                    <span>👥 Groups: ${auto.groups.length}</span>
                    <span>📨 Posts: ${auto.totalPosts}</span>
                </div>
                <span class="automation-status ${auto.status}">
                    ${auto.status.toUpperCase()}
                </span>
            </div>
            <div class="automation-controls">
                <button class="btn-small btn-pause" onclick="toggleAutomation(${auto.id})">
                    ${auto.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button class="btn-small btn-delete" onclick="deleteAutomation(${auto.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Format interval
function formatInterval(interval) {
    if (interval === 'instant') return 'One-time';
    const minutes = parseInt(interval);
    if (minutes < 60) return `${minutes} min`;
    if (minutes === 1440) return 'Daily';
    return `${Math.floor(minutes/60)} hours`;
}

// Toggle automation
function toggleAutomation(id) {
    const auto = activeAutomations.find(a => a.id === id);
    if (auto) {
        auto.status = auto.status === 'active' ? 'paused' : 'active';
        saveAutomations();
        displayAutomations();
        showNotification(`Automation ${auto.status}`, 'info');
    }
}

// Delete automation
function deleteAutomation(id) {
    if (confirm('Are you sure you want to delete this automation?')) {
        activeAutomations = activeAutomations.filter(a => a.id !== id);
        saveAutomations();
        displayAutomations();
        showNotification('Automation deleted', 'success');
    }
}

// Save/Load automations
function saveAutomations() {
    localStorage.setItem('whatsappAutomations', JSON.stringify(activeAutomations));
}

function loadAutomations() {
    const saved = localStorage.getItem('whatsappAutomations');
    if (saved) {
        activeAutomations = JSON.parse(saved);
        displayAutomations();
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const colors = {
        success: '#25D366',
        error: '#dc3545',
        info: '#667eea'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showLoading(message) {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-size: 1.2em;
    `;
    loader.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:3em;margin-bottom:20px;">⏳</div>
            <div>${message}</div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.remove();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);