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
import "../resource/analytics.css"; // Ensure the path is correct

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
  const [topUsers, setTopUsers] = useState([]); // State for top users
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/tickets")
      .then((response) => {
        const tickets = response.data.tickets;

        // Calculate pending and total tickets
        const pendingTickets = tickets.filter(
          (ticket) => ticket.status !== "Closed"
        );
        setTicketCount(pendingTickets.length);
        setTotalTicketCount(tickets.length);

        // Process data for category bar chart
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
              borderColor: "rgba(103, 28, 189, 0.6)",
              borderWidth: 3,
            },
          ],
        });

        // Process data for top categories
        const sortedCategories = Object.entries(categoryCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Get top 5 categories

        setTopCategories(sortedCategories);

        // Process data for priority bar chart
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
                "rgba(252, 0, 0, 0.6)", // High
              ],
              borderColor: [
                "rgba(33, 202, 75, 0.6)",
                "rgba(235, 139, 14, 0.6)",
                "rgba(252, 0, 0, 0.6)",
              ],
              borderWidth: 3,
            },
          ],
        });

        // Process data for top users
        const userTicketCounts = tickets.reduce((acc, ticket) => {
          const userName = ticket.name || "Unknown";
          acc[userName] = (acc[userName] || 0) + 1;
          return acc;
        }, {});

        const sortedUsers = Object.entries(userTicketCounts)
          .map(([userName, count]) => ({ userName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Limit to top 5 users

        setTopUsers(sortedUsers);
      })
      .catch((error) => console.error("Error fetching tickets:", error));

    axios
      .get("http://localhost:3001/api/contact")
      .then((response) => {
        const forms = response.data.Ms;
        const pendingForms = forms.filter(
          (form) => !form.reply || form.reply.trim() === ""
        );
        setContactFormCount(pendingForms.length);
        setTotalContactFormCount(forms.length);
      })
      .catch((error) => console.error("Error fetching contact forms:", error));
  }, []);

  return (
    <div className="page-container">
      <h1 className="header-title">Contact Support Header</h1>

      <div className="grid-container">
        <div className="card">
          <h2 className="card-title">Pending Tickets</h2>
          <p className="card-value">{ticketCount}</p>
        </div>
        <div className="card">
          <h2 className="card-title">Total Tickets</h2>
          <p className="card-value">{totalTicketCount}</p>
        </div>
        <div className="card">
          <h2 className="card-title">Pending Contact Forms</h2>
          <p className="card-value">{contactFormCount}</p>
        </div>
        <div className="card">
          <h2 className="card-title">Total Contact Forms</h2>
          <p className="card-value">{totalContactFormCount}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="header-title">
          <CategoryIcon
            style={{ marginRight: "8px", verticalAlign: "middle" , size: "40px"}} 
          />
          Tickets by Category
        </h2>
        {categoryData ? (
          <div className="chart">
            <Bar
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: { size: 14 },
                      color: "#4B5563",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 12 },
                      color: "#4B5563",
                    },
                    grid: { display: false },
                  },
                  y: {
                    ticks: {
                      font: { size: 12 },
                      color: "#4B5563",
                      stepSize: 1,
                    },
                    grid: { color: "#E5E7EB" },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>Loading category chart...</p>
        )}
      </div>

      <div className="chart-container">
        <h2 className="header-title">
          <ErrorIcon
            style={{
              marginRight: "8px",
              marginBottom: "4px",
              verticalAlign: "middle",
              fontSize: "34px", // Adjust size to match CategoryIcon
              color: "red", 
            }}
          />
          Tickets by Priority
        </h2>
        {priorityData ? (
          <div className="chart">
            <Bar
              data={priorityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: { size: 14 },
                      color: "#4B5563",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 12 },
                      color: "#4B5563",
                    },
                    grid: { display: false },
                  },
                  y: {
                    ticks: {
                      font: { size: 12 },
                      color: "#4B5563",
                      stepSize: 1,
                    },
                    grid: { color: "#E5E7EB" },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>Loading priority chart...</p>
        )}
      </div>
      <div className="top-users-container">
        <h2 className="header-title">Top Users by Number of Tickets</h2>
        <table className="top-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.userName}</td>
                <td>{user.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="top-categories-container">
        <h2 className="header-title">
          <CategoryIcon
            style={{ marginRight: "8px", verticalAlign: "middle" , size: "40px" }}
          />
          Top Categories by Number of Tickets
        </h2>
        <table className="top-categories-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {topCategories.map((category, index) => (
              <tr key={index}>
                <td>{category.category}</td>
                <td>{category.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
