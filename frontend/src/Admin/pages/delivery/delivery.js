import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Snackbar, Alert,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';

export default function DeliveryAdmin() {
    const [orders, setOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [orderDeliveriesMap, setOrderDeliveriesMap] = useState({}); // New state for mapping
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/all');
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setSnackbarMessage('Failed to fetch orders: ' + (err?.response?.data?.error || err.message));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const fetchDeliveries = async () => {
        try {
            const res = await api.get('/deliveries/all');
            setDeliveries(res.data);
            // Create a map for quick lookup
            const map = {};
            res.data.forEach(delivery => {
                map[delivery.order_id] = delivery;
            });
            setOrderDeliveriesMap(map);
        } catch (err) {
            console.error("Failed to fetch deliveries:", err);
            setSnackbarMessage('Failed to fetch deliveries: ' + (err?.response?.data?.error || err.message));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchDeliveries();
    }, []);

    const handleCreateClick = (order) => {
        navigate('/admin-dashboard/createdelivery', { state: order });
    };

    const handleViewDelivery = (deliveryId) => {
        navigate(`/admin-dashboard/delivery/${deliveryId}`);
    };

    const handleStatusChange = async (deliveryId, newStatus) => {
        try {
            await api.put(`/deliveries/${deliveryId}/status`, { status: newStatus });
            setSnackbarMessage('Delivery status updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchDeliveries(); // Re-fetch deliveries to update the table
        } catch (err) {
            console.error("Failed to update delivery status:", err);
            setSnackbarMessage('Failed to update delivery status: ' + (err?.response?.data?.error || err.message));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const deliveryStatusOptions = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

    return (
        <Box p={3}>
            <Typography variant="h4" mb={3}>Orders - Manage Deliveries</Typography>
            <Paper sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Delivery Status</TableCell> {/* New column */}
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => {
                            const existingDelivery = orderDeliveriesMap[order.order_id];
                            return (
                                <TableRow key={order.order_id}>
                                    <TableCell>{order.order_id}</TableCell>
                                    <TableCell>{order.user_id}</TableCell>
                                    <TableCell>{order.user_name || 'N/A'}</TableCell>
                                    <TableCell>
                                        {existingDelivery ? (
                                            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={existingDelivery.delivery_status}
                                                    onChange={(e) => handleStatusChange(existingDelivery.delivery_id, e.target.value)}
                                                    label="Status"
                                                >
                                                    {deliveryStatusOptions.map(status => (
                                                        <MenuItem key={status} value={status}>
                                                            {status.replace(/_/g, ' ')}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            'No Delivery Yet'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {existingDelivery ? (
                                            ''
                                        ) : (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleCreateClick(order)}
                                            >
                                                Create Delivery
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>

            <Typography variant="h4" mb={3}>Existing Deliveries</Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Delivery ID</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Estimated Delivery</TableCell>
                            <TableCell>Actual Delivery</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.length > 0 ? (
                            deliveries.map((delivery) => (
                                <TableRow key={delivery.delivery_id}>
                                    <TableCell>{delivery.delivery_id}</TableCell>
                                    <TableCell>{delivery.order_id}</TableCell>
                                    <TableCell>{delivery.user_id}</TableCell>
                                    <TableCell>{delivery.address}</TableCell>
                                    <TableCell>{delivery.delivery_status}</TableCell>
                                    <TableCell>{delivery.estimated_delivery ? new Date(delivery.estimated_delivery).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{delivery.actual_delivery ? new Date(delivery.actual_delivery).toLocaleDateString() : 'Not delivered yet'}</TableCell>
                                    <TableCell>{new Date(delivery.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No deliveries found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}