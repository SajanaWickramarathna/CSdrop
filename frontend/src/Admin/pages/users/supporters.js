import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function Supporters({onSupporterSelect, onSupporterDelete}) {
  const [supporters, setSupporters] = useState([]);

  useEffect(() => {
    fetchSupporters();
  }, []);

  const fetchSupporters = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/supporters/supporters');
      setSupporters(response.data);
    } catch (error) {
      console.error('Error fetching supporters:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/supporters/customer?id=${id}`);
      setSupporters(supporters.filter(customer => customer._id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <TableContainer component={Paper}  className='mt-6 !rounded-2xl'> 
          <Table >
            <TableHead>
              <TableRow >
                <TableCell className='!font-bold !text-[14px] !uppercase '>User ID</TableCell>
                <TableCell className='!font-bold !text-[14px] !uppercase '>User Name</TableCell>
                <TableCell className='!font-bold !text-[14px] !uppercase '>User Email</TableCell>
                <TableCell className='!font-bold !text-[14px] !uppercase '>Status</TableCell>
                <TableCell className='!font-bold !text-[14px] !uppercase '>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                supporters.length > 0 ? supporters.map(row =>(
                  <TableRow  key={row.user_id}>
                    <TableCell  className=''>{row.user_id}</TableCell>
                    <TableCell className=''>{row.firstName} {row.lastName}</TableCell>
                    <TableCell  className=''>{row.email}</TableCell>
                    <TableCell  className=''>{row.userStatus}</TableCell>
                    <TableCell>
                      <div className='flex gap-6 justify-center'>
                        <Button className='!bg-custom-gradient !px-4 !text-white hover:!bg-[#6610f2]' onClick={() => onSupporterSelect({id:row.user_id , email: row.email})}  startIcon={<Edit/>}>Edit</Button>
                        <Button className='!bg-[#ff4c51] !text-white hover:!bg-[#ff0000] ' onClick={() => onSupporterDelete({id:row.user_id , email: row.email})} startIcon={<Delete/>}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6}>No Data Found</TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
  );
}
