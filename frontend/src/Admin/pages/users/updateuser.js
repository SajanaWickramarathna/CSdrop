import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Avatar,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  Home, 
  CloudUpload,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData || {};
  const userId = userData.user_id;

  const [updateData, setUpdateData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
  });

  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(
    userData.profilePic ? `http://localhost:3001${userData.profilePic}` : null
  );
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setProfileImg(file);
        setProfileImgPreview(URL.createObjectURL(file));
      } else {
        toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      }
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("firstName", updateData.firstName);
      formDataToSend.append("lastName", updateData.lastName);
      formDataToSend.append("email", updateData.email);
      formDataToSend.append("phone", updateData.phone);
      formDataToSend.append("address", updateData.address);
      
      if (profileImg) {
        formDataToSend.append("profile_image", profileImg);
      }

      await axios.put("http://localhost:3001/api/users/updateuser", formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("User updated successfully!");
      setTimeout(() => navigate(-1), 1500); // Go back to previous page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 3, 
        width: '100%', 
        maxWidth: 700 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          cursor: 'pointer',
          '&:hover': { color: 'primary.main' }
        }} onClick={() => navigate(-1)}>
          <ArrowBack sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Back</Typography>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          mb: 4,
          color: 'primary.main'
        }}>
          Update User Details
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleAccountSubmit}
          sx={{ mt: 3 }}
        >
          {/* Profile Image Upload */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4
          }}>
            <Avatar
              src={profileImgPreview}
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2,
                border: '2px dashed',
                borderColor: 'primary.main'
              }}
            >
              {!profileImgPreview && <Person sx={{ fontSize: 60 }} />}
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              sx={{ textTransform: 'none' }}
            >
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImgChange}
                hidden
              />
            </Button>
          </Box>

          {/* Name Fields */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={updateData.firstName}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={updateData.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>

            {/* Contact Fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={updateData.email}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={updateData.phone}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={updateData.address}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} /> : <CheckCircle />}
                sx={{ 
                  py: 2,
                  mt: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {loading ? 'Updating...' : 'Update User'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}