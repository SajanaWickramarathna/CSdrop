import React, { useEffect, useState, useRef } from "react";
import {
  Box, Typography, TextField, Button, Paper, Divider, Avatar, Stack,
  IconButton, Tooltip, Badge, useTheme
} from "@mui/material";
import { io } from "socket.io-client";

import axios from "axios";
import SendIcon from '@mui/icons-material/Send';

import {api} from "../api"; 
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

// Get base URL without `/api`
const baseURL = api.defaults.baseURL.replace("/api", "");

// Initialize socket
const socket = io(baseURL);

export default function TicketChat({ ticketId, user_id, role }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (!ticketId) return;

    socket.emit("join_ticket", { ticketId: String(ticketId) });

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/${ticketId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    fetchMessages();

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ isTyping }) => {
      setIsTyping(isTyping);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const payload = {
      ticketId: String(ticketId),
      sender_id: user_id,
      sender_role: role,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    socket.emit("send_message", payload);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", {
      ticketId: String(ticketId),
      isTyping: e.target.value.length > 0
    });
  };

  const getInitials = (name) => name?.[0]?.toUpperCase() || "U";

  const getMessageAlignment = (msg) => {
    return msg.sender_role === "user" ? "flex-end" : "flex-start";
  };

  const getMessageColor = (msg) => {
    return msg.sender_role === "user"
      ? theme.palette.primary.main
      : theme.palette.grey[300];
  };

  const getTextColor = (msg) => {
    return msg.sender_role === "user"
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary;
  };

  return (
    <Paper elevation={3} sx={{
      p: 2,
      width: "100%",
      maxWidth: "800px",
      mx: "auto",
      mt: 2,
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 200px)',
      maxHeight: '700px'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1,
        p: 1,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '8px 8px 0 0'
      }}>
        <Typography variant="h6">
          Ticket #{ticketId} - Chat
        </Typography>
        <Badge
          color="blue"
          badgeContent={messages.length}
          max={999}
          sx={{ mr: 1 }}
        />
      </Box>

      <Divider />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          background: theme.palette.background.default,
          borderRadius: '8px',
          mb: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[200],
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
          },
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: theme.palette.text.secondary
          }}>
            <Typography variant="body1">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: getMessageAlignment(msg),
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '80%'
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="flex-end"
                  justifyContent={getMessageAlignment(msg)}
                >
                  {getMessageAlignment(msg) === "flex-start" && (
                    <Tooltip title={msg.sender_role} arrow>
                      <Avatar sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {getInitials(msg.sender_role)}
                      </Avatar>
                    </Tooltip>
                  )}

                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: getMessageColor(msg),
                      color: getTextColor(msg),
                      borderRadius: getMessageAlignment(msg) === "flex-start"
                        ? '18px 18px 18px 4px'
                        : '18px 18px 4px 18px',
                      boxShadow: theme.shadows[1],
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {msg.message}
                    </Typography>
                  </Box>

                  {getMessageAlignment(msg) === "flex-end" && (
                    <Tooltip title={msg.sender_role} arrow>
                      <Avatar sx={{
                        bgcolor: theme.palette.info.main,
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {getInitials(msg.sender_role)}
                      </Avatar>
                    </Tooltip>
                  )}
                </Stack>

                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    textAlign: getMessageAlignment(msg),
                    color: theme.palette.text.secondary
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: theme.palette.grey[300],
                borderRadius: '18px 18px 18px 4px',
                display: 'flex'
              }}
            >
              <Box sx={{
                width: '8px',
                height: '8px',
                bgcolor: theme.palette.grey[500],
                borderRadius: '50%',
                mr: 0.5,
                animation: 'pulse 1.5s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.3 },
                  '50%': { opacity: 1 }
                }
              }} />
              <Box sx={{
                width: '8px',
                height: '8px',
                bgcolor: theme.palette.grey[500],
                borderRadius: '50%',
                mr: 0.5,
                animation: 'pulse 1.5s infinite ease-in-out',
                animationDelay: '0.2s'
              }} />
              <Box sx={{
                width: '8px',
                height: '8px',
                bgcolor: theme.palette.grey[500],
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite ease-in-out',
                animationDelay: '0.4s'
              }} />
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '0 0 8px 8px'
      }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: theme.palette.background.default,
            }
          }}
        />
        <Tooltip title="Send">
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              },
              '&:disabled': {
                backgroundColor: theme.palette.grey[300]
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
