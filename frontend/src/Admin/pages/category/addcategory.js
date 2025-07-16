import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { AddAPhoto as AddAPhotoIcon, Save as SaveIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    category_name: "",
    category_description: "",
    category_status: "active",
  });

  const [catIcon, setCatIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCatIcon(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setCatIcon(null);
      setPreview(null);
      showSnackbar("Please select a valid image file (e.g., JPG, PNG).", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Normalize name for duplicate check
    const nameToCheck = formData.category_name.trim().toLowerCase();

    try {
      // Get all categories and check normalized
      const checkRes = await axios.get("http://localhost:3001/api/categories");
      const duplicate = checkRes.data.find(
        (cat) => cat.category_name && cat.category_name.trim().toLowerCase() === nameToCheck
      );
      if (duplicate) {
        showSnackbar("Category name already exists.", "error");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Failed to check existing categories:", err);
      showSnackbar("Failed to check existing categories.", "error");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("category_name", formData.category_name.trim());
    formDataToSend.append("category_description", formData.category_description);
    formDataToSend.append("category_status", formData.category_status);

    if (catIcon) {
      formDataToSend.append("category_image", catIcon);
    } else {
      showSnackbar("Category image is required.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/categories/addcategory",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        showSnackbar("Category Added Successfully!", "success");
        setFormData({
          category_name: "",
          category_description: "",
          category_status: "active",
        });
        setCatIcon(null);
        setPreview(null);

        setTimeout(() => {
          navigate("/admin-dashboard/category");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to add category. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
        position: 'relative', // For loading overlay
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
            borderRadius: 4,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>
            Adding Category...
          </Typography>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
        Add New Category
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Category Name"
          name="category_name"
          value={formData.category_name}
          onChange={handleChange}
          required
          sx={{ borderRadius: 2 }}
        />

        {/* Category Description */}
        <TextField
          fullWidth
          margin="normal"
          label="Category Description"
          name="category_description"
          value={formData.category_description}
          onChange={handleChange}
          multiline
          rows={4}
          required
          sx={{ borderRadius: 2 }}
        />

        {/* Category Image */}
        <Box sx={{ my: 2, border: `1px dashed ${theme.palette.divider}`, p: 2, borderRadius: 2, textAlign: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="category-image-upload"
            type="file"
            onChange={handleImageChange}
            required // Made image required as per original logic
          />
          <label htmlFor="category-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AddAPhotoIcon />}
              sx={{ mb: 1, borderRadius: 2 }}
            >
              Upload Category Image
            </Button>
          </label>
          {preview && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <img
                src={preview}
                alt="Category Preview"
                style={{
                  maxWidth: '150px',
                  maxHeight: '150px',
                  objectFit: 'cover',
                  borderRadius: theme.shape.borderRadius,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
            </Box>
          )}
          {!preview && (
            <Typography variant="body2" color="textSecondary">
              No image selected. Click to upload.
            </Typography>
          )}
        </Box>

        {/* Category Status */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-status-label">Status</InputLabel>
          <Select
            labelId="category-status-label"
            id="category-status"
            name="category_status"
            value={formData.category_status}
            label="Status"
            onChange={handleChange}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            mt: 3,
            py: 1.5,
            px: 4,
            borderRadius: 2,
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.8)} 30%, ${alpha(theme.palette.secondary.main, 0.8)} 90%)`,
              boxShadow: `0 4px 6px 3px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
          disabled={loading}
        >
          {loading ? "Adding Category..." : "Add Category"}
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddCategory;