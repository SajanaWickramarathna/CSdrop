const express = require("express");
const cors = require("cors");
const router = require("./router"); // Assuming this is your main API router
const path = require("path");
const http = require("http"); // Import http module
const connectDB = require("./config/db");

require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Load API routes
app.use("/api", router);

// New: Chat model for saving messages
const Chat = require("./Models/chatModel");

// Create HTTP server & wrap with Socket.io
const server = http.createServer(app); // Create HTTP server from Express app
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

// Socket.io real-time chat handling
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join a ticket-specific room
  socket.on("join_ticket", ({ ticketId }) => {
    const room = `ticket_${ticketId}`;
    socket.join(room);
    console.log(`→ ${socket.id} joined ${room}`);
  });

  // Receive and broadcast a new chat message
  socket.on("send_message", async ({ ticketId, sender_id, sender_role, message }) => {
    try {
      // Persist to Mongo
      const chat = await Chat.create({ ticketId, sender_id, sender_role, message });
      const room = `ticket_${ticketId}`;

      // Broadcast to everyone in this ticket room
      io.to(room).emit("receive_message", {
        _id: chat._id,
        ticketId: chat.ticketId,
        sender_id: chat.sender_id,
        sender_role: chat.sender_role,
        message: chat.message,
        timestamp: chat.timestamp,
      });
    } catch (err) {
      console.error("⚠️ Error saving chat or broadcasting:", err); // More descriptive error
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });

  // Handle potential Socket.IO errors
  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err);
  });
});

connectDB();

// Start Server (Listen on the HTTP server, not just the Express app)
const PORT = process.env.PORT || 3001; // Ensure this matches your frontend socket URL
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});