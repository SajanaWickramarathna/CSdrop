import React, { useEffect, useState } from "react";
import { api } from "../../../api";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Warning as WarningIcon,
  PriorityHigh as PriorityHighIcon,
  ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";

function TicketUserDash() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.data || {};
  const userId = userData.user_id;

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/tickets/tickets/${userId}`);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load tickets");
      showSnackbar("Failed to load tickets", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTickets();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const handleOpenDialog = (ticket) => {
    if (ticket.status.toLowerCase() !== "closed") {
      showSnackbar("Only closed tickets can be deleted", "warning");
      return;
    }
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;

    try {
      const response = await api.delete(
        `/tickets/ticket/${selectedTicket.ticket_id}`
      );
      if (response.status === 200) {
        setTickets(prevTickets =>
          prevTickets.filter(t => t.ticket_id !== selectedTicket.ticket_id)
        );
        showSnackbar("Ticket deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
      const message =
        err.response?.data?.message ||
        "Failed to delete the ticket. Please try again.";
      showSnackbar(message, "error");
    } finally {
      handleCloseDialog();
    }
  };

  const getStatusChip = (status) => {
    let icon;
    let color;
    
    switch(status.toLowerCase()) {
      case "open":
        color = "info";
        icon = <HelpIcon fontSize="small" />;
        break;
      case "in progress":
        color = "warning";
        icon = <HourglassEmptyIcon fontSize="small" />;
        break;
      case "closed":
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case "cancelled":
        color = "error";
        icon = <CancelIcon fontSize="small" />;
        break;
      default:
        color = "default";
    }

    return (
      <Chip
        label={status}
        color={color}
        icon={icon}
        size="small"
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  const getPriorityChip = (priority) => {
  let icon;
  let color;

  switch (priority.toLowerCase()) {
    case "high":
      color = "error";
      icon = <PriorityHighIcon fontSize="small" />;
      break;
    case "medium":
      color = "warning";
      icon = <WarningIcon fontSize="small" />;
      break;
    case "low":
      color = "info";
      icon = <ArrowDownwardIcon fontSize="small" />;
      break;
    default:
      color = "default";
  }

  return (
    <Chip
      label={priority}
      color={color}
      icon={icon}
      size="small"
      variant="outlined"
      sx={{ textTransform: "capitalize" }}
    />
  );
};


  if (!userId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          Please log in to view your tickets
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', overflowX: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        My Support Tickets
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchTickets}
          disabled={isLoading}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/customer-dashboard/addticket', { state: { data: userData } })}
        >
          Create New Ticket
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                {["Ticket ID", "Priority", "Category", "Status", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.length > 0 ? (
                [...tickets].reverse().map((ticket) => (
                  <TableRow 
                    key={ticket._id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>#{ticket.ticket_id}</TableCell>
                    <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                    <TableCell>{ticket.Categories}</TableCell>
                    <TableCell>
                      {getStatusChip(ticket.status)}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<ChatIcon />}
                          onClick={() => navigate(`/customer-dashboard/viewticket/${ticket.ticket_id}`, { state: { data: userData } })}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDialog(ticket)}
                          disabled={ticket.status.toLowerCase() !== "closed"}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <HelpIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" color="textSecondary">
                        No tickets found
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/customer-dashboard/addticket', { state: { data: userData } })}
                        sx={{ mt: 2 }}
                      >
                        Create Your First Ticket
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ticket #{selectedTicket?.ticket_id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteTicket} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TicketUserDash;