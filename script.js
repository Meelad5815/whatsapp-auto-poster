// Store scheduled posts
let scheduledPosts = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setMinDate();
});

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
}

// Handle form submission
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = document.getElementById('message').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const groupsSelect = document.getElementById('groups');
    const selectedGroups = Array.from(groupsSelect.selectedOptions).map(opt => opt.text);
    const repeat = document.getElementById('repeat').checked;
    
    if (selectedGroups.length === 0) {
        alert('Please select at least one group or channel');
        return;
    }
    
    const post = {
        id: Date.now(),
        message: message,
        date: date,
        time: time,
        groups: selectedGroups,
        repeat: repeat,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };
    
    scheduledPosts.push(post);
    savePosts();
    displayPosts();
    
    // Reset form
    this.reset();
    
    // Show success message
    showNotification('Post scheduled successfully! ✅');
});

// Display posts
function displayPosts() {
    const postsList = document.getElementById('postsList');
    
    if (scheduledPosts.length === 0) {
        postsList.innerHTML = '<p class="empty-state">No scheduled posts yet. Create one above!</p>';
        return;
    }
    
    postsList.innerHTML = scheduledPosts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <h4>📱 ${post.message.substring(0, 50)}${post.message.length > 50 ? '...' : ''}</h4>
                <p><strong>Date & Time:</strong> ${formatDate(post.date)} at ${post.time}</p>
                <p><strong>Groups:</strong> ${post.groups.join(', ')}</p>
                <p class="post-meta">Status: ${post.status.toUpperCase()} ${post.repeat ? '🔄 (Repeats Daily)' : ''}</p>
            </div>
            <button class="btn-delete" onclick="deletePost(${post.id})">Delete</button>
        </div>
    `).join('');
}

// Delete post
function deletePost(id) {
    if (confirm('Are you sure you want to delete this scheduled post?')) {
        scheduledPosts = scheduledPosts.filter(post => post.id !== id);
        savePosts();
        displayPosts();
        showNotification('Post deleted successfully');
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('whatsappScheduledPosts', JSON.stringify(scheduledPosts));
}

// Load posts from localStorage
function loadPosts() {
    const saved = localStorage.getItem('whatsappScheduledPosts');
    if (saved) {
        scheduledPosts = JSON.parse(saved);
        displayPosts();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);