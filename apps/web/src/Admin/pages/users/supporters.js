import React, { useEffect, useState } from "react";
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
  InputAdornment,
  Box,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search,
  Refresh,
  CheckCircle,
  Cancel,
  SupportAgent,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function Supporters({ onSupporterSelect, onSupporterDelete }) {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchSupporters();
  }, []);

  const fetchSupporters = async () => {
    try {
      setLoading(true);
      const response = await api.get("/supporters/supporters");
      setSupporters(response.data);
    } catch (error) {
      enqueueSnackbar("Error fetching supporters", { variant: "error" });
      console.error("Error fetching supporters:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSupporters = supporters.filter((supporter) => {
    const fullName = `${supporter.firstName || ""} ${
      supporter.lastName || ""
    }`.toLowerCase();
    const email = (supporter.email || "").toLowerCase();
    const userId = (supporter.user_id || "").toString().toLowerCase();
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
          <SupportAgent className="mr-2" /> Supporters Management
        </Typography>

        <Box className="flex items-center gap-2 w-full md:w-auto">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search supporters..."
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
            <IconButton onClick={fetchSupporters} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-bold uppercase">User ID</TableCell>
              <TableCell className="font-bold uppercase">User Name</TableCell>
              <TableCell className="font-bold uppercase">User Email</TableCell>
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
            ) : filteredSupporters.length > 0 ? (
              filteredSupporters.map((row) => (
                <TableRow key={row.user_id} hover>
                  <TableCell>{row.user_id}</TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-2">
                      {row.profilePic && (
                        <img
                          src={`${api.defaults.baseURL.replace("/api", "")}${
                            row.profilePic
                          }`}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {row.firstName} {row.lastName}
                    </Box>
                  </TableCell>

                  <TableCell>{row.email}</TableCell>
                  <TableCell>{getStatusChip(row.userStatus)}</TableCell>
                  <TableCell align="center">
                    <Box className="flex justify-center gap-2">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            onSupporterSelect({
                              id: row.user_id,
                              email: row.email,
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
                            onSupporterDelete({
                              id: row.user_id,
                              email: row.email,
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
                  <Typography variant="body1" color="textSecondary">
                    {searchTerm
                      ? "No matching supporters found"
                      : "No supporters available"}
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
