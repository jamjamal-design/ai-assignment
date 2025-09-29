# AI Chat Application - Gemini Powered

A full-stack AI chat application similar to Google Gemini, featuring conversation history, search functionality, and a modern React interface.

## 🚀 Features

- **Real-time AI Chat**: Powered by Google Gemini AI
- **Conversation History**: Automatic saving and loading of chat conversations
- **Search Functionality**: Find conversations by content or keywords
- **Session Management**: Organize chats by session
- **Responsive UI**: Modern, mobile-friendly interface
- **File Storage Fallback**: Works with or without MongoDB
- **Real-time Updates**: Live conversation updates
- **Export/Import**: Save conversation data

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI API Key (from [Google AI Studio](https://makersuite.google.com/app/apikey))
- MongoDB (optional - uses file storage as fallback)

## 🛠️ Installation & Setup

### 1. Clone or Download the Project

```bash
# Navigate to your project directory
cd "c:\Users\HP\OneDrive\Desktop\Level five\Assignment\ai assignment"
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env file with your credentials:
# GOOGLE_AI_API_KEY=your_actual_api_key_here
# MONGODB_URI=mongodb://localhost:27017/ai-chat (optional)
# PORT=9000
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to React app directory
cd "../AI pro"

# Install dependencies (if needed)
npm install
```

### 4. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend React App:**
```bash
cd "AI pro"
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5174 (or the port shown in terminal)
- **Backend API**: http://localhost:9000
- **Health Check**: http://localhost:9000/health

## 📱 How to Use

### Starting a New Chat
1. Open the application in your browser
2. Click "New Chat" button in the sidebar
3. Type your message in the input field
4. Press Enter or click the send button

### Managing Conversations
- **View History**: All conversations appear in the left sidebar
- **Search**: Use the search bar to find specific conversations
- **Delete**: Click the trash icon next to any conversation to delete it
- **Switch Chats**: Click on any conversation in the sidebar to continue it

### Search Features
- Search by message content
- Search by conversation titles
- Real-time search results
- Highlighted search terms

## 🔧 API Endpoints

### Chat Endpoints
- `POST /api/ai/chat` - Send a message and get AI response
- `GET /api/ai/conversations` - Get conversation history
- `GET /api/ai/conversations/:id` - Get specific conversation
- `DELETE /api/ai/conversations/:id` - Delete conversation
- `GET /api/ai/conversations/search?q=query` - Search conversations

### Health & Info
- `GET /health` - Server health check
- `GET /api/ai/generate` - Legacy content generation (still available)

## 💾 Storage Options

### File Storage (Default Fallback)
- Automatically used when MongoDB is unavailable
- Stores data in `server/data/conversations.json`
- No additional setup required
- Perfect for development and testing

### MongoDB (Recommended for Production)
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in your `.env` file
- Provides better performance and scalability
- Supports advanced search and indexing

## 🎨 Customization

### Styling
- Modify CSS files in `AI pro/src/components/`
- Update color scheme in CSS custom properties
- Responsive design works on all devices

### AI Model
- Change model in `aiController.js` (gemini-1.5-flash, gemini-1.5-pro)
- Adjust response parameters in `aiService.js`
- Add custom prompt templates

### Features
- Add conversation tags and categories
- Implement user authentication
- Add file upload capabilities
- Create conversation export/import

## 🚨 Troubleshooting

### Common Issues

**1. Server won't start**
- Check if port 9000 is available
- Verify Google AI API key in .env file
- Ensure all dependencies are installed

**2. Frontend connection errors**
- Verify backend server is running on port 9000
- Check CORS settings in server/index.js
- Ensure frontend is making requests to correct URL

**3. AI responses not working**
- Verify Google AI API key is valid
- Check API quota and limits
- Look for error messages in browser console

**4. Search not working**
- Ensure conversations exist in storage
- Check search query format
- Verify API endpoint responses

### Logs and Debugging
- Backend logs appear in the terminal running the server
- Frontend errors appear in browser developer console
- Enable development mode for detailed error messages

## 📈 Performance Tips

1. **Optimize Search**: Use specific keywords for better search results
2. **Manage Storage**: Regularly clean up old conversations if using file storage
3. **API Limits**: Be aware of Google AI API rate limits
4. **Caching**: Consider implementing response caching for frequent queries

## 🔒 Security Considerations

- Never expose your Google AI API key in frontend code
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Validate all user inputs on the backend
- Use HTTPS in production environments

## 📚 Project Structure

```
├── server/                 # Backend Express server
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models (MongoDB)
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── storage/          # File storage implementation
│   ├── middlewares/      # Express middlewares
│   ├── utils/           # Utility functions
│   ├── data/            # File storage directory
│   └── index.js         # Server entry point
│
├── AI pro/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main application component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
│
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Useful Links

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get your API key
- [React Documentation](https://react.dev/) - Frontend framework docs
- [Express.js Documentation](https://expressjs.com/) - Backend framework docs
- [MongoDB Documentation](https://docs.mongodb.com/) - Database documentation
- [Vite Documentation](https://vitejs.dev/) - Build tool documentation

---

**Built with ❤️ using React, Express.js, and Google Gemini AI**