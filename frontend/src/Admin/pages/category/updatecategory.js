import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  AddAPhoto as AddAPhotoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export default function UpdateCategory() {
  const [categoryData, setCategoryData] = useState({
    category_id: '',
    category_name: '',
    category_description: '',
    category_status: 'active',
    category_image: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for initial fetch
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const categoryDataFromLocation = location.state?.categoryData;

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (categoryDataFromLocation) {
      setCategoryData({
        category_id: categoryDataFromLocation.category_id || '',
        category_name: categoryDataFromLocation.category_name || '',
        category_description: categoryDataFromLocation.category_description || '',
        category_status: categoryDataFromLocation.category_status || 'active',
        category_image: categoryDataFromLocation.category_image || '',
      });
      setImagePreview(
        categoryDataFromLocation.category_image?.startsWith('http')
          ? categoryDataFromLocation.category_image
          : `http://localhost:3001${categoryDataFromLocation.category_image || ''}`
      );
      setLoading(false); // Data loaded, set loading to false
    } else {
      showSnackbar('No category selected for update. Redirecting...', 'warning');
      setLoading(false);
      setTimeout(() => {
        navigate('/admin-dashboard/category');
      }, 1500);
    }
  }, [categoryDataFromLocation, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setSnackbar({ ...snackbar, open: false }); // Clear error message on input change
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
      showSnackbar('New image selected. Click Update Category to save.', 'info');
    } else {
      setCategoryImage(null);
      // Keep existing preview if user cancels selection, clear only if invalid file
      if (e.target.files.length > 0) { // Only show error if a file was attempted
        showSnackbar('Please select a valid image file (e.g., JPG, PNG).', 'error');
      }
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({ ...snackbar, open: false }); // Clear any existing messages

    if (!categoryData.category_name.trim() || !categoryData.category_description.trim()) {
      showSnackbar('Please fill in all required fields.', 'error');
      setLoading(false);
      return;
    }

    try {
      const nameToCheck = categoryData.category_name.trim().toLowerCase();
      const checkRes = await axios.get("http://localhost:3001/api/categories");
      const duplicate = checkRes.data.find(cat =>
        cat.category_name && cat.category_name.trim().toLowerCase() === nameToCheck &&
        cat.category_id !== categoryData.category_id
      );
      if (duplicate) {
        showSnackbar("Category name already exists.", 'error');
        setLoading(false);
        return;
      }
    } catch (err) {
      // Allow update to proceed if fetch fails, but you may log error
      console.error("Error checking for duplicate category names:", err);
    }

    const formDataToSend = new FormData();
    formDataToSend.append('category_name', categoryData.category_name.trim());
    formDataToSend.append('category_description', categoryData.category_description);
    formDataToSend.append('category_status', categoryData.category_status);
    if (categoryImage) formDataToSend.append('category_image', categoryImage);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/updatecategory/${categoryData.category_id}`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (response.status === 200) {
        showSnackbar('Category updated successfully!', 'success');
        setTimeout(() => {
          navigate('/admin-dashboard/category');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to update category:', err.response?.data || err.message);
      showSnackbar(err.response?.data?.error || 'Failed to update category', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>
          Loading Category Data...
        </Typography>
      </Box>
    );
  }

  // Handle case where categoryDataFromLocation is not found after initial load (e.g., direct access)
  if (!categoryDataFromLocation) {
    return (
      <Box sx={{
        p: 4,
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          No category data provided.
        </Typography>
        <Button
          variant="contained"
          startIcon={<CancelIcon />}
          onClick={() => navigate('/admin-dashboard/category')}
          sx={{ borderRadius: 2 }}
        >
          Go to Categories List
        </Button>
      </Box>
    );
  }


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
      {loading && ( // This loading refers to submission loading, not initial data fetch
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
            Updating Category...
          </Typography>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
        Update Category
      </Typography>

      <form onSubmit={handleUpdateCategory}>
        {/* Category Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Category Name"
          name="category_name"
          value={categoryData.category_name}
          onChange={handleInputChange}
          required
          sx={{ borderRadius: 2 }}
        />

        {/* Category Description */}
        <TextField
          fullWidth
          margin="normal"
          label="Category Description"
          name="category_description"
          value={categoryData.category_description}
          onChange={handleInputChange}
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
          />
          <label htmlFor="category-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AddAPhotoIcon />}
              sx={{ mb: 1, borderRadius: 2 }}
            >
              Change Category Image
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <img
                src={imagePreview}
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
          {!imagePreview && (
            <Typography variant="body2" color="textSecondary">
              No image uploaded. Click to upload.
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
            value={categoryData.category_status}
            label="Status"
            onChange={handleInputChange}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/admin-dashboard/category')}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              '&:hover': {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                borderColor: theme.palette.error.main,
                boxShadow: `0 3px 5px 2px ${alpha(theme.palette.error.main, 0.3)}`,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              py: 1.2,
              px: 3,
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
            {loading ? 'Updating...' : 'Update Category'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}