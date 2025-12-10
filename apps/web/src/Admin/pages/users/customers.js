import React, { useEffect, useState } from 'react';
import { api } from "../../../api";
import { 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { Edit, Delete, Search, Refresh, CheckCircle, Cancel, Person } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function Customers({ onCustomerSelect, onCustomerDelete }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers/users');
      setCustomers(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching customers', { variant: 'error' });
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const userId = (customer.user_id || '').toString().toLowerCase();
    const term = searchTerm.toLowerCase().trim().replace(/\s+/g, ' ');

    return fullName.includes(term) || email.includes(term) || userId.includes(term);
  });

  const getStatusChip = (status) => {
    switch(status) {
      case 'active': return <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />;
      case 'inactive': return <Chip icon={<Cancel />} label="Inactive" color="error" size="small" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  return (
    <Paper elevation={3} className="rounded-2xl p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <Person className="mr-2" /> Customer Management
        </Typography>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            className="flex-grow md:w-64"
          />
          <Tooltip title="Refresh">
            <IconButton onClick={fetchCustomers} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-bold uppercase">User ID</TableCell>
              <TableCell className="font-bold uppercase">User Name</TableCell>
              <TableCell className="font-bold uppercase">User Email</TableCell>
              <TableCell className="font-bold uppercase">Status</TableCell>
              <TableCell className="font-bold uppercase text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((row) => (
                <TableRow key={row.user_id} hover>
                  <TableCell>{row.user_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {row.profilePic && (
                        <img src={`http://localhost:3001${row.profilePic}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                      )}
                      {row.firstName} {row.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{getStatusChip(row.userStatus)}</TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-2">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onCustomerSelect({ id: row.user_id, email: row.email })}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onCustomerDelete({ id: row.user_id, email: row.email })}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    {searchTerm ? 'No matching customers found' : 'No customers available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
