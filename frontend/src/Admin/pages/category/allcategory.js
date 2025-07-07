import React, { useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function Allcategory({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories/with-brand-count');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open delete dialog
  const handleClickOpen = (category) => {
    setDeleteData(category);
    setDialogOpen(true);
  };

  // Close delete dialog
  const handleClickClose = () => {
    setDialogOpen(false);
    setDeleteData(null);
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const response = await fetch(`http://localhost:3001/api/categories/deletecategory/${deleteData.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Delete failed');
      handleClickClose();
      fetchCategories();
    } catch (error) {
      alert('Error deleting category');
      console.error(error);
    }
  };

  return (
    <>
      <TableContainer component={Paper} className='mt-6 !rounded-2xl'>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Category ID</TableCell>
              <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Category Name</TableCell>
              <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Status</TableCell>
              <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Brand Count</TableCell>
              <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              categories.length > 0 ? categories.map(row => (
                <TableRow key={row.category_id}>
                  <TableCell className='!text-center'>{row.category_id}</TableCell>
                  <TableCell className='!text-center'>{row.category_name}</TableCell>
                  <TableCell className='!text-center'>{row.category_status}</TableCell>
                  <TableCell className='!text-center'>{row.brand_count}</TableCell>
                  <TableCell>
                    <div className='flex gap-6 justify-center'>
                      <Button
                        className='!bg-custom-gradient !px-4 !text-white hover:!bg-[#6610f2]'
                        onClick={() => onCategorySelect(row)}
                        startIcon={<Edit/>}
                      >
                        Edit
                      </Button>
                      <Button
                        className='!bg-[#ff4c51] !text-white hover:!bg-[#ff0000]'
                        onClick={() => handleClickOpen({ id: row.category_id, name: row.category_name })}
                        startIcon={<Delete/>}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5}>No Data Found</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete {deleteData?.name || 'this'} Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {deleteData?.name || 'this'} Category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}