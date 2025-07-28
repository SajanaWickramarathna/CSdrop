import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CategoryIcon from "@mui/icons-material/Category";
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [ticketCount, setTicketCount] = useState(0);
  const [totalTicketCount, setTotalTicketCount] = useState(0);
  const [contactFormCount, setContactFormCount] = useState(0);
  const [totalContactFormCount, setTotalContactFormCount] = useState(0);
  const [categoryData, setCategoryData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, contactResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/tickets"),
          axios.get("http://localhost:3001/api/contact")
        ]);

        const tickets = ticketsResponse.data.tickets;
        const forms = contactResponse.data.Ms;

        // Process tickets data
        const pendingTickets = tickets.filter(ticket => ticket.status !== "Closed");
        setTicketCount(pendingTickets.length);
        setTotalTicketCount(tickets.length);

        // Process category data
        const categoryCounts = tickets.reduce((acc, ticket) => {
          acc[ticket.Categories] = (acc[ticket.Categories] || 0) + 1;
          return acc;
        }, {});

        setCategoryData({
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              label: "Tickets by Category",
              data: Object.values(categoryCounts),
              backgroundColor: "rgba(103, 28, 189, 0.6)",
              borderColor: "rgba(103, 28, 189, 1)",
              borderWidth: 2,
            },
          ],
        });

        // Process top categories
        const sortedCategories = Object.entries(categoryCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopCategories(sortedCategories);

        // Process priority data
        const priorityCounts = tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
          return acc;
        }, {});

        setPriorityData({
          labels: Object.keys(priorityCounts),
          datasets: [
            {
              label: "Tickets by Priority",
              data: Object.values(priorityCounts),
              backgroundColor: [
                "rgba(33, 202, 75, 0.6)", // Low
                "rgba(235, 139, 14, 0.6)", // Medium
                "rgba(252, 0, 0, 0.6)",    // High
              ],
              borderColor: [
                "rgba(33, 202, 75, 1)",
                "rgba(235, 139, 14, 1)",
                "rgba(252, 0, 0, 1)",
              ],
              borderWidth: 2,
            },
          ],
        });

        // Process top users
        const userTicketCounts = tickets.reduce((acc, ticket) => {
          const userName = ticket.name || "Unknown";
          acc[userName] = (acc[userName] || 0) + 1;
          return acc;
        }, {});

        const sortedUsers = Object.entries(userTicketCounts)
          .map(([userName, count]) => ({ userName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopUsers(sortedUsers);

        // Process contact forms
        const pendingForms = forms.filter(form => !form.reply || form.reply.trim() === "");
        setContactFormCount(pendingForms.length);
        setTotalContactFormCount(forms.length);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Support Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Tickets</p>
                <p className="text-3xl font-semibold text-indigo-600">{ticketCount}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <ErrorIcon className="text-indigo-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Out of {totalTicketCount} total tickets</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-3xl font-semibold text-green-600">{totalTicketCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">All tickets in the system</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Contact Forms</p>
                <p className="text-3xl font-semibold text-yellow-600">{contactFormCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Out of {totalContactFormCount} total forms</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Contact Forms</p>
                <p className="text-3xl font-semibold text-blue-600">{totalContactFormCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">All contact forms in the system</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CategoryIcon className="text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Tickets by Category</h2>
            </div>
            <div className="h-80">
              {categoryData ? (
                <Bar
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 14
                          },
                          color: '#4B5563'
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 12
                          },
                          color: '#4B5563'
                        },
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 12
                          },
                          color: '#4B5563',
                          stepSize: 1
                        },
                        grid: {
                          color: '#E5E7EB'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>

          {/* Priority Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <ErrorIcon className="text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Tickets by Priority</h2>
            </div>
            <div className="h-80">
              {priorityData ? (
                <Bar
                  data={priorityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 14
                          },
                          color: '#4B5563'
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 12
                          },
                          color: '#4B5563'
                        },
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 12
                          },
                          color: '#4B5563',
                          stepSize: 1
                        },
                        grid: {
                          color: '#E5E7EB'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Users by Number of Tickets</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topUsers.map((user, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CategoryIcon className="text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Top Categories</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCategories.map((category, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}