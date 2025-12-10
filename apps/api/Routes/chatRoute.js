const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chatController");

router.get("/:ticketId", chatController.getChatsByTicketId);
router.post("/", chatController.addChatMessage);

module.exports = router;
