const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: function() {
      // Generate title from first user message (truncated)
      const firstUserMessage = this.messages.find(msg => msg.role === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.length > 50 
          ? firstUserMessage.content.substring(0, 50) + '...'
          : firstUserMessage.content;
      }
      return 'New Conversation';
    }
  },
  messages: [messageSchema],
  sessionId: {
    type: String,
    default: function() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    }
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create text indexes for search functionality
conversationSchema.index({
  'messages.content': 'text',
  'title': 'text',
  'tags': 'text'
});

// Update the updatedAt field before saving
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to add a message
conversationSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content });
  this.updatedAt = new Date();
  return this.save();
};

// Static method to search conversations
conversationSchema.statics.searchConversations = function(query, options = {}) {
  const { limit = 20, skip = 0, sortBy = 'updatedAt', sortOrder = -1 } = options;
  
  const searchQuery = {
    $or: [
      { 'messages.content': { $regex: query, $options: 'i' } },
      { 'title': { $regex: query, $options: 'i' } },
      { 'tags': { $regex: query, $options: 'i' } }
    ]
  };

  return this.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip)
    .select('title messages.content messages.role createdAt updatedAt sessionId tags');
};

module.exports = mongoose.model('Conversation', conversationSchema);