const AIService = require('../service/aiService');

// Initialize AI service
const aiService = new AIService();

const generateContent = async (req, res) => {
  try {
    // Add explicit CORS headers as backup
    const origin = req.headers.origin;
    if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept');
    }
    
    const { contents, model = 'gemini-1.5-flash' } = req.body;
    
    // Use the AI service with integrated retry logic
    const result = await aiService.generateContent(contents, model);
    
    return res.status(200).json({
      success: true,
      text: result.text,
      model: result.model,
      attempt: result.attempt,
      timestamp: result.timestamp
    });

  } catch (error) {
    // Handle specific error types from AI service
    switch (error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        // Add CORS headers to error response
        const origin1 = req.headers.origin;
        if (origin1 && (origin1.includes('vercel.app') || origin1.includes('localhost'))) {
          res.header('Access-Control-Allow-Origin', origin1);
          res.header('Access-Control-Allow-Credentials', 'true');
        }
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: error.message,
          retryAfter: error.retryAfter || 120
        });

      case 'QUOTA_EXCEEDED':
        // Add CORS headers to error response
        const origin2 = req.headers.origin;
        if (origin2 && (origin2.includes('vercel.app') || origin2.includes('localhost'))) {
          res.header('Access-Control-Allow-Origin', origin2);
          res.header('Access-Control-Allow-Credentials', 'true');
        }
        return res.status(429).json({
          success: false,
          error: 'API quota exceeded',
          message: error.message
        });

      case 'AUTH_ERROR':
        // Add CORS headers to error response
        const origin3 = req.headers.origin;
        if (origin3 && (origin3.includes('vercel.app') || origin3.includes('localhost'))) {
          res.header('Access-Control-Allow-Origin', origin3);
          res.header('Access-Control-Allow-Credentials', 'true');
        }
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: error.message
        });

      case 'GENERATION_FAILED':
        // Add CORS headers to error response
        const origin4 = req.headers.origin;
        if (origin4 && (origin4.includes('vercel.app') || origin4.includes('localhost'))) {
          res.header('Access-Control-Allow-Origin', origin4);
          res.header('Access-Control-Allow-Credentials', 'true');
        }
        return res.status(500).json({
          success: false,
          error: 'Content generation failed',
          message: error.message
        });

      default:
        // Handle validation errors
        if (error.message.includes('Invalid model') || 
            error.message.includes('Contents must be')) {
          // Add CORS headers to error response
          const origin5 = req.headers.origin;
          if (origin5 && (origin5.includes('vercel.app') || origin5.includes('localhost'))) {
            res.header('Access-Control-Allow-Origin', origin5);
            res.header('Access-Control-Allow-Credentials', 'true');
          }
          return res.status(400).json({
            success: false,
            error: 'Invalid request',
            message: error.message
          });
        }

        // Generic error
        // Add CORS headers to error response
        const origin6 = req.headers.origin;
        if (origin6 && (origin6.includes('vercel.app') || origin6.includes('localhost'))) {
          res.header('Access-Control-Allow-Origin', origin6);
          res.header('Access-Control-Allow-Credentials', 'true');
        }
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
  }
};module.exports = { generateContent };
