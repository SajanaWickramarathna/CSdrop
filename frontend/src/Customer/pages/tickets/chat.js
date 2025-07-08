import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./resources/chat.css";

const Chat = ({ ticketId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const previousMessageCount = useRef(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/chats/${ticketId}`
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      scrollToBottom();
    }
    previousMessageCount.current = messages.length;
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post("http://localhost:3001/api/chats", {
        ticket_id: ticketId, // ✅ Make sure this is a valid ObjectId string like "66cc88e122d1d43f3bbf3d2b"
        sender: user,
        message: newMessage,
      });
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err.response?.data || err.message);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && <p>No messages yet.</p>}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === user ? "sent" : "received"
            }`}
          >
            <p>{msg.message}</p>
            <span>{msg.sender}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
