// pages/admin/CreateDelivery.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Grid, Paper
} from '@mui/material';
import { api } from '../../../api'; // ✅ adjust path if needed

export default function CreateDelivery() {
  const { state: order } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    order_id: order?.order_id || '',
    user_id: order?.user_id || '',
    address: order?.shipping_address || '',
    estimated_delivery: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/deliveries', form);
      alert('✅ Delivery created successfully');
      navigate('/admin-dashboard/delivery');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create delivery: ' + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Create Delivery</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order ID"
              name="order_id"
              value={form.order_id}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User ID"
              name="user_id"
              value={form.user_id}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Delivery Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Delivery Date"
              name="estimated_delivery"
              type="date"
              value={form.estimated_delivery}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Delivery
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
