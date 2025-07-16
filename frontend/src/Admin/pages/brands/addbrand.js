import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { AddAPhoto as AddAPhotoIcon, Save as SaveIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const AddBrand = () => {
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_description: "",
    brand_status: "active",
  });
  const [brandImage, setBrandImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        showSnackbar("Failed to load categories", "error");
      }
    };
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setBrandImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setBrandImage(null);
      setPreview(null);
      showSnackbar("Please select a valid image file (e.g., JPG, PNG).", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      showSnackbar("Please select a category first!", "error");
      return;
    }

    setLoading(true);

    const brandData = new FormData();
    brandData.append("brand_name", formData.brand_name);
    brandData.append("brand_description", formData.brand_description);
    brandData.append("brand_status", formData.brand_status);
    brandData.append("category_id", categoryId);
    if (brandImage) {
      brandData.append("brand_image", brandImage);
    } else {
      // If image is required, handle this case
      showSnackbar("Brand image is required.", "error");
      setLoading(false);
      return;
    }


    try {
      const res = await axios.post(
        "http://localhost:3001/api/brands/addbrand",
        brandData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200) {
        showSnackbar("Brand added successfully!", "success");
        setFormData({
          brand_name: "",
          brand_description: "",
          brand_status: "active",
        });
        setBrandImage(null);
        setPreview(null);
        setCategoryId("");
        setTimeout(() => {
          navigate("/admin-dashboard/brands");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to add brand:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to add brand. Please try again.",
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
            Adding Brand...
          </Typography>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
        Add New Brand
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Category */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="brand-category-label">Category</InputLabel>
          <Select
            labelId="brand-category-label"
            id="brand-category"
            value={categoryId}
            label="Category"
            onChange={(e) => setCategoryId(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Brand Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Brand Name"
          name="brand_name"
          value={formData.brand_name}
          onChange={handleChange}
          required
          sx={{ borderRadius: 2 }}
        />

        {/* Brand Description */}
        <TextField
          fullWidth
          margin="normal"
          label="Brand Description"
          name="brand_description"
          value={formData.brand_description}
          onChange={handleChange}
          multiline
          rows={4}
          required
          sx={{ borderRadius: 2 }}
        />

        {/* Brand Image */}
        <Box sx={{ my: 2, border: `1px dashed ${theme.palette.divider}`, p: 2, borderRadius: 2, textAlign: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="brand-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="brand-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AddAPhotoIcon />}
              sx={{ mb: 1, borderRadius: 2 }}
            >
              Upload Brand Image
            </Button>
          </label>
          {preview && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <img
                src={preview}
                alt="Brand Preview"
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


        {/* Brand Status */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="brand-status-label">Status</InputLabel>
          <Select
            labelId="brand-status-label"
            id="brand-status"
            name="brand_status"
            value={formData.brand_status}
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
          {loading ? "Adding Brand..." : "Add Brand"}
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

export default AddBrand;