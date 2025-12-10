import React, { useEffect, useState } from "react";
import { api } from "../../../api";
import {
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
  InputAdornment,
  Box,
  Avatar,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search,
  Refresh,
  CheckCircle,
  Cancel,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function Admins({ onAdminSelect, onAdminDelete }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admins/admins");
      setAdmins(response.data);
    } catch (error) {
      enqueueSnackbar("Error fetching admins", { variant: "error" });
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.firstName || ""} ${
      admin.lastName || ""
    }`.toLowerCase();
    const email = (admin.email || "").toLowerCase();
    const userId = (admin.user_id || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase().trim().replace(/\s+/g, " ");
    return (
      fullName.includes(term) || email.includes(term) || userId.includes(term)
    );
  });

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Active"
            color="success"
            size="small"
          />
        );
      case "inactive":
        return (
          <Chip icon={<Cancel />} label="Inactive" color="error" size="small" />
        );
      case "super-admin":
        return <Chip label="Super Admin" color="primary" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Paper elevation={3} className="rounded-2xl p-4">
      <Box className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
        >
          <AdminPanelSettings sx={{ mr: 1 }} /> Admin Management
        </Typography>

        <Box className="flex items-center gap-2 w-full md:w-auto">
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
            className="flex-grow md:w-64"
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
            <TableRow className="bg-gray-100">
              <TableCell className="font-bold uppercase">ID</TableCell>
              <TableCell className="font-bold uppercase">Admin</TableCell>
              <TableCell className="font-bold uppercase">Email</TableCell>
              <TableCell className="font-bold uppercase">Status</TableCell>
              <TableCell className="font-bold uppercase text-center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.user_id} hover>
                  <TableCell>{admin.user_id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-2">
                      <Avatar
                        src={
                          admin.profilePic
                            ? `${api.defaults.baseURL.replace("/api", "")}${
                                admin.profilePic
                              }`
                            : null
                        }
                        sx={{ width: 36, height: 36 }}
                      >
                        {!admin.profilePic && <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {admin.firstName} {admin.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{admin.username || admin.email.split("@")[0]}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getStatusChip(admin.userStatus)}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            onAdminSelect({
                              id: admin.user_id,
                              email: admin.email,
                            })
                          }
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() =>
                            onAdminDelete({
                              id: admin.user_id,
                              email: admin.email,
                            })
                          }
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
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm
                      ? "No matching admins found"
                      : "No admins available"}
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
