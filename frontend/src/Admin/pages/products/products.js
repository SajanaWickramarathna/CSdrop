import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import axios from "axios";

import Allproduct from "./allproducts";
import Updateproduct from "./updateproduct";

export default function Product() {
  const [selectedProduct, setSelectedProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [productsRefreshKey, setProductsRefreshKey] = useState(0);

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

  const getProductById = async () => {
    if (!selectedProduct?.id) {
      console.error("Error: No product selected.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/api/products/product/${selectedProduct.id}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch product data");
      }
      navigate("/admin-dashboard/products/updateproduct", {
        state: { productData: response.data },
      });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    }
  };

  const deleteProduct = async () => {
    if (!deleteData) return;

    try {
      const productDetailsResponse = await axios.get(
        `http://localhost:3001/api/products/product/${deleteData.id}`
      );
      const productDetails = productDetailsResponse.data;

      const results = await Promise.allSettled([
        axios.delete(
          `http://localhost:3001/api/products/deleteproduct/${deleteData.id}`
        ),
        axios.post("http://localhost:3001/api/stocks/addstock", {
          product_id: productDetails.product_id,
          product_name: productDetails.product_name,
          brand_id: productDetails.brand_id,
          category_id: productDetails.category_id,
          // quantity: productDetails.stock_count,
          type: "remove",
        }),
      ]);

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Error in operation ${index + 1}:`, result.reason);
        }
      });

      handleClickClose();
      setProductsRefreshKey((k) => k + 1); // refresh the list!
    } catch (error) {
      handleClickClose();
      console.error("Unexpected error during deletion:", error);
    }
  };

  return (
    <div className="container">
      {loading && <div>Loading...</div>}

      <div className="shadow-gray-700 shadow-md rounded-2xl">
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
      </div>

      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete {deleteData?.name || "this"} Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {deleteData?.name || "this"}{" "}
            Product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={deleteProduct} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
