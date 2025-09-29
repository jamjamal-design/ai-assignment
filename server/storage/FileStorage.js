const fs = require('fs');
const path = require('path');

class FileStorage {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.conversationsFile = path.join(this.dataDir, 'conversations.json');
    this.ensureDataDir();
    this.conversations = this.loadConversations();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  loadConversations() {
    try {
      if (fs.existsSync(this.conversationsFile)) {
        const data = fs.readFileSync(this.conversationsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load conversations from file:', error.message);
    }
    return [];
  }

  saveConversations() {
    try {
      fs.writeFileSync(this.conversationsFile, JSON.stringify(this.conversations, null, 2));
    } catch (error) {
      console.error('Failed to save conversations:', error.message);
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  createConversation(data) {
    const conversation = {
      _id: this.generateId(),
      title: data.title || 'New Conversation',
      messages: data.messages || [],
      sessionId: data.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.conversations.push(conversation);
    this.saveConversations();
    return conversation;
  }

  findById(id) {
    return this.conversations.find(conv => conv._id === id);
  }

  findBySessionId(sessionId) {
    return this.conversations.filter(conv => conv.sessionId === sessionId);
  }

  updateConversation(id, updates) {
    const index = this.conversations.findIndex(conv => conv._id === id);
    if (index !== -1) {
      this.conversations[index] = {
        ...this.conversations[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveConversations();
      return this.conversations[index];
    }
    return null;
  }

  deleteConversation(id) {
    const index = this.conversations.findIndex(conv => conv._id === id);
    if (index !== -1) {
      const deleted = this.conversations.splice(index, 1)[0];
      this.saveConversations();
      return deleted;
    }
    return null;
  }

  searchConversations(query, options = {}) {
    const { limit = 20, skip = 0 } = options;
    const searchTerm = query.toLowerCase();
    
    const results = this.conversations.filter(conv => {
      // Search in title
      if (conv.title.toLowerCase().includes(searchTerm)) return true;
      
      // Search in messages
      return conv.messages.some(msg => 
        msg.content.toLowerCase().includes(searchTerm)
      );
      
      // Search in tags
      if (conv.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
      
      return false;
    });

    // Sort by updatedAt (newest first)
    results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Apply pagination
    return results.slice(skip, skip + limit);
  }

  getAllConversations(options = {}) {
    const { limit = 20, skip = 0, sessionId } = options;
    
    let results = [...this.conversations];
    
    if (sessionId) {
      results = results.filter(conv => conv.sessionId === sessionId);
    }
    
    // Sort by updatedAt (newest first)
    results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Apply pagination
    return results.slice(skip, skip + limit);
  }

  addMessage(conversationId, message) {
    const conversation = this.findById(conversationId);
    if (conversation) {
      conversation.messages.push({
        ...message,
        timestamp: message.timestamp || new Date().toISOString()
      });
      
      // Update title if this is the first user message
      if (conversation.messages.length === 1 && message.role === 'user') {
        conversation.title = message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
      }
      
      return this.updateConversation(conversationId, conversation);
    }
    return null;
  }
}

module.exports = FileStorage;