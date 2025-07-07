import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [token] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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
          const open = tickets.filter((ticket) => ticket.status === "Open").length;
          const inProgress = tickets.filter((ticket) => ticket.status === "In Progress").length;
          const onHold = tickets.filter((ticket) => ticket.status === "On Hold").length;
          const closed = tickets.filter((ticket) => ticket.status === "Closed").length;

          setTicketStats({ total, open, inProgress, onHold, closed });
        })
        .catch((error) => {
          console.error("There was an error fetching the tickets!", error);
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
      const res = await axios.get(`http://localhost:3001/api/orders/user/summary/${user_id}`);
      setOrderSummary(res.data);
    } catch (error) {
      console.error("Error fetching order summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (userData?.user_id) {
      fetchOrderSummary(userData.user_id);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-lg animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Customer Dashboard</h1>

      {/* Ticket Stats Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Ticket Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard label="Total Tickets" value={ticketStats.total} />
          <StatCard label="Open Tickets" value={ticketStats.open} />
          <StatCard label="In Progress" value={ticketStats.inProgress} />
          <StatCard label="On Hold" value={ticketStats.onHold} />
          <StatCard label="Closed Tickets" value={ticketStats.closed} />
        </div>
      </div>

      {/* Order Summary Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {orderSummary &&
            Object.entries(orderSummary).map(([key, value]) => (
              <StatCard key={key} label={key.replace(/_/g, " ")} value={value} />
            ))}
        </div>
      </div>
    </div>
  );
}

// Reusable card component
function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 text-center">
        {label}
      </h4>
      <p className="text-3xl font-extrabold text-indigo-600">{value}</p>
    </div>
  );
}
