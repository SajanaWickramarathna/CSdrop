import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Download,
  People,
  AdminPanelSettings,
  Person,
  Group,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from "../../../api"; // Assuming the path to your api.js is correct

const COLORS = ['#4F46E5', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

const roleIcons = {
  admin: <AdminPanelSettings color="primary" />,
  user: <Person color="secondary" />,
  manager: <Group color="info" />,
  // Add more role icons as needed
};

const AnalyticsDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pie');
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the 'api' instance to make the GET request
        const response = await api.get('/users');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const roleCounts = userData.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(roleCounts).map((role) => ({
    name: role,
    value: roleCounts[role],
    percentage: Math.round((roleCounts[role] / userData.length) * 100),
    icon: roleIcons[role.toLowerCase()] || <People />
  }));

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(theme.palette.primary.main);
    doc.text('User Role Analytics Report', 105, 20, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    // Chart image placeholder
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 40, 170, 80, 'F');
    doc.setTextColor(150);
    doc.text('User Role Distribution Chart', 105, 80, { align: 'center' });

    // Data table
    autoTable(doc, {
      startY: 130,
      head: [['Role', 'Count', 'Percentage']],
      body: chartData.map(item => [item.name, item.value, `${item.percentage}%`]),
      headStyles: {
        fillColor: theme.palette.primary.main,
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: 240
      },
      margin: { top: 130 }
    });

    // Summary statistics
    doc.setFontSize(14);
    doc.setTextColor(theme.palette.primary.main);
    doc.text('Summary Statistics', 20, doc.lastAutoTable.finalY + 20);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Users: ${userData.length}`, 20, doc.lastAutoTable.finalY + 30);

    // Save the PDF
    doc.save(`User_Role_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.primary">
            {payload[0].payload.name}
          </Typography>
          <Typography variant="body2">
            Count: <strong>{payload[0].value}</strong>
          </Typography>
          <Typography variant="body2">
            Percentage: <strong>{payload[0].payload.percentage}%</strong>
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" color="primary">
          <People sx={{ verticalAlign: 'middle', mr: 1 }} />
          User Role Analytics
        </Typography>
        <Box>
          <Button
            variant={viewMode === 'pie' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('pie')}
            startIcon={<PieChartIcon />}
            sx={{ mr: 1 }}
          >
            Pie Chart
          </Button>
          <Button
            variant={viewMode === 'bar' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('bar')}
            startIcon={<BarChartIcon />}
          >
            Bar Chart
          </Button>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
        <Chip
          label={`Total Users: ${userData.length}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: '1rem', p: 2 }}
        />
      </Box>

      <Box height={400} mb={4}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value, entry, index) => (
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    {chartData[index].icon}
                    <Box component="span" sx={{ ml: 1 }}>{value}</Box>
                  </Box>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="value"
                name="User Count"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          User Role Distribution
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>Role</TableCell>
                <TableCell align="right">Count</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                        mr: 2,
                        width: 32,
                        height: 32
                      }}>
                        {roleIcons[row.name.toLowerCase()] || <People />}
                      </Avatar>
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell align="right">{row.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={generatePDF}
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Download Full Report
        </Button>
      </Box>
    </Paper>
  );
};

export default AnalyticsDashboard;