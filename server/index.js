const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 9000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ai-ten-alpha-19.vercel.app', 'https://ai-k0yd.onrender.com'] // Your deployed frontend and backend
    : ['http://localhost:5173', 'http://localhost:9000'], // Allow local development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// Database connection
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  No MONGODB_URI provided, using file storage');
    const FileStorage = require('./storage/FileStorage');
    global.fileStorage = new FileStorage();
    return 'file';
  }

  try {
    // MongoDB Atlas connection options
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('📦 Connected to MongoDB Atlas successfully');
    console.log('🌍 Database:', mongoose.connection.name);
    
    // Clear any existing file storage
    if (global.fileStorage) {
      delete global.fileStorage;
    }
    
    return 'mongodb';
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.warn('📁 Falling back to file storage');
    const FileStorage = require('./storage/FileStorage');
    global.fileStorage = new FileStorage();
    return 'file';
  }
};

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

// Start server
const startServer = async () => {
  const storageType = await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 AI Backend Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Storage: ${storageType}`);
    
    if (storageType === 'mongodb') {
      console.log('🔗 Using MongoDB Atlas for data persistence');
    } else {
      console.log('📁 Using file storage (data saved locally)');
    }
  });
};

startServer();

module.exports = app;
