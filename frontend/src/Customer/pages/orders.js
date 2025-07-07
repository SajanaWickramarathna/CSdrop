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
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = "/logout";
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
      }
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userData]);

  const handleOpenDialog = (orderId, status) => {
    // Validation for already canceled, shipped, or delivered orders
    if (status === "cancelled") {
      setErrorMessage("This order is already canceled.");
      return; // Do not proceed
    }

    if (status === "shipped") {
      setErrorMessage("You cannot cancel an order that has been shipped.");
      return; // Do not proceed
    }

    if (status === "delivered") {
      setErrorMessage("You cannot cancel an order that has been delivered.");
      return; // Do not proceed
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
      setErrorMessage(""); // Clear error message after successful cancellation
    } catch (error) {
      console.error("Error cancelling order:", error);
      setErrorMessage("Failed to cancel the order. Please try again.");
    } finally {
      setOpenDialog(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "text-green-600";
    if (status === "Cancelled") return "text-red-500";
    return "text-gray-700";
  };

  return (
    <div className="p-4">
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 text-center text-red-500 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}

      <TableContainer component={Paper} className="!rounded-2xl shadow-md">
        <Table>
          <TableHead className="bg-gray-200">
            <TableRow>
              {["Order ID", "Total Price", "Status", "Payment Method", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    className="!font-bold !text-[14px] !uppercase !text-gray-800 !text-center"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.order_id} className="bg-white">
                  <TableCell className="!text-center">{order.order_id}</TableCell>
                  <TableCell className="!text-center">
                    LKR {order.total_price}
                  </TableCell>
                  <TableCell className={`!text-center ${getStatusColor(order.status)}`}>
                    {order.status}
                  </TableCell>
                  <TableCell className="!text-center">
                    {order.payment_method}
                  </TableCell>
                  <TableCell className="!text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Tooltip title="View Order">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/customer-dashboard/vieworder/${order.order_id}`)
                          }
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel Order">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(order.order_id, order.status)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="!text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleCancelOrder} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}