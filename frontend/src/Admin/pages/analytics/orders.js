import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF4081"];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/orders/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportPDF = async () => {
    const content = document.getElementById("analytics-content");
    if (content) {
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("analytics-report.pdf");
    }
  };

  if (!analytics) {
    return (
      <Box className="p-6">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const statusData = Object.entries(analytics.statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const paymentData = Object.entries(analytics.paymentMethodCounts).map(([method, count]) => ({
    name: method,
    value: count,
  }));

  return (
    <Box className="p-6 space-y-10" id="analytics-content">
      {/* Export PDF Button */}
      <Box className="flex justify-end mb-4">
        <Button variant="contained" color="primary" onClick={handleExportPDF}>
          Export as PDF
        </Button>
      </Box>

      {/* Key Metrics Grid */}
      <Box>
        <Typography variant="h6" className="mb-4 text-gray-700">📊 Key Metrics</Typography>
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Paper className="p-5 rounded-xl shadow-md bg-white text-center">
            <Typography variant="subtitle2" className="text-gray-500">Total Orders</Typography>
            <Typography variant="h5" className="font-bold text-gray-800 mt-1">
              {analytics.totalOrders}
            </Typography>
          </Paper>

          <Paper className="p-5 rounded-xl shadow-md bg-white text-center">
            <Typography variant="subtitle2" className="text-gray-500">Total Revenue</Typography>
            <Typography variant="h5" className="font-bold text-green-600 mt-1">
              Rs. {analytics.totalRevenue.toFixed(2)}
            </Typography>
          </Paper>

          <Paper className="p-5 rounded-xl shadow-md bg-white text-center">
            <Typography variant="subtitle2" className="text-gray-500">Avg. Order Value</Typography>
            <Typography variant="h5" className="font-bold text-blue-600 mt-1">
              Rs. {analytics.averageOrderValue.toFixed(2)}
            </Typography>
          </Paper>

          <Paper className="p-5 rounded-xl shadow-md bg-white text-center">
            <Typography variant="subtitle2" className="text-gray-500">Total Customers</Typography>
            <Typography variant="h5" className="font-bold text-purple-600 mt-1">
              {analytics.totalCustomers}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Pie Charts */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Paper className="p-4 rounded-xl shadow-md">
          <Typography variant="h6" className="mb-2">📦 Order Status</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`status-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="p-4 rounded-xl shadow-md">
          <Typography variant="h6" className="mb-2">💳 Payment Methods</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`payment-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Top Selling Products Bar Chart */}
      <Box>
        <Typography variant="h6" className="mb-4">🥇 Top Selling Products</Typography>
        <Paper className="p-4 rounded-xl shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Top Customers Table */}
      <Box>
        <Typography variant="h6" className="mb-4">👤 Top Customers</Typography>
        <Paper className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-4">Name</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topCustomers.map((customer, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50 text-sm">
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.orders}</td>
                  <td className="p-4">Rs. {customer.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      </Box>
    </Box>
  );
};

export default Analytics;
