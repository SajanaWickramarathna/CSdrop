import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [token] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    onHold: 0,
    closed: 0,
  });

  useEffect(() => {
    if (userData) {
      axios
        .get(`http://localhost:3001/api/tickets/tickets/${userData.user_id}`)
        .then((response) => {
          const tickets = response.data.tickets;
          const total = tickets.length;
          const open = tickets.filter(
            (ticket) => ticket.status === "Open"
          ).length;
          const inProgress = tickets.filter(
            (ticket) => ticket.status === "In Progress"
          ).length;
          const onHold = tickets.filter(
            (ticket) => ticket.status === "On Hold"
          ).length;
          const closed = tickets.filter(
            (ticket) => ticket.status === "Closed"
          ).length;
          setTicketStats({ total, open, inProgress, onHold, closed });
        })
        .catch((error) => {
          console.error("Error fetching tickets!", error);
        });
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/logout";
      }
    }
  };

  const fetchOrderSummary = async (user_id) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/orders/user/summary/${user_id}`
      );
      setOrderSummary(res.data);
    } catch (error) {
      console.error("Error fetching order summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    if (userData?.user_id) fetchOrderSummary(userData.user_id);
  }, [userData]);

  const ticketData = [
    { name: "Open", value: ticketStats.open, color: "#EF4444" },
    { name: "In Progress", value: ticketStats.inProgress, color: "#F59E0B" },
    { name: "On Hold", value: ticketStats.onHold, color: "#6366F1" },
    { name: "Closed", value: ticketStats.closed, color: "#10B981" },
  ];

  const orderData = orderSummary
    ? [
        { name: "Pending", value: orderSummary.pending, color: "#F59E0B" },
        {
          name: "Processing",
          value: orderSummary.processing,
          color: "#3B82F6",
        },
        { name: "Shipped", value: orderSummary.shipped, color: "#8B5CF6" },
        { name: "Delivered", value: orderSummary.delivered, color: "#10B981" },
        { name: "Cancelled", value: orderSummary.cancelled, color: "#EF4444" },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-600 text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData?.firstName || "Customer"}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
               Active {userData?.role?.replace("_", " ") || "User"}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {["overview", "tickets", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Tickets"
                value={ticketStats.total}
                trend="up"
              />
              <StatCard
                label="Open Tickets"
                value={ticketStats.open}
                trend="up"
              />
              <StatCard
                label="Total Orders"
                value={orderSummary?.totalOrders || 0}
                trend="neutral"
              />
              <StatCard
                label="Delivered Orders"
                value={orderSummary?.delivered || 0}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartCard title="Ticket Status">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {ticketData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Order Status">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={orderData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                      {orderData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-8">
            <ChartCard title="Ticket Statistics">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard label="Total Tickets" value={ticketStats.total} />
                <StatCard label="Open Tickets" value={ticketStats.open} />
                <StatCard label="In Progress" value={ticketStats.inProgress} />
                <StatCard label="On Hold" value={ticketStats.onHold} />
                <StatCard label="Closed Tickets" value={ticketStats.closed} />
              </div>
            </ChartCard>

            <ChartCard title="Ticket Status Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={ticketData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" scale="band" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {ticketData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {activeTab === "orders" && orderSummary && (
          <div className="space-y-8">
            <ChartCard title="Order Summary">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                  label="Total Orders"
                  value={orderSummary.totalOrders}
                />
                <StatCard label="Pending" value={orderSummary.pending} />
                <StatCard label="Processing" value={orderSummary.processing} />
                <StatCard label="Shipped" value={orderSummary.shipped} />
                <StatCard label="Delivered" value={orderSummary.delivered} />
                <StatCard label="Cancelled" value={orderSummary.cancelled} />
              </div>
            </ChartCard>

            <ChartCard title="Order Status Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {orderData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };
  const trendIcons = {
    up: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    ),
    down: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    ),
    neutral: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 5h2m0 0h2m-2 0v2m0 2v2m-8-6h2m0 0h2m-2 0v2m0 2v2m8 2h2m0 0h2m-2 0v2m0 2v2m-8-6h2m0 0h2m-2 0v2m0 2v2"
        />
      </svg>
    ),
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </h4>
        {icon && (
          <div className="p-2 rounded-lg bg-opacity-20 bg-gray-200">{icon}</div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span className={`flex items-center text-xs ${trendColors[trend]}`}>
            {trendIcons[trend]}
            <span className="ml-1">2.5%</span>
          </span>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">{children}</div>
    </div>
  );
}
