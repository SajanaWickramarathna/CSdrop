import React, { useEffect, useState } from 'react'
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function Allbrands({ onBrandSelect, onBrandDelete, refreshKey }) {
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/brands/with-product-count');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [refreshKey]); // <-- depend on refreshKey

  return (
    <TableContainer component={Paper} className='mt-6 !rounded-2xl'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Brand ID</TableCell>
            <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Brand Name</TableCell>
            <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Status</TableCell>
            <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Product Count</TableCell>
            <TableCell className='!font-bold !text-[14px] !uppercase !text-center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brands.length > 0 ? brands.map(row => (
            <TableRow key={row.brand_id}>
              <TableCell className='!text-center'>{row.brand_id}</TableCell>
              <TableCell className='!text-center'>{row.brand_name}</TableCell>
              <TableCell className='!text-center'>{row.brand_status}</TableCell>
              <TableCell className='!text-center'>{row.product_count}</TableCell>
              <TableCell>
                <div className='flex gap-6 justify-center'>
                  <Button className='!bg-custom-gradient !px-4 !text-white hover:!bg-[#6610f2]' onClick={() => onBrandSelect({id:row.brand_id , name: row.brand_name})} startIcon={<Edit/>}>Edit</Button>
                  <Button className='!bg-[#ff4c51] !text-white hover:!bg-[#ff0000]' onClick={() => onBrandDelete({id:row.brand_id , name: row.brand_name})} startIcon={<Delete/>}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6}>No Data Found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}