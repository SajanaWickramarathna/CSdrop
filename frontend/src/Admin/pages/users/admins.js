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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Box,
  Avatar
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Search, 
  Refresh,
  CheckCircle,
  Cancel,
  AdminPanelSettings,
  Person
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function Admins({ onAdminSelect, onAdminDelete }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admins/admins');
      setAdmins(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching admins', { variant: 'error' });
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admins/customer?id=${id}`);
      setAdmins(admins.filter(admin => admin._id !== id));
      enqueueSnackbar('Admin deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting admin', { variant: 'error' });
      console.error('Error deleting admin:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.toLowerCase();
    const email = (admin.email || '').toLowerCase();
    const userId = (admin.user_id || '').toString().toLowerCase();
    const term = searchTerm.toLowerCase().trim().replace(/\s+/g, ' ');

    return (
      fullName.includes(term) ||
      email.includes(term) ||
      userId.includes(term)
    );
  });

  const getStatusChip = (status) => {
    switch(status) {
      case 'active':
        return <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />;
      case 'inactive':
        return <Chip icon={<Cancel />} label="Inactive" color="error" size="small" />;
      case 'super-admin':
        return <Chip label="Super Admin" color="primary" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Paper elevation={3} className="rounded-2xl p-4"> {/* Updated: Tailwind class for rounded corners and padding */}
      <Box className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"> {/* Updated: Tailwind classes for flex layout and spacing */}
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <AdminPanelSettings sx={{ mr: 1 }} />
          Admin Management
        </Typography>
        
        <Box className="flex items-center gap-2 w-full md:w-auto"> {/* Updated: Tailwind classes for flex layout and width */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className="flex-grow md:w-64" // Updated: Tailwind class for width control
          />
          
          <Tooltip title="Refresh">
            <IconButton onClick={fetchAdmins} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100"> {/* Updated: Tailwind class for background color */}
              <TableCell className="font-bold uppercase">ID</TableCell> {/* Updated: Tailwind classes for font weight and text transform */}
              <TableCell className="font-bold uppercase">Admin</TableCell> {/* Updated: Tailwind classes for font weight and text transform */}
              <TableCell className="font-bold uppercase">Email</TableCell> {/* Updated: Tailwind classes for font weight and text transform */}
              <TableCell className="font-bold uppercase">Status</TableCell> {/* Updated: Tailwind classes for font weight and text transform */}
              <TableCell className="font-bold uppercase text-center">Actions</TableCell> {/* Updated: Tailwind classes for font weight, text transform, and text alignment */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.user_id} hover>
                  <TableCell>{admin.user_id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-2"> {/* Updated: Tailwind classes for flex layout and spacing */}
                      <Avatar 
                        src={admin.profilePic && `http://localhost:3001${admin.profilePic}`}
                        sx={{ width: 36, height: 36 }}
                      >
                        {!admin.profilePic && <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{admin.firstName} {admin.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{admin.username || admin.email.split('@')[0]}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {getStatusChip(admin.userStatus)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton 
                          color="primary"
                          onClick={() => onAdminSelect({ id: admin.user_id, email: admin.email })}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteClick({ id: admin.user_id, email: admin.email })}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm ? 'No matching admins found' : 'No admins available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Admin Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete admin {adminToDelete?.email}? This action cannot be undone.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
            Warning: Deleting admin accounts may affect system functionality.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(adminToDelete?.id)} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}