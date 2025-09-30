const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 9000;

// CORS configuration - More permissive for debugging
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS Check - Origin:', origin, 'NODE_ENV:', process.env.NODE_ENV);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin - allowing');
      return callback(null, true);
    }
    
    // Always allow Vercel domains and localhost
    if (origin.includes('vercel.app') || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        origin.includes('ai-assignment-1-ojix.onrender.com')) {
      console.log('Allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // For now, let's allow all origins to debug the issue
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200
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

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  console.log('Preflight request received for:', req.path);
  console.log('Origin:', req.headers.origin);
  res.status(200).end();
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
