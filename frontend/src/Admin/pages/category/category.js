import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

import Categorybuttons from './categorybuttons';
import Allcategory from './allcategory';
import Addcategory from './addcategory';
import Updatecategory from './updatecategory';

export default function Category() {
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [categoriesRefreshKey, setCategoriesRefreshKey] = useState(0); // For refreshing the Allcategory component
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();
  const theme = useTheme();

  // Handle edit: fetch category by ID and navigate to update page
  useEffect(() => {
    if (selectedCat?.category_id) {
      getCategoryById(selectedCat.category_id);
    }
  }, [selectedCat]);

  const handleClickOpen = (category) => {
    setDeleteData(category);
    setDialogOpen(true);
  };

  const handleClickClose = () => {
    setDialogOpen(false);
    setDeleteData(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getCategoryById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/categories/category/${id}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch category data');
      }
      navigate('/admin-dashboard/category/updatecategory', { state: { categoryData: response.data } });
    } catch (error) {
      console.error('Axios Error:', error.response?.data || error.message);
      showSnackbar('Failed to fetch category details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!deleteData) return;

    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3001/api/categories/deletecategory/${deleteData.id}`);
      if (response.status === 200) {
        showSnackbar('Category deleted successfully', 'success');
        handleClickClose();
        setCategoriesRefreshKey((k) => k + 1); // Increment key to re-fetch categories
      }
    } catch (error) {
      console.error('Axios Error:', error);
      showSnackbar('Error deleting category', 'error');
      handleClickClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 9999,
              borderRadius: 2,
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Processing...
            </Typography>
          </Box>
        )}

        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Category Management
        </Typography>

        <Categorybuttons />

        <Routes>
          <Route
            path="/"
            element={
              <Allcategory
                onCategorySelect={setSelectedCat}
                onCategoryDelete={handleClickOpen}
                refreshKey={categoriesRefreshKey}
              />
            }
          />
          <Route path="/addcategory" element={<Addcategory />} />
          <Route path="/updatecategory" element={<Updatecategory />} />
        </Routes>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title" sx={{ bgcolor: "error.main", color: "white" }}>
          <Box display="flex" alignItems="center">
            <DeleteIcon sx={{ mr: 1 }} />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete{' '}
            <strong>{deleteData?.name || 'this category'}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClickClose}
            variant="outlined"
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteCategory}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}