import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Grid, CircularProgress, Box
} from '@mui/material';
import axios from 'axios';

export default function Dashboard() {
    // Product Data
    const [productCount, setProductCount] = useState(0);
      const [categoryCount, setCategoryCount] = useState(0);
      const [brandCount, setBrandCount] = useState(0);

      useEffect(() => {
        async function fetchData() {
          try {
            const [productRes, categoryRes, brandRes, stockRes] = await Promise.all([
              axios.get('http://localhost:3001/api/products/'),
              axios.get('http://localhost:3001/api/categories/'),
              axios.get('http://localhost:3001/api/brands/'),
            ]);
            setProductCount(productRes.data.length);
            setCategoryCount(categoryRes.data.length);
            setBrandCount(brandRes.data.length);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          }
        }
        fetchData();
      }, []);
      const [analytics, setAnalytics] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchAnalytics = async () => {
          try {
            const res = await axios.get('http://localhost:3001/api/orders/analytics');
            setAnalytics(res.data);
          } catch (err) {
            console.error('Failed to fetch analytics', err);
          } finally {
            setLoading(false);
          }
        };
        fetchAnalytics();
      }, []);

      if (loading) {
        return (
          <Box className="flex justify-center items-center min-h-[60vh]">
            <CircularProgress />
          </Box>
        );
      }

      if (!analytics) {
        return <Typography align="center" color="error">Failed to load analytics.</Typography>;
      }


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Typography variant="h4" align="center" className="font-bold mb-10">
          📊 Product Summary
        </Typography>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[{ label: 'Total Products', value: productCount }, { label: 'Total Categories', value: categoryCount }, { label: 'Total Brands', value: brandCount }].map((item, index) => (
            <div key={index} className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-lg font-medium text-gray-600">{item.label}</h2>
              <p className="text-4xl font-bold text-blue-600">{item.value}</p>
            </div>
          ))}
      </div>
      
    <Box className="p-6 md:p-10">
      <Typography variant="h4" align="center" className="font-bold mb-10">
        📊 Order Summary
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="p-6 rounded-2xl text-center shadow-lg">
            <Typography variant="subtitle1">Total Orders</Typography>
            <Typography variant="h5" className="text-blue-600 font-bold">
              {analytics.totalOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="p-6 rounded-2xl text-center shadow-lg">
            <Typography variant="subtitle1">Total Revenue</Typography>
            <Typography variant="h5" className="text-green-600 font-bold">
              Rs. {analytics.totalRevenue.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="p-6 rounded-2xl text-center shadow-lg">
            <Typography variant="subtitle1">Average Order Value</Typography>
            <Typography variant="h5" className="text-purple-600 font-bold">
              Rs. {analytics.averageOrderValue.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="p-6 rounded-2xl text-center shadow-lg">
            <Typography variant="subtitle1">Conversion Rate</Typography>
            <Typography variant="h5" className="text-orange-500 font-bold">
              {analytics.conversionRate.toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="p-6 rounded-2xl text-center shadow-lg">
            <Typography variant="subtitle1">Orders This Month</Typography>
            <Typography variant="h5" className="text-cyan-600 font-bold">
              {analytics.ordersThisMonth}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="p-6 rounded-2xl text-center shadow-lg">
            <Typography variant="subtitle1">Orders Today</Typography>
            <Typography variant="h5" className="text-red-500 font-bold">
              {analytics.ordersToday}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}
