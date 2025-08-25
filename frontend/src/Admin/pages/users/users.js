import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  DialogContentText,
  CircularProgress,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import { api } from "../../../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Topbuttons from './topbuttons';
import UpdateUser from './updateuser';
import AddUser from './adduser';
import Customers from './customers';
import Supporters from './supporters';
import Admins from './admins';

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Set initial tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('customers')) setTabValue(0);
    else if (path.includes('supporters')) setTabValue(1);
    else if (path.includes('admins')) setTabValue(2);
  }, [location]);

  // Fetch selected user for update
  useEffect(() => {
    if (selectedUser?.id) {
      getUserById();
    }
  }, [selectedUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch(newValue) {
      case 0: navigate('/admin-dashboard/users/customers'); break;
      case 1: navigate('/admin-dashboard/users/supporters'); break;
      case 2: navigate('/admin-dashboard/users/admins'); break;
      default: break;
    }
  };

  const handleClickOpen = (user) => {
    setDeleteUser(user);
    setDialogOpen(true);
  };

  const handleClickClose = () => {
    setDialogOpen(false);
    setDeleteUser(null);
  };

  const getUserById = async () => {
    if (!selectedUser?.id) {
      toast.error("No user selected");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/users/user?id=${selectedUser.id}`);
      if (response.status !== 200) throw new Error("Failed to fetch user data");
      navigate("/admin-dashboard/users/updateuser", { state: { userData: response.data } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserById = async () => {
    if (!deleteUser) return;
    setLoading(true);
    try {
      const response = await api.delete(`/users/deleteuser?id=${deleteUser.id}`);
      if (response.status === 200) {
        toast.success('User deleted successfully');
        handleClickClose();
        // Refresh current tab data
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      console.error('Error:', error);
      handleClickClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-center" autoClose={3000} />

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          User Management
        </Typography>
        <Topbuttons />
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Customers" />
          <Tab label="Supporters" />
          <Tab label="Admins" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <Routes>
            <Route
              path="/customers"
              element={
                <Customers
                  onCustomerSelect={(userData) => setSelectedUser(userData)}
                  onCustomerDelete={(user) => handleClickOpen(user)}
                />
              }
            />
            <Route
              path="/supporters"
              element={
                <Supporters
                  onSupporterSelect={(userData) => setSelectedUser(userData)}
                  onSupporterDelete={(user) => handleClickOpen(user)}
                />
              }
            />
            <Route
              path="/admins"
              element={
                <Admins
                  onAdminSelect={(userData) => setSelectedUser(userData)}
                  onAdminDelete={(user) => handleClickOpen(user)}
                />
              }
            />
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/updateuser" element={<UpdateUser />} />
          </Routes>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
      >
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteUser?.email || 'this user'}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={deleteUserById} 
            color="error" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
