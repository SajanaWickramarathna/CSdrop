const Chat = require("../Models/chatModel");

// Get all chat messages for a specific ticket
exports.getChatsByTicketId = async (req, res) => {
  try {
    const chats = await Chat.find({ ticketId: req.params.ticketId }).sort("timestamp");
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new chat message
exports.addChatMessage = async (req, res) => {
  try {
    const { ticketId, sender_id, sender_role, message } = req.body;

    const newChat = new Chat({ ticketId, sender_id, sender_role, message });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
