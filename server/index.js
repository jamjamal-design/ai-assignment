const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 9000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://ai-ten-alpha-19.vercel.app', // Old Vercel URL (keep for backwards compatibility)
        'https://ai-assignment-1-ojix.onrender.com', // Your backend URL (for self-requests)
        process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app' // Your actual frontend URL - update this after deploying
      ]
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'], // Allow local development (including Vite preview)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Backend Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/ai', aiRoutes);

// Handle 404 routes - compatible with all path-to-regexp versions
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 AI Backend Server running on port ${PORT}`);
});

module.exports = app;
