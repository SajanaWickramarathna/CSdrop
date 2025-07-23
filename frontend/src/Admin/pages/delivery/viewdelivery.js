import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Grid, Paper
} from '@mui/material';
import { api } from '../../../api';

export default function CreateDelivery() {
  const { state: order } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    delivery_id: '',
    order_id: order?.order_id || '',
    user_id: order?.user_id || '',
    address: '', // optionally prefill from order if available
    estimated_delivery: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/deliveries', form);
      alert('Delivery created!');
      navigate('/admin-dashboard/delivery'); // back to delivery admin
    } catch (err) {
      alert('Failed to create delivery');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Create Delivery</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {['delivery_id', 'order_id', 'user_id', 'address', 'estimated_delivery'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                fullWidth
                label={field.replace('_', ' ')}
                name={field}
                type={field.includes('delivery') ? 'date' : 'text'}
                value={form[field]}
                onChange={handleChange}
                InputLabelProps={field.includes('delivery') ? { shrink: true } : {}}
              />
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
          Submit Delivery
        </Button>
      </Paper>
    </Box>
  );
}
