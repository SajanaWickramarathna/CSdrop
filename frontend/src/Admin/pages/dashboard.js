import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Card, CardContent,
  Divider, useTheme, Paper, Stack, LinearProgress
} from '@mui/material';
import axios from 'axios';
import {
  ShoppingCart, MonetizationOn, Assessment, Inventory,
  LocalOffer, TrendingUp, Today, Category, BrandingWatermark,
  People, BarChart, AttachMoney, Receipt
} from '@mui/icons-material';
import { 
  LineChart, Line, BarChart as RechartsBarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    loading: true,
    error: null
  });

  const [analytics, setAnalytics] = useState({
    data: null,
    loading: true,
    error: null
  });

  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, brandRes, analyticsRes] = await Promise.all([
          axios.get('http://localhost:3001/api/products/'),
          axios.get('http://localhost:3001/api/categories/'),
          axios.get('http://localhost:3001/api/brands/'),
          axios.get(`http://localhost:3001/api/orders/analytics?range=${timeRange}`)
        ]);
        
        setDashboardData({
          products: productRes.data.length,
          categories: categoryRes.data.length,
          brands: brandRes.data.length,
          loading: false,
          error: null
        });

        setAnalytics({
          data: analyticsRes.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          error: 'Failed to load data',
          loading: false
        }));
        setAnalytics(prev => ({
          ...prev,
          error: 'Failed to load analytics',
          loading: false
        }));
      }
    };

    fetchData();
  }, [timeRange]);

  if (dashboardData.loading || analytics.loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (dashboardData.error || analytics.error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h6" color="error">
          {dashboardData.error || analytics.error}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please try refreshing the page or check your connection
        </Typography>
      </Box>
    );
  }

  const productStats = [
    { 
      label: 'Total Products', 
      value: dashboardData.products, 
      icon: <Inventory fontSize="large" />, 
      color: theme.palette.primary.main,
      trend: analytics.data?.productTrend || 0
    },
    { 
      label: 'Categories', 
      value: dashboardData.categories, 
      icon: <Category fontSize="large" />, 
      color: theme.palette.secondary.main,
      trend: 0
    },
    { 
      label: 'Brands', 
      value: dashboardData.brands, 
      icon: <BrandingWatermark fontSize="large" />, 
      color: theme.palette.info.main,
      trend: 0
    }
  ];

  const orderStats = [
    { 
      label: 'Total Orders', 
      value: analytics.data.totalOrders, 
      icon: <ShoppingCart fontSize="large" />, 
      color: theme.palette.success.main,
      change: analytics.data.orderChange
    },
    { 
      label: 'Total Revenue', 
      value: `Rs. ${analytics.data.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney fontSize="large" />, 
      color: theme.palette.warning.main,
      change: analytics.data.revenueChange
    },
    { 
      label: 'Avg Order Value', 
      value: `Rs. ${analytics.data.averageOrderValue.toFixed(2)}`, 
      icon: <TrendingUp fontSize="large" />, 
      color: theme.palette.error.main,
      change: analytics.data.aovChange
    },
    { 
      label: 'Conversion Rate', 
      value: `${analytics.data.conversionRate.toFixed(2)}%`, 
      icon: <BarChart fontSize="large" />, 
      color: theme.palette.info.main,
      change: analytics.data.conversionChange
    }
  ];

  const recentOrders = analytics.data.recentOrders || [];
  const salesData = analytics.data.salesData || [];
  const categoryDistribution = analytics.data.categoryDistribution || [];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          color: 'text.primary',
          fontSize: { xs: '1.5rem', md: '2rem' }
        }}>
          Dashboard Overview
        </Typography>
        
        <Paper sx={{ 
          p: 1,
          display: 'flex',
          gap: 1,
          borderRadius: 2
        }}>
          {['day', 'week', 'month', 'year'].map((range) => (
            <Paper
              key={range}
              onClick={() => setTimeRange(range)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                cursor: 'pointer',
                bgcolor: timeRange === range ? 'primary.main' : 'background.paper',
                color: timeRange === range ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: timeRange === range ? 'primary.dark' : 'action.hover'
                }
              }}
            >
              <Typography variant="button" sx={{ textTransform: 'capitalize' }}>
                {range}
              </Typography>
            </Paper>
          ))}
        </Paper>
      </Box>

      {/* Product Summary Section */}
      <Typography variant="h6" component="h2" sx={{ 
        mb: 2, 
        fontWeight: 'medium',
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Inventory sx={{ color: 'primary.main' }} />
        Product Summary
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {productStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
                {stat.trend !== 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color={stat.trend > 0 ? 'success.main' : 'error.main'}>
                      {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% from last period
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(Math.abs(stat.trend), 100)} 
                      color={stat.trend > 0 ? 'success' : 'error'}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        mt: 1
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Order Analytics Section */}
      <Typography variant="h6" component="h2" sx={{ 
        mb: 2, 
        fontWeight: 'medium',
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ShoppingCart sx={{ color: 'primary.main' }} />
        Sales Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {orderStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
                {stat.change !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color={stat.change >= 0 ? 'success.main' : 'error.main'}>
                      {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last period
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(Math.abs(stat.change), 100)} 
                      color={stat.change >= 0 ? 'success' : 'error'}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        mt: 1
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: 2,
            p: 2
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
              Sales Trend ({timeRange})
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="date" 
                    stroke={theme.palette.text.secondary}
                    tickFormatter={(value) => {
                      if (timeRange === 'day') return value.split(' ')[1]; // Just time
                      if (timeRange === 'week') return `Week ${value}`;
                      return value;
                    }}
                  />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8,
                      borderColor: theme.palette.divider,
                      backgroundColor: theme.palette.background.paper
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Sales (Rs.)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke={theme.palette.secondary.main} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Category Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: 2,
            p: 2
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
              Category Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`Rs. ${value}`, name]}
                    contentStyle={{ 
                      borderRadius: 8,
                      borderColor: theme.palette.divider,
                      backgroundColor: theme.palette.background.paper
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders Section */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: 2,
        mb: 4
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Receipt sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Recent Orders
            </Typography>
          </Box>
          
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 600 }}>
              <Grid container sx={{ 
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: 'action.hover'
              }}>
                <Grid item xs={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                </Grid>
              </Grid>

              {recentOrders.map((order, index) => (
                <Grid 
                  key={order.id} 
                  container 
                  sx={{ 
                    p: 2,
                    borderBottom: index === recentOrders.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      #{order.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {order.customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2">
                      {new Date(order.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" fontWeight="medium">
                      Rs. {order.amount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ 
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: order.status === 'completed' ? 'success.light' : 
                               order.status === 'pending' ? 'warning.light' : 'error.light',
                      color: order.status === 'completed' ? 'success.dark' : 
                             order.status === 'pending' ? 'warning.dark' : 'error.dark'
                    }}>
                      <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                        {order.status}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}