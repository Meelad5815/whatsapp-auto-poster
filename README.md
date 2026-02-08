# WhatsApp Auto Poster 📱

A web-based application for scheduling and automating WhatsApp messages to multiple groups and channels.

## Features

- ⏰ **Schedule Messages**: Set specific dates and times for automatic message delivery
- 👥 **Multiple Groups**: Post to multiple WhatsApp groups and channels simultaneously
- 🔄 **Recurring Posts**: Option to repeat messages daily
- 📊 **Post Management**: View and manage all scheduled posts
- 🎨 **Modern UI**: Clean, responsive design that works on all devices
- 💾 **Local Storage**: Posts are saved locally in your browser

## Demo

This is a front-end demo showcasing the user interface and scheduling functionality. Full WhatsApp integration requires additional backend setup with WhatsApp Business API.

## Getting Started

### Installation

1. Clone this repository:
```bash
git clone https://github.com/Meelad5815/whatsapp-auto-poster.git
cd whatsapp-auto-poster
```

2. Open `index.html` in your web browser, or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

### Usage

1. **Create a Post**:
   - Enter your message in the text area
   - Select the date and time for posting
   - Choose one or more groups/channels
   - Optionally enable daily repeat
   - Click "Schedule Post"

2. **Manage Posts**:
   - View all scheduled posts in the list
   - Delete posts by clicking the delete button

3. **Setup for Production**:
   - For actual WhatsApp integration, you'll need:
     - WhatsApp Business API account
     - Backend server (Node.js recommended)
     - Database for storing posts
     - Authentication system

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: LocalStorage (for demo)
- **Design**: Responsive, mobile-first approach

## Production Requirements

To make this fully functional:

1. **Backend Setup**:
   - Node.js with Express
   - WhatsApp Business API integration
   - Database (MongoDB/PostgreSQL)
   - Job scheduler (node-cron)

2. **WhatsApp Integration**:
   - Register for WhatsApp Business API
   - Implement webhook handlers
   - Set up authentication flow

3. **Deployment**:
   - Host backend on cloud platform (AWS, Heroku, DigitalOcean)
   - Set up SSL certificate
   - Configure environment variables

## Libraries for Backend Integration

Recommended packages:
- `whatsapp-web.js` - WhatsApp Web API wrapper
- `node-cron` - Task scheduler
- `express` - Web framework
- `mongoose` - MongoDB ODM

## Important Notes

⚠️ **Disclaimer**: 
- This is a demonstration project for educational purposes
- Automated messaging must comply with WhatsApp's Terms of Service
- Consider user consent and spam regulations
- Use responsibly and ethically

## License

MIT License - Feel free to use and modify for your projects

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## Support

For questions or issues, please open an issue on GitHub.

---

**Created with ❤️ for automation enthusiasts**