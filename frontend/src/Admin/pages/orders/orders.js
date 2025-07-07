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
} from "@mui/material";
import { Edit, Delete, Visibility, PictureAsPdf } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/orders/all");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    const { orderId } = selectedOrder;

    try {
      await axios.put(`http://localhost:3001/api/orders/cancel/${orderId}`);
      fetchOrders();
      setErrorMessage(""); // Clear error message after successful cancellation
    } catch (error) {
      console.error("Error cancelling order:", error);
      setErrorMessage("Failed to cancel the order. Please try again.");
    } finally {
      setOpenDialog(false);
    }
  };

  // Open confirmation dialog
  const handleOpenDialog = (orderId, status) => {
    // Validation for already canceled, shipped, or delivered orders
    if (status === "cancelled") {
      setErrorMessage("This order is already canceled.");
      return; // Do not open the dialog
    }

    if (status === "shipped") {
      setErrorMessage("You cannot cancel an order that has been shipped.");
      return; // Do not open the dialog
    }

    if (status === "delivered") {
      setErrorMessage("You cannot cancel an order that has been delivered.");
      return; // Do not open the dialog
    }

    setSelectedOrder({ orderId, status });
    setOpenDialog(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Generate PDF report
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("All Orders Report", 14, 15);

    const columns = [
      "Order ID",
      "User ID",
      "Total Price",
      "Status",
      "Payment Method",
    ];
    const rows = orders.map((order) => [
      order.order_id,
      order.user_id,
      order.total_price,
      order.status,
      order.payment_method || "N/A",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
    });

    doc.save("order_report.pdf");
  };

  // Get status color
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

      {/* Orders Table */}
      <TableContainer component={Paper} className="!rounded-2xl shadow-md">
        <Table>
          <TableHead className="bg-gray-200">
            <TableRow>
              {[
                "Order ID",
                "User ID",
                "Total Price",
                "Status",
                "Payment Method",
                "Payment Slip",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  className="!font-bold !text-[14px] !uppercase !text-gray-800 !text-center"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.order_id} className="bg-white">
                  <TableCell className="!text-center">{order.order_id}</TableCell>
                  <TableCell className="!text-center">{order.user_id}</TableCell>
                  <TableCell className="!text-center">
                    LKR {order.total_price}
                  </TableCell>
                  <TableCell className={`!text-center ${getStatusColor(order.status)}`}>
                    {order.status}
                  </TableCell>
                  <TableCell className="!text-center">{order.payment_method}</TableCell>
                  <TableCell className="!text-center">
                    {order.payment_method === "Payment Slip" && order.payment_slip ? (
                      <Tooltip title="View Payment Slip">
                        <a
                          href={`http://localhost:3001/uploads/${order.payment_slip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Slip
                        </a>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="!text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Tooltip title="View Order">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin-dashboard/vieworder/${order.order_id}`)
                          }
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit Order">
                        <IconButton
                          color="success"
                          onClick={() =>
                            navigate("/admin-dashboard/updateorder", {
                              state: { orderData: order },
                            })
                          }
                        >
                          <Edit />
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
                <TableCell colSpan={7} className="!text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Generate Report Button */}
      <div className="flex justify-center mt-6">
        <Button
          variant="contained"
          startIcon={<PictureAsPdf />}
          className="!bg-[#3f51b5] !text-white hover:!bg-[#303f9f] !rounded-lg"
          onClick={handleGeneratePDF}
        >
          Generate Report
        </Button>
      </div>

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
