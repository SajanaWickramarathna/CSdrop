import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import axios from 'axios';

import Brandsbuttons from './brandsbuttons';
import Allbrands from './allbrands';
import Addbrand from './addbrand';
import Updatebrand from './updatebrand';


export default function Brand() {
  const [selectedBrand, setSelectedBrand] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [brandsRefreshKey, setBrandsRefreshKey] = useState(0); // <-- for force reload
  const navigate = useNavigate();

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

  const getBrandById = async () => {
    if (!selectedBrand?.id) return;
    try {
      const response = await axios.get(`http://localhost:3001/api/brands/brand/${selectedBrand.id}`);
      if (response.status !== 200) throw new Error("Failed to fetch brand data");
      navigate("/admin-dashboard/brands/updatebrand", { state: { brandData: response.data } });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    }
  };

  const deleteBrand = async () => {
    if (!deleteData) return;
    try {
      const results = await Promise.allSettled([
        axios.delete(`http://localhost:3001/api/brands/deletebrand/${deleteData.id}`), // <-- Fixed here!
        axios.delete(`http://localhost:3001/api/categories/deletebrandscategory?id=${deleteData.id}`),
        axios.delete(`http://localhost:3001/api/products/deleteproductbrand?id=${deleteData.id}`),
      ]);
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Error in delete call ${index + 1}:`, result.reason);
        }
      });
      handleClickClose();
      setBrandsRefreshKey(k => k + 1); // <-- trigger table refresh
    } catch (error) {
      handleClickClose();
      console.error("Unexpected error during deletion:", error);
    }
  };

  return (
    <div className="container">
      <div className="flex flex-row justify-center">
        <Brandsbuttons />
      </div>
      <div className="shadow-gray-700 shadow-md rounded-2xl">
        <Routes>
          <Route
            path="/"
            element={
              <Allbrands
                onBrandSelect={setSelectedBrand}
                onBrandDelete={handleClickOpen}
                refreshKey={brandsRefreshKey} // <-- pass to child
              />
            }
          />
          <Route path="/addbrand" element={<Addbrand/>} />
          <Route path="/updatebrand" element={<Updatebrand/>} />
        </Routes>
      </div>
      <Dialog open={dialogOpen} onClose={handleClickClose}>
        <DialogTitle>Delete {deleteData?.name || 'this'} Brand</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteData?.name || 'this'} Brand?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={deleteBrand} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}