// pages/user/TrackDelivery.js

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Stepper, Step, StepLabel
} from '@mui/material';
import axios from 'axios';

const steps = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

export default function TrackDelivery() {
  const [orderId, setOrderId] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      setError('');
      const res = await axios.get(`/api/delivery/${orderId}`);
      setDelivery(res.data);
    } catch (err) {
      setError('Delivery not found');
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
