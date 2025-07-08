const express = require('express');
const router = express.Router();
const { getChatsByTicketId, addChatMessage } = require('../Controllers/chatController');

router.get('/:ticketId', getChatsByTicketId);
router.post('/', addChatMessage);

module.exports = router;
