import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
} from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { api } from "../../../api";
import Brandsbuttons from './brandsbuttons';
import Allbrands from './allbrands';
import Addbrand from './addbrand';
import Updatebrand from './updatebrand';

export default function Brand() {
  const [selectedBrand, setSelectedBrand] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [brandsRefreshKey, setBrandsRefreshKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (selectedBrand?.id && selectedBrand?.name) {
      getBrandById();
    }
    // eslint-disable-next-line
  }, [selectedBrand]);

  const handleClickOpen = (brand) => {
    setDeleteData(brand);
    setDialogOpen(true);
  };

  const handleClickClose = () => {
    setDialogOpen(false);
    setDeleteData(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getBrandById = async () => {
    if (!selectedBrand?.id) {
      console.error("Error: No brand selected.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(
        `/brands/brand/${selectedBrand.id}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch brand data");
      }
      navigate("/admin-dashboard/brands/updatebrand", {
        state: { brandData: response.data },
      });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      showSnackbar("Failed to fetch brand details", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async () => {
    if (!deleteData) return;

    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.delete(`/brands/deletebrand/${deleteData.id}`),
        api.delete(`/categories/deletebrandscategory?id=${deleteData.id}`),
        api.delete(`/products/deleteproductbrand?id=${deleteData.id}`),
      ]);

      const hasErrors = results.some(result => result.status === "rejected");
      if (hasErrors) {
        showSnackbar("Brand deleted but some related data operations failed", "warning");
      } else {
        showSnackbar("Brand deleted successfully", "success");
      }

      handleClickClose();
      setBrandsRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
      showSnackbar("Failed to delete brand", "error");
      handleClickClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 9999,
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Processing...
            </Typography>
          </Box>
        )}

        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Brand Management
        </Typography>

        <Brandsbuttons /> {/* Assuming Brandsbuttons is a component containing your buttons */}

        <Routes>
          <Route
            path="/"
            element={
              <Allbrands
                onBrandSelect={setSelectedBrand}
                onBrandDelete={handleClickOpen}
                refreshKey={brandsRefreshKey}
              />
            }
          />
          <Route path="/addbrand" element={<Addbrand />} />
          <Route path="/updatebrand" element={<Updatebrand />} />
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
            Are you sure you want to permanently delete{" "}
            <strong>{deleteData?.name || "this brand"}</strong>? This action cannot be undone.
            Deleting a brand will also delete associated categories and products.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClickClose}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteBrand}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}