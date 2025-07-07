const Chat = require("../Models/chatModel");
const Ticket = require("../Models/ticketModel");
const Notification = require("../Models/notification");

// Get all chats by ticket_id
const getChatsByTicketId = async (req, res) => {
  const ticketId = parseInt(req.params.ticketId);

  try {
    const chats = await Chat.find({ ticket_id: ticketId }).sort("timestamp");
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new chat message
const addChatMessage = async (req, res) => {
  const { ticket_id, sender, message } = req.body;

  try {
    // Find the ticket by ticket_id
    const ticket = await Ticket.findOne({ ticket_id: ticket_id });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Auto-increment Chat_id
    const lastChat = await Chat.findOne().sort({ Chat_id: -1 });
    const newChatId = lastChat ? lastChat.Chat_id + 1 : 1;

    const newChat = new Chat({
      ticket_id,
      Chat_id: newChatId,
      sender,
      message,
    });

    const savedChat = await newChat.save();

    // 🔔 Notify user if message from admin
    if (sender === "admin") {
      await Notification.create({
        user_id: Number(ticket.user_id),
        message: `A new message has been added to your ticket by the support team: "${message}"`,
      });
    }

    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatsByTicketId,
  addChatMessage,
};
