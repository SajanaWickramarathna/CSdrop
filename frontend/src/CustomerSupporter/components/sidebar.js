import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Use useLocation for active state
import { Logout } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import FormIcon from "@mui/icons-material/FormatAlignJustify";
import TicketsIcon from "@mui/icons-material/Quiz";
import AnalyticsIcon from "@mui/icons-material/AnalyticsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationIcon from "@mui/icons-material/Notifications"; // Import NotificationIcon
import { api } from "../../api";
import { CircularProgress } from "@mui/material";

export default function Sidebar() {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/logout");
      } else if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async (userId) => {
    if (!userId) return; // Ensure userId exists before fetching
    try {
      const res = await api.get(
        `/notifications/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const unreadCount = res.data.filter((n) => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      console.warn("No token found, skipping API call.");
      setIsLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    // Fetch notifications once user data is available
    if (userData && userData.user_id) {
      fetchNotifications(userData.user_id);
      // Set up an interval to refetch notifications every 10 seconds
      const interval = setInterval(
        () => fetchNotifications(userData.user_id),
        10000
      );
      return () => clearInterval(interval); // Clean up the interval on unmount
    }
  }, [userData, token]); // Re-run when userData or token changes

  const handleNavigation = (path) => {
    navigate(path, { state: { data: userData } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-64 bg-white flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-64 bg-gradient-to-b from-blue-50 to-white text-blue-900 flex flex-col border-r border-blue-100 shadow-sm">
      {/* Profile Section */}
      <div className="w-full p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={userData?.profilePic ? `${api.defaults.baseURL.replace('/api', '')}${userData.profilePic}` : 'https://via.placeholder.com/96'}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="text-xl font-semibold text-center">
          {userData?.firstName ? `${userData.firstName} ${userData.lastName}` : "Support Staff"}
        </div>
        <div className="text-sm text-blue-500">Customer Supporter</div>
      </div>

      <hr className="border-t border-blue-100 mx-4" />

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {[
            {
              name: "Notifications", // Added Notifications item
              path: "/support-dashboard/notifications",
              icon: <NotificationIcon />,
            },
            {
              name: "Dashboard",
              path: "/support-dashboard",
              icon: <DashboardIcon />,
            },
            {
              name: "Profile",
              path: "/support-dashboard/profile",
              icon: <AccountCircleIcon />,
            },
            {
              name: "Contact Forms",
              path: "/support-dashboard/forms",
              icon: <FormIcon />,
            },
            {
              name: "Tickets",
              path: "/support-dashboard/tickets",
              icon: <TicketsIcon />,
            },
            {
              name: "Analytics",
              path: "/support-dashboard/analytics",
              icon: <AnalyticsIcon />,
            },
          ].map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-blue-50 text-blue-800"
                }`}
              >
                <span className="mr-3 text-blue-600">{item.icon}</span>
                {item.name}
                {/* Badge for Notifications */}
                {item.name === "Notifications" && notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <hr className="border-t border-blue-100 my-4" />

        {/* Settings */}
        <ul>
          <li>
            <button
              onClick={() => handleNavigation("/support-dashboard/settings")}
              className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                location.pathname === "/support-dashboard/settings"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-blue-50 text-blue-800"
              }`}
            >
              <span className="mr-3 text-blue-600">
                <SettingsIcon />
              </span>
              Settings
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer & Logout */}
      <div className="p-4">
        <button
          className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
            navigate("/logout");
          }}
        >
          <Logout className="mr-2" />
          Logout
        </button>

        <footer className="mt-6 text-xs text-blue-400 text-center">
          <p className="mb-1">&copy; {new Date().getFullYear()} DROPship</p>
          <p>All rights reserved</p>
          <p className="mt-2 text-blue-300">Developed by Sajana Wickramarathna</p>
        </footer>
      </div>
    </div>
  );
}