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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Avatar,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Chip,
  Skeleton,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  alpha
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  PictureAsPdf,
  Search as SearchIcon,
  FilterList,
  Cancel,
  CheckCircle,
  LocalShipping,
  Payment,
  HourglassEmpty
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Custom theme for better UI
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px'
        },
        head: {
          fontWeight: 600
        }
      }
    }
  }
});

export default function AllOrders() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();

  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3001/api/orders/all");
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
      setSnackbarMessage("Failed to load orders.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search Filter effect
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.order_id.toString().includes(lowerSearch) ||
        order.user_name?.toLowerCase().includes(lowerSearch) ||
        order.status.toLowerCase().includes(lowerSearch) ||
        order.payment_method?.toLowerCase().includes(lowerSearch)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    const { orderId } = selectedOrder;
    setOpenDialog(false);

    try {
      await axios.put(`http://localhost:3001/api/orders/cancel/${orderId}`);
      fetchOrders();
      setSnackbarMessage(`Order ${orderId} cancelled successfully.`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error cancelling order:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to cancel the order. Please try again.";
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSelectedOrder(null);
    }
  };

  // Open confirmation dialog for cancellation
  const handleOpenDialog = (orderId, status) => {
    const uncancelableStatuses = ["cancelled", "shipped", "delivered"];
    if (uncancelableStatuses.includes(status.toLowerCase())) {
      setSnackbarMessage(
        `You cannot cancel an order that is ${status.toLowerCase()}.`
      );
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    setError("");
    setSelectedOrder({ orderId, status });
    setOpenDialog(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setError("");
  };

  // Close snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Generate PDF report
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("All Orders Report", 14, 15);
    const columns = [
      "Order ID",
      "User Name",
      "Total Price",
      "Status",
      "Payment Method",
    ];
    const rows = filteredOrders.map((order) => [
      order.order_id,
      order.user_name || "N/A",
      `LKR ${order.total_price.toFixed(2)}`,
      order.status,
      order.payment_method || "N/A",
    ]);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
      theme: "striped",
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
      },
    });
    doc.save("order_report.pdf");
    setSnackbarMessage("Order report generated successfully!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  // Enhanced status display with icons
  const renderStatus = (status) => {
    const lowerStatus = status.toLowerCase();
    let icon;
    let color;
    
    switch(lowerStatus) {
      case 'completed':
      case 'delivered':
        icon = <CheckCircle fontSize="small" />;
        color = 'success';
        break;
      case 'cancelled':
        icon = <Cancel fontSize="small" />;
        color = 'error';
        break;
      case 'shipped':
        icon = <LocalShipping fontSize="small" />;
        color = 'info';
        break;
      case 'pending':
        icon = <HourglassEmpty fontSize="small" />;
        color = 'warning';
        break;
      case 'processing':
        icon = <HourglassEmpty fontSize="small" />;
        color = 'secondary';
        break;
      default:
        icon = <Payment fontSize="small" />;
        color = 'primary';
    }
    
    return (
      <Chip
        icon={icon}
        label={status}
        color={color}
        variant="outlined"
        size="small"
        sx={{
          borderRadius: '4px',
          fontWeight: 500,
          '.MuiChip-icon': {
            marginLeft: '4px'
          }
        }}
      />
    );
  };

  // Skeleton loading for better perceived performance
  const renderSkeletonRows = () => {
    return Array(5).fill().map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Box ml={2}>
              <Skeleton width={80} height={20} />
              <Skeleton width={120} height={16} />
            </Box>
          </Box>
        </TableCell>
        <TableCell><Skeleton width={60} height={20} /></TableCell>
        <TableCell><Skeleton width={80} height={20} /></TableCell>
        <TableCell><Skeleton width={100} height={32} /></TableCell>
        <TableCell><Skeleton width={100} height={20} /></TableCell>
        <TableCell><Skeleton width={80} height={20} /></TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="p-4 bg-gray-50 min-h-screen">
        {/* Header, Search, and Report Button */}
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Order Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </Typography>
          </Box>
          
          <Box 
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            sx={{
              transition: 'all 0.3s ease',
              transform: isSearchFocused && isMobile ? 'translateY(-10px)' : 'none'
            }}
          >
            {/* Enhanced Search Bar */}
            <TextField
              variant="outlined"
              placeholder="Search by ID, Customer, Status, or Payment..." // Updated placeholder
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color={isSearchFocused ? "primary" : "action"} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  backgroundColor: 'background.paper',
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)'
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                  }
                }
              }}
              size="small"
              className="flex-grow max-w-sm"
            />

            {/* Enhanced Generate Report Button */}
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={handleGeneratePDF}
              sx={{
                backgroundColor: 'grey.800',
                '&:hover': {
                  backgroundColor: 'grey.900',
                  transform: 'translateY(-1px)'
                },
                minWidth: isMobile ? '100%' : 'auto'
              }}
            >
              {isMobile ? 'PDF Report' : 'Generate Report'}
            </Button>
          </Box>
        </Box>

        {/* Loading Indicator */}
        {loading ? (
          <Box className="flex flex-col items-center justify-center h-64 rounded-xl bg-white shadow-sm border border-gray-100">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" mt={3} color="text.secondary">
              Loading your orders...
            </Typography>
            <Typography variant="body2" mt={1} color="text.secondary">
              This may take a moment
            </Typography>
          </Box>
        ) : (
          <>
            {/* Orders Table */}
            <TableContainer
              component={Paper}
              className="!rounded-xl shadow-sm border border-gray-100"
              sx={{
                '&::-webkit-scrollbar': {
                  height: '8px',
                  width: '8px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[400],
                  borderRadius: '4px'
                }
              }}
            >
              <Table stickyHeader aria-label="all orders table">
                <TableHead>
                  <TableRow>
                    {[
                      "Order & Customer",
                      "User ID",
                      "Total",
                      "Status",
                      "Payment",
                      "Slip",
                      "Actions",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          color: "text.secondary",
                          backgroundColor: "background.default",
                          py: 1.5,
                          px: 2,
                          textAlign:
                            header === "Total" ||
                            header === "Payment" ||
                            header === "Slip" ||
                            header === "Actions"
                              ? "center"
                              : "left",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow
                        key={order.order_id}
                        hover
                        sx={{
                          '&:last-child td': { borderBottom: 0 },
                          '&:hover': { 
                            backgroundColor: 'action.hover',
                            '& td': {
                              transition: 'background-color 0.2s ease'
                            }
                          }
                        }}
                      >
                        {/* Order ID & User Name */}
                        <TableCell sx={{ py: 1.5, px: 2 }}>
                          <Box className="flex items-center">
                            <Avatar
                              sx={{
                                bgcolor: (theme) => theme.palette.primary.main,
                                width: 40,
                                height: 40,
                                fontSize: 16,
                                marginRight: 2,
                                color: 'white'
                              }}
                            >
                              {order.user_name ? 
                                order.user_name.charAt(0).toUpperCase() : 
                                `#${order.order_id.toString().charAt(0)}`}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                #{order.order_id}
                              </Typography>
                              {order.user_name && (
                                <Typography variant="body2" color="text.secondary">
                                  {order.user_name}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        {/* User ID */}
                        <TableCell sx={{ py: 1.5, px: 2 }}>
                          <Typography variant="body2">
                            {order.user_id || "N/A"}
                          </Typography>
                        </TableCell>

                        {/* Total Price */}
                        <TableCell sx={{ py: 1.5, px: 2, textAlign: "center" }}>
                          <Typography variant="body1" fontWeight="medium">
                            LKR {order.total_price.toFixed(2)}
                          </Typography>
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={{ py: 1.5, px: 2, textAlign: "center" }}>
                          {renderStatus(order.status)}
                        </TableCell>

                        {/* Payment Method */}
                        <TableCell sx={{ py: 1.5, px: 2, textAlign: "center" }}>
                          <Chip
                            label={order.payment_method || "N/A"}
                            size="small"
                            variant="outlined"
                            color="default"
                          />
                        </TableCell>

                        {/* Payment Slip */}
                        <TableCell sx={{ py: 1.5, px: 2, textAlign: "center" }}>
                          {order.payment_method === "Payment Slip" &&
                          order.payment_slip ? (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => window.open(`http://localhost:3001/uploads/${order.payment_slip}`, '_blank')}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 500
                              }}
                            >
                              View
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              -
                            </Typography>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell sx={{ py: 1.5, px: 2 }}>
                          <Box className="flex items-center gap-1 justify-center">
                            <Tooltip title="View details">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  navigate(`/admin-dashboard/vieworder/${order.order_id}`)
                                }
                                size="small"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit order">
                              <IconButton
                                color="secondary"
                                onClick={() =>
                                  navigate("/admin-dashboard/updateorder", {
                                    state: { orderData: order },
                                  })
                                }
                                size="small"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.secondary.main, 0.1)
                                  }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel order">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleOpenDialog(order.order_id, order.status)
                                }
                                size="small"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.1)
                                  }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : loading ? (
                    renderSkeletonRows()
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                        <Box className="flex flex-col items-center justify-center py-8">
                          <SearchIcon sx={{ 
                            fontSize: 48, 
                            color: "grey.400", 
                            mb: 2,
                            opacity: 0.8
                          }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No orders found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                            {searchTerm ? 
                              `No orders match "${searchTerm}". Try a different search term.` : 
                              'There are currently no orders to display.'}
                          </Typography>
                          {searchTerm && (
                            <Button 
                              variant="text" 
                              onClick={() => setSearchTerm('')}
                              sx={{ mt: 2 }}
                            >
                              Clear search
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination would go here */}
            {filteredOrders.length > 0 && (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredOrders.length} of {orders.length} orders
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Enhanced Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="cancel-order-dialog-title"
          PaperProps={{
            sx: {
              borderRadius: '12px',
              maxWidth: '500px'
            }
          }}
        >
          <DialogTitle id="cancel-order-dialog-title" sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center">
              <Cancel color="error" sx={{ mr: 1.5 }} />
              <Typography variant="h6" component="span">
                Confirm Order Cancellation
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            <DialogContentText id="cancel-order-dialog-description">
              Are you sure you want to cancel order{' '}
              <Typography component="span" fontWeight="bold" color="text.primary">
                #{selectedOrder?.orderId}
              </Typography>?
            </DialogContentText>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="outlined"
              sx={{
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'grey.400'
                }
              }}
            >
              Keep Order
            </Button>
            <Button 
              onClick={handleCancelOrder} 
              color="error" 
              variant="contained" 
              autoFocus
              startIcon={<Delete />}
              sx={{
                backgroundColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.dark'
                }
              }}
            >
              Confirm Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            '& .MuiSnackbar-root': {
              borderRadius: '12px'
            }
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              alignItems: 'center'
            }}
            elevation={6}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}