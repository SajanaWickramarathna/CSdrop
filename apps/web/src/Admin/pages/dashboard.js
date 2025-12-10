import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  useTheme,
  Paper,
  Stack,
  LinearProgress,
  Button,
  Skeleton,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  Avatar,
} from "@mui/material";
import { api } from "../../api";
import {
  ShoppingCart,
  MonetizationOn,
  Inventory,
  TrendingUp,
  TrendingDown,
  Category,
  BrandingWatermark,
  BarChart,
  AttachMoney,
  Receipt,
  Refresh,
  ErrorOutline,
  Download,
  FilterAlt,
  CalendarToday,
  MoreVert,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { format } from "date-fns";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const StatCard = ({ label, value, icon, color, trend, change, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          borderLeft: `4px solid ${color}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: `${color}10`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 2px 12px ${color}20`,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
        </Stack>
        {(trend !== undefined || change !== undefined) && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="caption"
                color={trend > 0 || change >= 0 ? "success.main" : "error.main"}
                sx={{ display: "flex", alignItems: "center", fontWeight: 500 }}
              >
                {trend > 0 || change >= 0 ? (
                  <TrendingUp fontSize="inherit" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown fontSize="inherit" sx={{ mr: 0.5 }} />
                )}
                {Math.abs(trend || change)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs last period
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(Math.abs(trend || change), 100)}
              color={trend > 0 || change >= 0 ? "success" : "error"}
              sx={{
                height: 6,
                borderRadius: 3,
                mt: 1,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const TimeRangeSelector = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          borderRadius: 2,
          bgcolor: "background.paper",
          "& .MuiSelect-select": {
            py: 1,
            display: "flex",
            alignItems: "center",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 2,
              mt: 1,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      >
        {["Today", "Week", "Month", "Year"].map((range) => (
          <MenuItem
            key={range}
            value={range.toLowerCase()}
            sx={{
              "&.Mui-selected": {
                bgcolor: "primary.light",
                "&:hover": {
                  bgcolor: "primary.light",
                },
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">{range}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    loading: true,
    error: null,
  });

  const [analytics, setAnalytics] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = React.useState(0);

  const handleExport = () => {
    if (!analytics.data?.salesData) return;
    const csv = [
      ["Date", "Sales", "Orders"],
      ...analytics.data.salesData.map((row) => [
        row.date,
        row.sales,
        row.orders,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${timeRange}.csv`;
    a.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, brandRes, analyticsRes] =
          await Promise.all([
            api.get("/products/"),
            api.get("/categories/"),
            api.get("/brands/"),
            api.get(`/orders/analytics?timeRange=${timeRange}`),
          ]);

        setDashboardData({
          products: productRes.data.length,
          categories: categoryRes.data.length,
          brands: brandRes.data.length,
          loading: false,
          error: null,
        });

        setAnalytics({
          data: analyticsRes.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({
          ...prev,
          error: "Failed to load data",
          loading: false,
        }));
        setAnalytics((prev) => ({
          ...prev,
          error: "Failed to load analytics",
          loading: false,
        }));
      }
    };

    fetchData();
  }, [timeRange]);
  // Add this function before the return statement
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("₹", "Rs. ");
  };

  if (dashboardData.loading || analytics.loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {[...Array(7)].map((_, index) => (
            <Grid item xs={12} sm={6} md={index < 3 ? 4 : 3} key={index}>
              <Card sx={{ height: 150, borderRadius: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={100} height={30} />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    height={60}
                    sx={{ borderRadius: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </Box>
    );
  }

  if (dashboardData.error || analytics.error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          height: "80vh",
          justifyContent: "center",
        }}
      >
        <ErrorOutline
          sx={{ fontSize: 60, color: "error.main", opacity: 0.8 }}
        />
        <Typography variant="h5" color="error">
          {dashboardData.error || analytics.error}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 500 }}
        >
          We couldn't load the dashboard data. Please check your connection and
          try again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
          sx={{ borderRadius: 2, px: 4, py: 1 }}
        >
          Refresh Dashboard
        </Button>
      </Box>
    );
  }

  const productStats = [
    {
      label: "Total Products",
      value: dashboardData.products.toLocaleString(),
      icon: <Inventory fontSize="large" />,
      color: theme.palette.primary.main,
      trend: analytics.data?.productTrend || 0,
    },
    {
      label: "Categories",
      value: dashboardData.categories.toLocaleString(),
      icon: <Category fontSize="large" />,
      color: theme.palette.secondary.main,
      trend: 0,
    },
    {
      label: "Brands",
      value: dashboardData.brands.toLocaleString(),
      icon: <BrandingWatermark fontSize="large" />,
      color: theme.palette.info.main,
      trend: 0,
    },
  ];

  const orderStats = [
    {
      label: "Total Orders",
      value: analytics.data.totalOrders.toLocaleString(),
      icon: <ShoppingCart fontSize="large" />,
      color: theme.palette.success.main,
      change: analytics.data.orderChange,
    },
    {
      label: "Total Revenue",
      value: `Rs. ${analytics.data.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney fontSize="large" />,
      color: theme.palette.warning.main,
      change: analytics.data.revenueChange,
    },
    {
      label: "Avg Order Value",
      value: `Rs. ${analytics.data.averageOrderValue.toFixed(2)}`,
      icon: <TrendingUp fontSize="large" />,
      color: theme.palette.error.main,
      change: analytics.data.aovChange,
    },
    {
      label: "Conversion Rate",
      value: `${analytics.data.conversionRate.toFixed(2)}%`,
      icon: <BarChart fontSize="large" />,
      color: theme.palette.info.main,
      change: analytics.data.conversionChange,
    },
  ];

  const recentOrders = analytics.data.recentOrders || [];
  const salesData = analytics.data.salesData || [];
  const categoryDistribution = analytics.data.categoryDistribution || [];
  const topProducts = analytics.data.topProducts || [];

  const formatDate = (dateStr) => {
    if (timeRange === "day") {
      return format(new Date(dateStr), "h a");
    } else if (timeRange === "week") {
      return `Week ${dateStr}`;
    } else if (timeRange === "month") {
      return format(new Date(dateStr), "MMM d");
    } else {
      return format(new Date(dateStr), "MMM yyyy");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
        minHeight: "100vh",
        maxWidth: "1800px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: 0.5,
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(), "MMMM d, yyyy")}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ borderRadius: 2 }}
            onClick={handleExport} // Fixed here
          >
            Export
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {orderStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            height: 4,
            borderRadius: "2px 2px 0 0",
          },
        }}
      >
        <Tab label="Sales Analytics" />
        <Tab label="Product Analytics" />
        <Tab label="Recent Orders" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }} direction="column">
          {/* Sales Trend */}
          <Grid item xs={12}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sales Trend
                </Typography>
                <Chip
                  label={`${
                    timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
                  } View`}
                  icon={<FilterAlt fontSize="small" />}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              </Box>

              {/* Chart Container with Fixed Height */}
              <Box sx={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                      opacity={0.5}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={theme.palette.text.secondary}
                      tickFormatter={formatDate}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      tickFormatter={(value) => `Rs. ${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[3],
                        padding: "12px 16px",
                      }}
                      formatter={(value, name) => [`Rs. ${value}`, name]}
                      labelFormatter={formatDate}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      fill="url(#colorSales)"
                      name="Sales"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke={theme.palette.secondary.main}
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        fill: theme.palette.secondary.main,
                      }}
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Revenue Distribution */}
          <Grid item xs={12}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Revenue Distribution
              </Typography>
              <Box sx={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={theme.palette.background.paper}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`Rs. ${value}`]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[3],
                        padding: "12px 16px",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: "20px" }}
                      formatter={(value) => (
                        <Typography variant="caption">{value}</Typography>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Product Statistics
              </Typography>
              <Grid container spacing={3}>
                {productStats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={6} key={index}>
                    <StatCard {...stat} />
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Orders
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "background.paper" }}>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                          }}
                        >
                          {order.customerName.charAt(0)}
                        </Avatar>
                        <Typography>{order.customerName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        {formatCurrency(order.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{
                          bgcolor: "warning.light",
                          color: "warning.dark",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
