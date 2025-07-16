import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  AddAPhoto as AddAPhotoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export default function UpdateBrand() {
  const [formData, setFormData] = useState({
    brand_name: '',
    brand_description: '',
    brand_status: 'active',
  });
  const [brandImage, setBrandImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  // Get brand ID either from URL param or location.state
  const brandId = params.id || location.state?.brandData?.brand_id;

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
        showSnackbar('Failed to load categories', 'error');
      }
    };
    fetchCategories();
  }, []);

  // Fetch brand data
  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) {
        showSnackbar('No brand selected for update', 'error');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/brands/brand/${brandId}`);
        const brand = res.data;
        setFormData({
          brand_name: brand.brand_name || '',
          brand_description: brand.brand_description || '',
          brand_status: brand.brand_status || 'active',
        });
        setCategoryId(brand.category_id?.toString() || '');
        setImagePreview(
          brand.brand_image
            ? (brand.brand_image.startsWith('http')
                ? brand.brand_image
                : `http://localhost:3001/uploads/${brand.brand_image}`)
            : ''
        );
      } catch (err) {
        console.error('Failed to load brand data:', err);
        showSnackbar('Failed to load brand data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBrandData();
  }, [brandId]); // Depend on brandId to refetch if it changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setBrandImage(file);
      setImagePreview(URL.createObjectURL(file));
      showSnackbar('New image selected. Click Update Brand to save.', 'info');
    } else {
      setBrandImage(null);
      // Keep existing preview if user cancels selection, clear only if invalid file
      if (e.target.files.length > 0) { // Only show error if a file was attempted
        showSnackbar('Please select a valid image file (e.g., JPG, PNG).', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!categoryId) {
      showSnackbar('Please select a category!', 'error');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('brand_name', formData.brand_name);
    formDataToSend.append('brand_description', formData.brand_description);
    formDataToSend.append('brand_status', formData.brand_status);
    formDataToSend.append('category_id', categoryId);
    if (brandImage) {
      formDataToSend.append('brand_image', brandImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/brands/updatebrand/${brandId}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.status === 200) {
        showSnackbar('Brand updated successfully!', 'success');
        setTimeout(() => {
          navigate('/admin-dashboard/brands');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to update brand:', err.response?.data || err.message);
      showSnackbar(err.response?.data?.error || 'Failed to update brand', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>
          Loading Brand Data...
        </Typography>
      </Box>
    );
  }

  // Handle case where brandId is not found after initial load
  if (!brandId) {
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
          Brand not found or invalid ID.
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => navigate('/admin-dashboard/brands')}
          sx={{ borderRadius: 2 }}
        >
          Go to Brands List
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
            Updating Brand...
          </Typography>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
        Update Brand
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
              Change Brand Image
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <img
                src={imagePreview}
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
          {!imagePreview && (
            <Typography variant="body2" color="textSecondary">
              No image uploaded. Click to upload.
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/admin-dashboard/brands')}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              // Current color for 'Cancel'
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              // HOVER STATE FOR RED BACKGROUND
              '&:hover': {
                backgroundColor: theme.palette.error.main, // Red background on hover
                color: theme.palette.error.contrastText, // White text on hover for contrast
                borderColor: theme.palette.error.main, // Red border on hover
                boxShadow: `0 3px 5px 2px ${alpha(theme.palette.error.main, 0.3)}`, // Optional: Add a red shadow
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
            {loading ? 'Updating...' : 'Update Brand'}
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