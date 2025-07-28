import React, { useState, useRef, useEffect } from "react";
import chatbotMessages from "../Chatbot/PredefienedMessages";
import chatbotIcon from "../assets/assistant.png";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import "./Chatbot.css";

function Chatbot() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [, setTimestampRefreshCounter] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to get the current date and time in the required format
  const getCurrentDate = () => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date().toLocaleString("en-US", options);
  };

  // Function to calculate the time difference from the current time
  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const diffInSeconds = (now - timestamp) / 1000;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Function to fetch bot response
  const getResponse = async (input) => {
    const message = chatbotMessages.find(
      (msg) => msg.prompt === input
    )?.message;

    if (message) {
      return message;
    }

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDLUPtSpNZLeuogMKC4qjtXc3_Y49eJnrI`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: input }] }],
        },
      });
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        chatbotMessages["default"]
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I'm having trouble responding right now.";
    }
  };

  // Handle sending the user's message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, fromUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);

      const botResponseText = await getResponse(input);
      const botResponse = {
        text: botResponseText,
        fromUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 2000);
  };

  // Refresh timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampRefreshCounter((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="chatbot-container">
      {!isChatbotOpen && (
        <motion.div
          onClick={() => setIsChatbotOpen(true)}
          className="chatbot-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            src={chatbotIcon}
            alt="Chat Icon"
            className="chatbot-icon-image"
          />
        </motion.div>
      )}

      {isChatbotOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <h2 className="chatbot-name">How can we help</h2>
            </div>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="chatbot-close-btn"
            >
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            <p className="chatbot-date">{getCurrentDate()}</p>

            <div className="chatbot-greeting">
              <div className="chatbot-greeting-header">
                <span>How can we help you today?</span>
              </div>

              <div className="chatbot-greeting-message">
                <motion.p
                  className="chatbot-greeting-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Hi there! I'm your virtual assistant. Let me know if you have
                  any questions!
                </motion.p>
              </div>
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.fromUser ? "user-message" : "bot-message"
                }`}
              >
                {!msg.fromUser && (
                  <img
                    src={chatbotIcon}
                    alt="Chat Icon"
                    className="chatbot-icon-image-inChat"
                  />
                )}

                <div className="message-content">
                  {msg.image ? (
                    <img src={msg.image} alt="Uploaded" />
                  ) : (
                    <p
                      className="message-text"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  )}
                </div>

                {!msg.fromUser && (
                  <div className="message-time-container">
                    <p className="message-time">
                      {getTimeDifference(msg.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {(loading || isTyping) && (
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Start a new message..."
              value={input}
              onChange={(e) => setInput(capitalize(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="chatbot-input"
            />
            <button onClick={handleSend} className="chatbot-send-btn">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
