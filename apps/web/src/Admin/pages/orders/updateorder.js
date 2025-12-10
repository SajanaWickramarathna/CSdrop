import { api } from "../../../api";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from "@mui/material";
import {
  ArrowBack,
  CheckCircle,
  LocalShipping,
  Payment,
  HourglassEmpty,
  Cancel,
  ZoomIn,
  Save
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }
      }
    }
  }
});

const statusConfig = {
  pending: {
    icon: <HourglassEmpty color="warning" />,
    color: 'warning',
    label: 'Pending'
  },
  processing: {
    icon: <HourglassEmpty color="info" />,
    color: 'info',
    label: 'Processing'
  },
  inDelivery: {
    icon: <LocalShipping color="primary" />,
    color: 'primary',
    label: 'In Delivery'
  },
  delivered: {
    icon: <CheckCircle color="success" />,
    color: 'success',
    label: 'Delivered'
  },
  cancelled: {
    icon: <Cancel color="error" />,
    color: 'error',
    label: 'Cancelled'
  }
};

export default function UpdateOrder() {
  const [orderData, setOrderData] = useState({
    order_id: "",
    user_id: "",
    total_price: "",
    status: "pending",
    items: [],
    payment_slip: "",
    payment_method: ""
  });

  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const orderDataFromLocation = location.state?.orderData;

  useEffect(() => {
    if (orderDataFromLocation) {
      setOrderData({
        order_id: orderDataFromLocation.order_id || "",
        user_id: orderDataFromLocation.user_id || "",
        total_price: orderDataFromLocation.total_price || "",
        status: orderDataFromLocation.status || "pending",
        items: orderDataFromLocation.items || [],
        payment_slip: orderDataFromLocation.payment_slip || "",
        payment_method: orderDataFromLocation.payment_method || ""
      });
    } else {
      navigate("/admin-dashboard/orders");
    }
  }, [orderDataFromLocation, navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (orderData.items.length > 0) {
        setLoading(true);
        try {
          const productPromises = orderData.items.map(async (item) => {
            try {
              const productRes = await api.get(
                `/products/product/${item.product_id}`
              );
              const product = productRes.data;
              return {
                ...item,
                product_name: product.product_name,
                product_price: product.product_price,
                product_images: product.images || [],
              };
            } catch (err) {
              console.error(`Error fetching product ${item.product_id}`, err);
              return {
                ...item,
                product_name: "Unknown Product",
                product_price: 0,
                product_images: []
              };
            }
          });

          const productsWithDetails = await Promise.all(productPromises);
          setProducts(productsWithDetails);
        } catch (err) {
          console.error("Error fetching product details:", err);
          setErrorMessage("Failed to fetch product details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [orderData.items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    if (!orderData.status) {
      setErrorMessage("Please select a status.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(
        `/orders/update/${orderData.order_id}`,
        orderData
      );

      if (response.status === 200) {
        setSuccessMessage("Order status updated successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard/orders/orders");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating order:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage("");
  };

  if (!orderDataFromLocation) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Update Order #{orderData.order_id}
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleUpdateOrder}>
            {/* Order Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Order ID
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    #{orderData.order_id}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Customer ID
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {orderData.user_id}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    LKR {parseFloat(orderData.total_price).toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Order Status */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Update Order Status
                </FormLabel>
                <RadioGroup
                  row
                  name="status"
                  value={orderData.status}
                  onChange={handleInputChange}
                  sx={{ gap: 2 }}
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <Paper key={status} elevation={0} sx={{ borderRadius: 2 }}>
                      <FormControlLabel
                        value={status}
                        control={<Radio color={config.color} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {config.icon}
                            <Typography>{config.label}</Typography>
                          </Box>
                        }
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          border: orderData.status === status ? `2px solid ${theme.palette[config.color].main}` : '1px solid rgba(0, 0, 0, 0.12)',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>

            {/* Order Items */}
            <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Ordered Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div key={item.product_id} className="p-4 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
                <img
                  src={
                    item.product_images?.[0]
                      ? item.product_images[0].startsWith("http")
                        ? item.product_images[0]
                        : `http://localhost:3001/uploads/${item.product_images[0]}`
                      : "https://via.placeholder.com/300x200?text=No+Image+Available" // More descriptive placeholder
                  }
                  alt={item.product_name}
                  className="w-full h-40 object-cover rounded-md mb-4 shadow-sm animate-fade-in"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Load+Error"; // Specific error placeholder
                  }}
                />
                <h4 className="text-gray-800 font-semibold text-lg truncate w-full">{item.product_name}</h4>
                <p className="text-gray-600 text-sm">Price: LKR {parseFloat(item.product_price).toFixed(2)}</p>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                <p className="text-gray-700 text-base font-medium mt-2">Subtotal: LKR {(item.product_price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center col-span-full">No items found for this order.</p>
            )}
          </div>
        </div>

            {/* Payment Details */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Payment Details
              </Typography>
              {orderData.payment_method === 'Payment Slip' && orderData.payment_slip ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Chip
                    label="Bank Transfer"
                    color="primary"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: 300,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImageClick(`http://localhost:3001/uploads/${orderData.payment_slip}`)}
                  >
                    <img
                      src={`http://localhost:3001/uploads/${orderData.payment_slip}`}
                      alt="Payment Slip"
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        p: 0.5
                      }}
                    >
                      <ZoomIn sx={{ color: 'white' }} fontSize="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Click to view full payment slip
                  </Typography>
                </Box>
              ) : (
                <Chip
                  label="Cash on Delivery (COD)"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Paper>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Save />}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Updating...' : 'Update Order Status'}
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Image Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={handleCloseImageDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Image Preview</DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 4
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}