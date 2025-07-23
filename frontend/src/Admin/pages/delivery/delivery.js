import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';

export default function DeliveryAdmin() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/all'); // Assumes your backend provides this
      setOrders(res.data);
    } catch (err) {
      alert('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateClick = (order) => {
    navigate('/admin-dashboard/createdelivery', { state: order });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Orders - Create Deliveries</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.user_id}</TableCell>
                <TableCell>{order.user_name || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleCreateClick(order)}
                  >
                    Create Delivery
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
