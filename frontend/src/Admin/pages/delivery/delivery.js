import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';

export default function DeliveryAdmin() {
    const [orders, setOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [orderDeliveriesMap, setOrderDeliveriesMap] = useState({});
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
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
                            <TableCell>Delivery Status</TableCell>
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
                                            existingDelivery.delivery_status.replace(/_/g, ' ')
                                        ) : (
                                            'No Delivery Yet'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {existingDelivery ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewDelivery(existingDelivery.delivery_id)}
                                            >
                                                View Delivery
                                            </Button>
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

            

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
