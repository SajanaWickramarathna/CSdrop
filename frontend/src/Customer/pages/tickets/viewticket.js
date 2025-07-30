import React, { useEffect, useState } from "react";
import { api } from "../../../api";
import { useParams, useNavigate } from "react-router-dom";
import TicketChat from "../../../pages/chat"; // Correct path to TicketChat

import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Grid,
  Avatar,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  Message as MessageIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

function ViewReplyTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/tickets/ticket/${id}`
        );
        setTicket(response.data.ticket);
      } catch (error) {
        console.error("Error fetching the ticket:", error);
        setError("Failed to load ticket details");
        showSnackbar("Failed to load ticket details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        showSnackbar("Failed to load user data", "error");
      }
    };

    if (token) { // Only fetch user data if a token exists
      fetchUserData();
    }
  }, [token]);


  const getStatusChip = (status) => {
    let icon;
    let color;

    switch (status.toLowerCase()) {
      case "open":
        color = "info";
        icon = <HelpIcon />;
        break;
      case "in progress":
        color = "warning";
        icon = <HourglassEmptyIcon />;
        break;
      case "closed":
        color = "success";
        icon = <CheckCircleIcon />;
        break;
      case "cancelled":
        color = "error";
        icon = <CancelIcon />;
        break;
      default:
        color = "default";
        icon = null; // Default case might not have a specific icon
    }

    return (
      <Chip
        label={status}
        color={color}
        icon={icon}
        sx={{ textTransform: "capitalize", fontWeight: "bold" }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    let color;

    switch (priority.toLowerCase()) {
      case "high":
        color = "error";
        break;
      case "medium":
        color = "warning";
        break;
      case "low":
        color = "success";
        break;
      default:
        color = "default";
    }

    return (
      <Chip
        label={priority}
        color={color}
        icon={<PriorityHighIcon />}
        sx={{ textTransform: "capitalize", fontWeight: "bold" }}
      />
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          Ticket not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Tickets
      </Button>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Ticket #{ticket.ticket_id}
      </Typography>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mr: 1,
                    display: "inline-flex",
                    verticalAlign: "middle",
                  }}
                >
                  {ticket.name.charAt(0).toUpperCase()}
                </Avatar>
                {ticket.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Email
              </Typography>
              <Typography variant="body1">{ticket.gmail}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Phone Number
              </Typography>
              <Typography variant="body1">{ticket.phoneNumber}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                <CategoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Category
              </Typography>
              <Typography variant="body1">{ticket.Categories}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                <PriorityHighIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Priority
              </Typography>
              {getPriorityChip(ticket.priority)}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Status
              </Typography>
              {getStatusChip(ticket.status)}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            <MessageIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Message
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: "background.default" }}
          >
            <Typography variant="body1" whiteSpace="pre-wrap">
              {ticket.message}
            </Typography>
          </Paper>
        </Box>
      </Paper>

      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Conversation
      </Typography>
      
        {userData && (
          <TicketChat ticketId={ticket.ticket_id} user_id={userData.user_id} role={"user"} />
        )}
      

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ViewReplyTicket;