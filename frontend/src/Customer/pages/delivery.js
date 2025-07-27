// src/pages/customer/TrackDelivery.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Stepper, Step, StepLabel
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api';

const steps = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

export default function TrackDelivery() {
  const { orderId: orderIdFromParams } = useParams();
  const [orderId, setOrderId] = useState(orderIdFromParams || '');
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState('');
  const [token] = useState(localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Please log in again.');
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleTrack = async () => {
    try {
      setError('');
      const res = await api.get(`/deliveries/by-order/${orderId}`);
      const fetchedDelivery = res.data;

      if (!userData || fetchedDelivery.user_id !== userData.user_id) {
        setDelivery(null);
        setError('You are not authorized to track this delivery.');
        return;
      }

      setDelivery(fetchedDelivery);
    } catch (err) {
      console.error('Error tracking delivery:', err);
      setError('Delivery not found for this Order ID.');
      setDelivery(null);
    }
  };

  useEffect(() => {
    if (orderIdFromParams && userData) {
      handleTrack();
    }
  }, [orderIdFromParams, userData]);

  const getStepIndex = (status) => steps.indexOf(status);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Track Your Delivery</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleTrack}>Track</Button>
      </Paper>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      {delivery && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Delivery Info</Typography>
          <Typography>Delivery ID: {delivery.delivery_id}</Typography>
          <Typography>Order ID: {delivery.order_id}</Typography>
          <Typography>Status: {delivery.delivery_status}</Typography>
          <Typography>
            Estimated: {delivery.estimated_delivery?.substring(0, 10) || 'N/A'}
          </Typography>
          <Typography>
            Actual: {delivery.actual_delivery?.substring(0, 10) || 'Not delivered yet'}
          </Typography>

          <Box mt={3}>
            <Stepper activeStep={getStepIndex(delivery.delivery_status)} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
