import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Stepper, Step, StepLabel
} from '@mui/material';
import {api} from '../../api';

const steps = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

export default function TrackDelivery() {
  const [orderId, setOrderId] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      setError('');
      // Changed API endpoint to match the new backend route for tracking by order ID
      const res = await api.get(`/deliveries/by-order/${orderId}`);
      setDelivery(res.data);
    } catch (err) {
      console.error("Error tracking delivery:", err); // Log the full error for debugging
      setError('Delivery not found for this Order ID.');
      setDelivery(null);
    }
  };

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

      {error && <Typography color="error">{error}</Typography>}

      {delivery && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Delivery Info</Typography>
          <Typography>Delivery ID: {delivery.delivery_id}</Typography>
          <Typography>Order ID: {delivery.order_id}</Typography> {/* Added Order ID for clarity */}
          <Typography>Status: {delivery.delivery_status}</Typography>
          <Typography>Estimated: {delivery.estimated_delivery?.substring(0, 10) || 'N/A'}</Typography>
          <Typography>Actual: {delivery.actual_delivery?.substring(0, 10) || 'Not delivered yet'}</Typography>

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
