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
import { api } from "../../../api";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import Allproduct from "./allproducts";
import Updateproduct from "./updateproduct";

export default function Product() {
  const [selectedProduct, setSelectedProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [productsRefreshKey, setProductsRefreshKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProduct?.id && selectedProduct?.name) {
      getProductById();
    }
  }, [selectedProduct]);

  const handleClickOpen = (product) => {
    setDeleteData(product);
    setDialogOpen(true);
  };

  const handleClickClose = () => {
    setDialogOpen(false);
    setDeleteData(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getProductById = async () => {
    if (!selectedProduct?.id) {
      console.error("Error: No product selected.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(
        `/products/product/${selectedProduct.id}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch product data");
      }
      navigate("/admin-dashboard/products/updateproduct", {
        state: { productData: response.data },
      });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      showSnackbar("Failed to fetch product details", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!deleteData) return;

    setLoading(true);
    try {
      const productDetailsResponse = await api.get(
        `/products/product/${deleteData.id}`
      );
      const productDetails = productDetailsResponse.data;

      const results = await Promise.allSettled([
        api.delete(
          `/products/deleteproduct/${deleteData.id}`
        ),
        api.post("/stocks/addstock", {
          product_id: productDetails.product_id,
          product_name: productDetails.product_name,
          brand_id: productDetails.brand_id,
          category_id: productDetails.category_id,
          type: "remove",
        }),
      ]);

      const hasErrors = results.some(result => result.status === "rejected");
      if (hasErrors) {
        showSnackbar("Product deleted but some operations failed", "warning");
      } else {
        showSnackbar("Product deleted successfully", "success");
      }

      handleClickClose();
      setProductsRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
      showSnackbar("Failed to delete product", "error");
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
          Product Management
        </Typography>

        <Routes>
          <Route
            path="/"
            element={
              <Allproduct
                onProductSelect={setSelectedProduct}
                onProductDelete={handleClickOpen}
                refreshKey={productsRefreshKey}
              />
            }
          />
          <Route path="/updateproduct" element={<Updateproduct />} />
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
            <strong>{deleteData?.name || "this product"}</strong>? This action cannot be undone.
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
            onClick={deleteProduct} 
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