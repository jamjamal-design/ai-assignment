const express = require('express');
const router = express.Router();
const { 
  generateContent, 
  sendMessage, 
  getConversations, 
  getConversation, 
  searchConversations, 
  deleteConversation 
} = require('../controllers/aiController');

// Legacy endpoint for direct content generation
router.post('/generate', generateContent);

// Chat endpoints
router.post('/chat', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversations/search', searchConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;
