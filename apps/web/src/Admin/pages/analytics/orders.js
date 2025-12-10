import React, { useEffect, useState } from "react";
import { api } from "../../../api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Skeleton,
  useTheme,
  useMediaQuery
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
  CartesianGrid
} from "recharts";
import {
  ShoppingCart,
  MonetizationOn,
  AttachMoney,
  People,
  InsertChart,
  PictureAsPdf,
  ArrowUpward,
  ArrowDownward,
  Remove
} from "@mui/icons-material";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper className="p-3 shadow-lg">
        <Typography variant="body2" className="font-semibold">{payload[0].payload.name}</Typography>
        <Typography variant="body2">{`Count: ${payload[0].value}`}</Typography>
        {payload[0].payload.percentage && (
          <Typography variant="body2">{`${payload[0].payload.percentage}%`}</Typography>
        )}
      </Paper>
    );
  }
  return null;
};

const MetricCard = ({ title, value, icon, color, trend }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const TrendIcon = trend > 0 ? ArrowUpward : trend < 0 ? ArrowDownward : Remove;
  const trendColor = trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500";

  return (
    <Paper className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Box className="flex justify-between items-start">
        <Box>
          <Typography variant="subtitle2" className="text-gray-500 font-medium">
            {title}
          </Typography>
          <Typography variant="h4" className="font-bold mt-1">
            {value}
          </Typography>
        </Box>
        <Box className={`p-3 rounded-full ${colorMap[color]}`}>
          {icon}
        </Box>
      </Box>
      {trend !== undefined && (
        <Box className="mt-2 flex items-center">
          <TrendIcon className={`${trendColor} text-sm`} />
          <Typography variant="body2" className={`${trendColor} font-medium ml-1`}>
            {Math.abs(trend)}% from last period
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

const ChartCard = ({ title, data, colors, type, height, xAxisKey, barKey }) => {
  return (
    <Paper className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Typography variant="h6" className="mb-4 text-gray-700 font-semibold">
        {title}
      </Typography>
      <Box className="h-64 sm:h-80" style={{ height }}>
        {type === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey={xAxisKey || "name"} 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend />
              <Bar 
                dataKey={barKey || "value"} 
                fill="#6366F1" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportPDF = async () => {
    const content = document.getElementById("analytics-content");
    if (content) {
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  if (loading) {
    return (
      <Box className="p-6 space-y-6">
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} />
          ))}
        </Box>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={400} />
          ))}
        </Box>
        <Skeleton variant="rectangular" height={400} />
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6 flex flex-col items-center justify-center h-64">
        <Typography color="error" variant="h6" className="mb-4">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!analytics) {
    return null;
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
    <Box className="p-4 md:p-6 space-y-8" id="analytics-content">
      {/* Header and Export Button */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          <InsertChart className="mr-2" fontSize="large" />
          Order Analytics Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PictureAsPdf />}
          onClick={handleExportPDF}
          size={isMobile ? "small" : "medium"}
        >
          Export PDF
        </Button>
      </Box>

      {/* Key Metrics Grid */}
      <Box>
        <Typography variant="h6" className="mb-4 text-gray-700 font-semibold">
          Key Performance Indicators
        </Typography>
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Orders"
            value={analytics.totalOrders}
            icon={<ShoppingCart fontSize="large" />}
            color="indigo"
            trend={analytics.orderTrend || 0}
          />
          <MetricCard
            title="Total Revenue"
            value={`Rs. ${analytics.totalRevenue.toFixed(2)}`}
            icon={<MonetizationOn fontSize="large" />}
            color="green"
            trend={analytics.revenueTrend || 0}
          />
          <MetricCard
            title="Avg. Order Value"
            value={`Rs. ${analytics.averageOrderValue.toFixed(2)}`}
            icon={<AttachMoney fontSize="large" />}
            color="blue"
            trend={analytics.aovTrend || 0}
          />
          <MetricCard
            title="Total Customers"
            value={analytics.totalCustomers}
            icon={<People fontSize="large" />}
            color="purple"
            trend={analytics.customerTrend || 0}
          />
        </Box>
      </Box>

      {/* Pie Charts */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard 
          title="Order Status Distribution"
          data={statusData}
          colors={COLORS}
          type="pie"
          height={350}
        />
        <ChartCard 
          title="Payment Methods"
          data={paymentData}
          colors={COLORS}
          type="pie"
          height={350}
        />
      </Box>

      

      {/* Top Customers Table */}
      <Box>
        <Typography variant="h6" className="mb-3 text-gray-700 font-semibold">
          Top Customers by Spending
        </Typography>
        <Paper className="overflow-hidden rounded-lg shadow-sm">
          <Box className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Box className="flex items-center">
                        <Box className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <People className="h-6 w-6 text-indigo-600" />
                        </Box>
                        <Box className="ml-4">
                          <Typography className="text-sm font-medium text-gray-900">
                            {customer.name || "Anonymous"}
                          </Typography>
                          <Typography className="text-sm text-gray-500">
                            {customer.email || "No email"}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Typography className="text-sm text-gray-900">
                        {customer.orders}
                      </Typography>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Typography className="text-sm font-semibold text-green-600">
                        Rs. {customer.total.toFixed(2)}
                      </Typography>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Analytics;