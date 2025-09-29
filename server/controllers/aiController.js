const AIService = require('../service/aiService');
const Conversation = require('../models/Conversation');

// Initialize AI service
const aiService = new AIService();

const generateContent = async (req, res) => {
  try {
    const { contents, model = 'gemini-2.5-flash' } = req.body;
    
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
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: error.message,
          retryAfter: error.retryAfter || 120
        });

      case 'QUOTA_EXCEEDED':
        return res.status(429).json({
          success: false,
          error: 'API quota exceeded',
          message: error.message
        });

      case 'AUTH_ERROR':
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: error.message
        });

      case 'GENERATION_FAILED':
        return res.status(500).json({
          success: false,
          error: 'Content generation failed',
          message: error.message
        });

      default:
        // Handle validation errors
        if (error.message.includes('Invalid model') || 
            error.message.includes('Contents must be')) {
          return res.status(400).json({
            success: false,
            error: 'Invalid request',
            message: error.message
          });
        }

        // Generic error
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
  }
};

// Send message and save to conversation history
const sendMessage = async (req, res) => {
  try {
  const { message, conversationId, sessionId, model } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    let conversation;

    // Use file storage if MongoDB is not available
    if (global.fileStorage) {
      // Find existing conversation or create new one
      if (conversationId) {
        conversation = global.fileStorage.findById(conversationId);
        if (!conversation) {
          return res.status(404).json({
            success: false,
            error: 'Conversation not found'
          });
        }
      } else {
        // Create new conversation
        conversation = global.fileStorage.createConversation({
          sessionId: sessionId || undefined,
          messages: []
        });
      }

      // Add user message
      global.fileStorage.addMessage(conversation._id, {
        role: 'user',
        content: message.trim()
      });

      // Generate AI response
  const result = await aiService.generateContent(message.trim(), model || 'gemini-2.5-flash');

      // Add AI response
      conversation = global.fileStorage.addMessage(conversation._id, {
        role: 'assistant',
        content: result.text
      });

      return res.status(200).json({
        success: true,
        conversationId: conversation._id,
        sessionId: conversation.sessionId,
        message: {
          role: 'assistant',
          content: result.text,
          timestamp: new Date().toISOString()
        },
        conversationTitle: conversation.title
      });
    } else {
      // Use MongoDB
      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return res.status(404).json({
            success: false,
            error: 'Conversation not found'
          });
        }
      } else {
        conversation = new Conversation({
          sessionId: sessionId || undefined,
          messages: []
        });
      }

      // Add user message to conversation
      conversation.messages.push({
        role: 'user',
        content: message.trim()
      });

      // Generate AI response
  const result = await aiService.generateContent(message.trim(), model || 'gemini-2.5-flash');

      // Add AI response to conversation
      conversation.messages.push({
        role: 'assistant',
        content: result.text
      });

      // Update conversation title if it's new (based on first user message)
      if (conversation.messages.length === 2) {
        conversation.title = message.length > 50 
          ? message.substring(0, 50) + '...'
          : message;
      }

      // Save conversation
      await conversation.save();

      return res.status(200).json({
        success: true,
        conversationId: conversation._id,
        sessionId: conversation.sessionId,
        message: {
          role: 'assistant',
          content: result.text,
          timestamp: new Date().toISOString()
        },
        conversationTitle: conversation.title
      });
    }

  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Get conversation history
const getConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20, sessionId } = req.query;
    const skip = (page - 1) * limit;

    let conversations, total;

    if (global.fileStorage) {
      // Use file storage
      conversations = global.fileStorage.getAllConversations({ 
        limit: parseInt(limit), 
        skip, 
        sessionId 
      });
      
      // For file storage, we'll estimate total based on current results
      total = conversations.length + skip;
    } else {
      // Use MongoDB
      const query = sessionId ? { sessionId } : {};
      
      conversations = await Conversation.find(query)
        .sort({ updatedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .select('title createdAt updatedAt sessionId messages');

      total = await Conversation.countDocuments(query);
    }

    return res.status(200).json({
      success: true,
      conversations,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + conversations.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversations',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Get specific conversation
const getConversation = async (req, res) => {
  try {
    const { id } = req.params;

    let conversation;

    if (global.fileStorage) {
      conversation = global.fileStorage.findById(id);
    } else {
      conversation = await Conversation.findById(id);
    }
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    return res.status(200).json({
      success: true,
      conversation
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Search conversations
const searchConversations = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;
    let conversations;

    if (global.fileStorage) {
      conversations = global.fileStorage.searchConversations(query.trim(), {
        limit: parseInt(limit),
        skip: skip
      });
    } else {
      conversations = await Conversation.searchConversations(query.trim(), {
        limit: parseInt(limit),
        skip: skip
      });
    }

    return res.status(200).json({
      success: true,
      conversations,
      query: query.trim(),
      pagination: {
        current: parseInt(page),
        hasNext: conversations.length === parseInt(limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Search conversations error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search conversations',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Delete conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    let conversation;

    if (global.fileStorage) {
      conversation = global.fileStorage.deleteConversation(id);
    } else {
      conversation = await Conversation.findByIdAndDelete(id);
    }
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete conversation',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

module.exports = { 
  generateContent, 
  sendMessage, 
  getConversations, 
  getConversation, 
  searchConversations, 
  deleteConversation 
};
