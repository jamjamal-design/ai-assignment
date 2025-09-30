const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 9000;

// CORS configuration - Simplified and more reliable
const corsOptions = {
  origin: true, // Allow all origins for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));

// Additional CORS middleware to ensure headers are always set
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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
