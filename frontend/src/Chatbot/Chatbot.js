import React, { useState, useRef, useEffect } from "react";
import chatbotMessages from "../Chatbot/PredefienedMessages";
import chatbotIcon from "../assets/assistant.png";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

function Chatbot() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [, setTimestampRefreshCounter] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const getResponse = async (input) => {
    const message = chatbotMessages.find((msg) => msg.prompt === input)?.message;
    if (message) return message;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDLUPtSpNZLeuogMKC4qjtXc3_Y49eJnrI`,
        { contents: [{ parts: [{ text: input }] }] }
      );
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || chatbotMessages["default"];
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I'm having trouble responding right now.";
    }
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampRefreshCounter((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isChatbotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatbotOpen]);

  const capitalize = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="fixed bottom-1 right-1 z-50 lg:bottom-4 lg:right-4">
      {!isChatbotOpen && (
        <motion.div
          onClick={() => setIsChatbotOpen(true)}
          className="w-16 h-16 sm:w-12 sm:h-12 lg:w-20 lg:h-20 cursor-pointer rounded-full flex justify-center items-center hover:shadow-lg hover:scale-110 transition"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img src={chatbotIcon} alt="Chat Icon" className="w-full h-full object-cover rounded-full" />
        </motion.div>
      )}

      {isChatbotOpen && (
        <div className="w-[500px] h-[550px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-t-lg shadow-sm">
            <h2 className="text-lg font-bold">How can we help</h2>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="text-white hover:text-red-500 hover:bg-white/30 rounded-full p-1 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-3 bg-white scroll-smooth">
            <p className="text-sm text-gray-600 font-medium mb-2">{getCurrentDate()}</p>

            {/* Greeting */}
            <div className="bg-purple-100 p-4 rounded-lg shadow-md text-center mb-4 mt-6">
              <div className="text-lg font-semibold text-purple-800 mb-2">
                How can we help you today?
              </div>
              <div className="flex flex-col items-center">
                <motion.p
                  className="text-gray-700 text-sm mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Hi there! I'm your virtual assistant. Let me know if you have any questions!
                </motion.p>
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start mb-4 ${msg.fromUser ? "justify-end" : "flex-col items-start"}`}
              >
                {!msg.fromUser && (
                  <img
                    src={chatbotIcon}
                    alt="Chat Icon"
                    className="w-6 h-6 rounded-full object-cover mr-3"
                  />
                )}

                <div
                  className={`shadow max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed transition ${
                    msg.fromUser
                      ? "bg-purple-600 text-white text-right self-end"
                      : "bg-gray-100 text-black text-left"
                  }`}
                >
                  {msg.image ? (
                    <img src={msg.image} alt="Uploaded" className="rounded-md" />
                  ) : (
                    <p dangerouslySetInnerHTML={{ __html: msg.text }} />
                  )}
                </div>

                {!msg.fromUser && (
                  <div className="mt-1 text-left text-xs text-gray-500">
                    {getTimeDifference(msg.timestamp)}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing animation */}
            {(loading || isTyping) && (
              <div className="flex gap-1 items-center mt-2 px-3">
                <span className="bg-gray-400 w-2 h-2 rounded-full animate-bounce delay-0"></span>
                <span className="bg-gray-400 w-2 h-2 rounded-full animate-bounce delay-150"></span>
                <span className="bg-gray-400 w-2 h-2 rounded-full animate-bounce delay-300"></span>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input area */}
          <div className="flex items-center p-3 bg-white border-t border-gray-200 rounded-b-lg">
            <input
              ref={inputRef}
              type="text"
              placeholder="Start a new message..."
              value={input}
              onChange={(e) => setInput(capitalize(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow p-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none mr-2"
            />
            <button
              onClick={handleSend}
              className="bg-purple-800 p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={loading || !input.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
