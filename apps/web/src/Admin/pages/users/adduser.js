import React, { useState } from "react";
import { api } from "../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Home,
  Lock,
  CheckCircle,
  CloudUpload,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const roleTitles = {
    customer: "Customer",
    admin: "Admin",
    supporter: "Customer Supporter",
    manager: "Manager",
    deliver: "Delivery Person",
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      if (image) {
        formDataToSend.append("profile_image", image);
      }

      const BASE_URL = api.defaults.baseURL;

      const endpoints = {
        customer: `${BASE_URL}/customers/signup`,
        supporter: `${BASE_URL}/supporters/signup`,
        admin: `${BASE_URL}/admins/signup`,
      };

      if (!endpoints[role]) {
        toast.error("Invalid role specified");
        return;
      }

      const response = await api.post(endpoints[role], formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(`${roleTitles[role]} created successfully!`);
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: "0 auto" }}>
      <ToastContainer position="top-center" autoClose={3000} />

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            color: "primary.main",
          }}
        >
          Register New {roleTitles[role] || "User"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            {/* Profile Picture Upload */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: "2px dashed",
                    borderColor: "primary.main",
                  }}
                >
                  {!imagePreview && <Person sx={{ fontSize: 60 }} />}
                </Avatar>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ textTransform: "none" }}
                >
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                    required
                  />
                </Button>
              </Box>
            </Grid>

            {/* Name Fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
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
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Contact Fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Password Fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
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
                startIcon={
                  loading ? <CircularProgress size={24} /> : <CheckCircle />
                }
                sx={{
                  py: 2,
                  mt: 2,
                  fontWeight: "bold",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
