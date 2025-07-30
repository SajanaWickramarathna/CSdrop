// TrackDelivery.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { api } from "../../api";

const steps = [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
];

export default function TrackDelivery() {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  // Track which orders have their delivery info expanded
  const [expandedOrders, setExpandedOrders] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Please log in again.");
      }
    };

    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    if (userData) {
      api
        .get(`/orders/user/${userData.user_id}`)
        .then(async (res) => {
          const ordersWithDelivery = await Promise.all(
            res.data.map(async (order) => {
              try {
                const deliveryRes = await api.get(
                  `/deliveries/by-order/${order.order_id}`
                );
                return {
                  ...order,
                  delivery: deliveryRes.data,
                  loading: false,
                  error: null,
                };
              } catch (err) {
                return {
                  ...order,
                  delivery: null, // No delivery created yet
                  loading: false,
                  error: null,
                };
              }
            })
          );
          setOrders(ordersWithDelivery);
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [userData]);

  const handleTrack = async (orderId) => {
    try {
      setError("");
      // Update the order's loading state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, loading: true, error: null }
            : order
        )
      );

      const res = await api.get(`/deliveries/by-order/${orderId}`);
      const fetchedDelivery = res.data;

      if (!userData || fetchedDelivery.user_id !== userData.user_id) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  loading: false,
                  error: "You are not authorized to track this delivery.",
                }
              : order
          )
        );
        return;
      }

      // Update the order with its delivery info and toggle expansion
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                delivery: fetchedDelivery,
                loading: false,
                error: null,
              }
            : order
        )
      );

      // Toggle the expanded state
      setExpandedOrders((prev) => ({
        ...prev,
        [orderId]: !prev[orderId],
      }));
    } catch (err) {
      console.error("Error tracking delivery:", err);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                loading: false,
                error: "Delivery not found for this Order ID.",
              }
            : order
        )
      );
    }
  };

  const getStepIndex = (status) => steps.indexOf(status);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Track Your Deliveries
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Your Orders</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date Order Placed</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.order_id}>
                  <TableRow>
                    <TableCell>#{order.order_id}</TableCell>
                    <TableCell>LKR {order.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {order.delivery === null ? (
                        <Typography color="textSecondary">
                          Delivery Not Assigned
                        </Typography>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => handleTrack(order.order_id)}
                          disabled={order.loading}
                        >
                          {order.loading
                            ? "Loading..."
                            : expandedOrders[order.order_id]
                            ? "Hide Details"
                            : "Track Delivery"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={4}
                    >
                      <Collapse
                        in={expandedOrders[order.order_id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          {order.error && (
                            <Typography color="error">{order.error}</Typography>
                          )}
                          {order.delivery && (
                            <>
                              <Typography variant="h6">
                                Delivery Info
                              </Typography>
                              <Typography>
                                Delivery ID: {order.delivery.delivery_id}
                              </Typography>
                              <Typography>
                                Order ID: {order.delivery.order_id}
                              </Typography>
                              <Typography>
                                Status: {order.delivery.delivery_status}
                              </Typography>
                              <Typography>
                                Estimated:{" "}
                                {order.delivery.estimated_delivery?.substring(
                                  0,
                                  10
                                ) || "N/A"}
                              </Typography>
                              <Typography>
                                Actual:{" "}
                                {order.delivery.actual_delivery?.substring(
                                  0,
                                  10
                                ) || "Not delivered yet"}
                              </Typography>

                              <Box mt={3}>
                                <Stepper
                                  activeStep={getStepIndex(
                                    order.delivery.delivery_status
                                  )}
                                  alternativeLabel
                                >
                                  {steps.map((label) => (
                                    <Step key={label}>
                                      <StepLabel>{label}</StepLabel>
                                    </Step>
                                  ))}
                                </Stepper>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
