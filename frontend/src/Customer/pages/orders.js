import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Typography,
  Box
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ShoppingBag as ShoppingBagIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        showSnackbar("Session expired. Please log in again.", "error");
        setTimeout(() => {
          localStorage.removeItem("token");
          setToken(null);
          window.location.href = "/logout";
        }, 2000);
      } else {
        showSnackbar("Failed to load user data", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserOrders = async () => {
    if (userData) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/orders/user/${userData.user_id}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        showSnackbar("Failed to load orders", "error");
      }
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userData]);

  const handleOpenDialog = (orderId, status) => {
    if (status === "cancelled") {
      showSnackbar("This order is already canceled.", "info");
      return;
    }

    if (status === "inDelivery") {
      showSnackbar("You cannot cancel an order that is in delivery.", "warning");
      return;
    }

    if (status === "delivered") {
      showSnackbar("You cannot cancel an order that has been delivered.", "warning");
      return;
    }

    setSelectedOrder(orderId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      await axios.put(`http://localhost:3001/api/orders/cancel/${selectedOrder}`);
      fetchUserOrders();
      showSnackbar("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      showSnackbar("Failed to cancel the order", "error");
    } finally {
      setOpenDialog(false);
    }
  };

  const getStatusChip = (status) => {
    let color;
    let icon;

    switch (status) {
      case "delivered":
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case "cancelled":
        color = "error";
        icon = <CancelIcon fontSize="small" />;
        break;
      case "inDelivery":
        color = "info";
        break;
      default:
        color = "warning";
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!token) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        p={4}
        textAlign="center"
      >
        <ShoppingBagIcon color="disabled" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Please log in to view your orders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/signin")}
          startIcon={<CheckCircleIcon />}
          sx={{ mt: 2 }}
        >
          Log in
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', overflowX: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        My Orders
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                {["Order ID", "Total", "Status", "Payment", "Date", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const displayStatus = order.status === "shipped" ? "inDelivery" : order.status;
                  return (
                    <TableRow
                      key={order.order_id}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" fontWeight="medium">
                          #{order.order_id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">
                          LKR {order.total_price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {getStatusChip(displayStatus)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" textTransform="capitalize">
                          {order.payment_method}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">
                          {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() =>
                                navigate(`/customer-dashboard/vieworder/${order.order_id}`)
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel Order">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDialog(order.order_id, displayStatus)}
                              disabled={['cancelled', 'inDelivery', 'delivered'].includes(displayStatus)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <ShoppingBagIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" color="textSecondary">
                        No orders found
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/shop')}
                        sx={{ mt: 2 }}
                        startIcon={<ShoppingBagIcon />}
                      >
                        Start Shopping
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order #{selectedOrder}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No, Keep It
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
            startIcon={<CancelIcon />}
          >
            Yes, Cancel
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
