import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Typography,
  Box,
  Avatar,
  TextField,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import {
  Edit,
  Delete,
  Refresh,
  Search,
  Add,
  FilterList,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export default function Allbrands({ onBrandSelect, onBrandDelete, refreshKey }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/brands/with-product-count');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [refreshKey]);

  const filteredBrands = brands.filter(
    (brand) =>
      brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(brand.brand_id).includes(searchTerm.toLowerCase()) // Allow searching by brand ID
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Header with Search and Actions */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          p: 3,
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(45deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Brand Inventory
          <Chip
            label={`${brands.length} items`}
            size="small"
            variant="outlined"
            sx={{
              ml: 1,
              fontWeight: 500,
              borderColor: alpha(theme.palette.primary.main, 0.3),
            }}
          />
        </Typography>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            size="small"
            placeholder="Search brands..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Table Container */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="brands table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                BRAND
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                STATUS
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                PRODUCT COUNT
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton width={120} />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={60} sx={{ mx: "auto" }} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={40} sx={{ mx: "auto" }} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={100} sx={{ ml: "auto" }} />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      borderRadius: 4,
                      p: 4,
                      maxWidth: 500,
                      mx: "auto",
                    }}
                  >
                    <Typography variant="h6" color="error" gutterBottom>
                      Failed to load brands
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      {error}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Refresh />}
                      onClick={fetchBrands}
                      sx={{ borderRadius: 3 }}
                    >
                      Try Again
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredBrands.length > 0 ? (
              filteredBrands.map((row) => (
                <TableRow
                  key={row.brand_id}
                  hover
                  sx={{
                    "&:last-child td": { border: 0 },
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(row.brand_name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {row.brand_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {row.brand_id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.brand_status}
                      color={getStatusColor(row.brand_status)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: "capitalize",
                        minWidth: 80,
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{row.product_count}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            onBrandSelect({
                              id: row.brand_id,
                              name: row.brand_name,
                            })
                          }
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.2
                              ),
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() =>
                            onBrandDelete({
                              id: row.brand_id,
                              name: row.brand_name,
                            })
                          }
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.2
                              ),
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.action.hover, 0.3),
                      borderRadius: 4,
                      p: 4,
                      maxWidth: 500,
                      mx: "auto",
                    }}
                  >
                    <Search
                      sx={{
                        fontSize: 60,
                        color: theme.palette.text.disabled,
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      No brands found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 3 }}
                    >
                      {searchTerm
                        ? `No brands match "${searchTerm}"`
                        : "Create your first brand to get started"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}