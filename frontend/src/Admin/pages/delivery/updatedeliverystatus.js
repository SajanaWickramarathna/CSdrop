// components/DeliveryStatusUpdater.js (or adjust path as needed)

import React, { useState } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import { api } from '../../../api'; // Adjust this path based on where you place this file

export default function DeliveryStatusUpdater({ deliveryId, currentStatus, onStatusUpdateSuccess }) {
    const [status, setStatus] = useState(currentStatus);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const deliveryStatusOptions = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus); // Optimistically update UI

        try {
            await api.put(`/deliveries/${deliveryId}/status`, { status: newStatus });
            setSnackbarMessage('Delivery status updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            if (onStatusUpdateSuccess) {
                onStatusUpdateSuccess(); // Notify parent to re-fetch data
            }
        } catch (err) {
            console.error("Failed to update delivery status:", err);
            setStatus(currentStatus); // Revert status on error
            setSnackbarMessage('Failed to update delivery status: ' + (err?.response?.data?.error || err.message));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    onChange={handleStatusChange}
                    label="Status"
                >
                    {deliveryStatusOptions.map(option => (
                        <MenuItem key={option} value={option}>
                            {option.replace(/_/g, ' ')}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}