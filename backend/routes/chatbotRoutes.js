const express = require('express');
const router = express.Router();
const { askChatbot } = require('../controllers/chatbotController');

// Open to all users (authenticated or visitors) so anyone can get UI help
router.post('/ask', askChatbot);

module.exports = router;
