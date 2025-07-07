import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Router } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
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

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedUser?.id) {
      getUserById();
    }
  }, [selectedUser]);

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
      console.error("Error: No user selected.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/api/users/user?id=${selectedUser.id}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }
      navigate("/admin-dashboard/users/updateuser", { state: { userData: response.data } });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    }
  };

  const deleteUserById = async () => {
    if (!deleteUser) return;
    try {
      const response = await axios.delete(`http://localhost:3001/api/users/deleteuser?id=${deleteUser.id}`);
      if (response.status === 200) {
        handleClickClose();
        Swal.fire({
          title: "Success",
          text: 'User Deleted Successfully!',
          icon:'success'
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      handleClickClose();
      console.error('Axios Error:', error);
    }
  };

  return (
    <div className="container">
              <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex flex-row justify-center mt-12">
        <Topbuttons />
      </div>
      {loading && <div>Loading...</div>}

      <div className="">
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
          
          <Route
          path="/adduser"
          element={<AddUser />}
          />
          <Route
          path="/updateuser"
          element={<UpdateUser />}
          />
          
        </Routes>
      </div>
      

      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete {deleteUser?.name || 'this'} User</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {deleteUser?.name || 'this'} User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={deleteUserById} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      
    </div>
  );
}
