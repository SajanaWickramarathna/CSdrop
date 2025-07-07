import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./resources/chat.css";

const Chat = ({ ticketId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  const previousMessageCount = useRef(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/chats/${ticketId}`);
        setMessages(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    // Auto-refresh messages every 1 second
    const interval = setInterval(fetchMessages, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    // Scroll to bottom only if a new message is added
    if (messages.length > previousMessageCount.current) {
      scrollToBottom();
    }
    previousMessageCount.current = messages.length;
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post('http://localhost:3001/api/chats', {
          ticketId,
          sender: user,
          message: newMessage,
        });
        setMessages([...messages, response.data]);
        setNewMessage('');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender === user ? 'sent' : 'received'}`}>
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