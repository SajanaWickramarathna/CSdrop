import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import axios from 'axios';

import Categorybuttons from './categorybuttons';
import Allcategory from './allcategory';
import Addcategory from './addcategory';
import Updatecategory from './updatecategory';

export default function Category() {
  const [selectedCat, setSelectedCat] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const navigate = useNavigate();

  // Handle edit: fetch category by ID and navigate to update page
  useEffect(() => {
    if (selectedCat?.category_id) {
      getCategoryById(selectedCat.category_id);
    }
    // eslint-disable-next-line
  }, [selectedCat]);

  const handleClickOpen = (category) => {
    setDeleteData(category);
    setDialogOpen(true);
  };

  const handleClickClose = () => {
    setDialogOpen(false);
    setDeleteData(null);
  };

  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/categories/category/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch category data");
      }
      navigate("/admin-dashboard/category/updatecategory", { state: { categoryData: response.data } });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    }
  };

  const deleteCategory = async () => {
    if (!deleteData) return;

    try {
      const response = await axios.delete(`http://localhost:3001/api/categories/deletecategory/${deleteData.category_id}`);
      if (response.status === 200) {
        handleClickClose();
        // Optionally: trigger a refresh in Allcategory via state or context instead of reload
        window.location.reload();
      }
    } catch (error) {
      handleClickClose();
      console.error('Axios Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="flex flex-row justify-center">
        <Categorybuttons />
      </div>

      <div className="shadow-gray-700 shadow-md rounded-2xl">
        <Routes>
          <Route
            path="/"
            element={
              <Allcategory
                onCategorySelect={setSelectedCat} // Pass row object directly
                onCategoryDelete={handleClickOpen}
              />
            }
          />
          <Route path="/addcategory" element={<Addcategory />} />
          <Route path="/updatecategory" element={<Updatecategory />} />
        </Routes>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete {deleteData?.category_name || 'this'} Category</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {deleteData?.category_name || 'this'} Category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={deleteCategory} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}