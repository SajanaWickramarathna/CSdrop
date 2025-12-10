import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import OrdersIcon from "@mui/icons-material/ShoppingBag";
import NotificationIcon from "@mui/icons-material/Notifications";
import TicketIcon from "@mui/icons-material/ListAltOutlined";
import PlusOneIcon from "@mui/icons-material/PlusOneOutlined";
import SettingIcon from "@mui/icons-material/SettingsOutlined";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { api } from "../../api";
import { CircularProgress } from "@mui/material";
import { useCart } from "../../context/CartContext";

export default function Sidebar() {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const { cartCount, fetchCartCount } = useCart(); // grab fetchCartCount
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setToken(null);
          navigate("/logout");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get(
          `/notifications/user/${userData.user_id}`
        );
        const unreadCount = res.data.filter((n) => !n.read).length;
        setNotificationCount(unreadCount);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // *** HERE: fetch cart count as well ***
    fetchCartCount();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userData, fetchCartCount]); // Added fetchCartCount to deps

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
            src={`${api.defaults.baseURL.replace('/api', '')}${userData?.profilePic}`}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="text-xl font-semibold text-center">
          {userData?.firstName} {userData?.lastName}
        </div>
        <div className="text-sm text-blue-500">Customer</div>
      </div>

      <hr className="border-t border-blue-100 mx-4" />

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {[
            {
              name: "Dashboard",
              path: "/customer-dashboard",
              icon: <DashboardIcon />,
            },
            {
              name: "Profile",
              path: "/customer-dashboard/profile",
              icon: <AccountCircleIcon />,
            },
            {
              name: "Cart",
              path: "/customer-dashboard/cart",
              icon: <ShoppingCartIcon />,
            },
            {
              name: "Orders",
              path: "/customer-dashboard/orders",
              icon: <OrdersIcon />,
            },
            {
              name: "Delivery",
              path: "/customer-dashboard/delivery",
              icon: <LocalShippingIcon />,
            },
            {
              name: "Notifications",
              path: "/customer-dashboard/notifications",
              icon: <NotificationIcon />,
            },
            {
              name: "Tickets",
              path: "/customer-dashboard/tickets",
              icon: <TicketIcon />,
            },
            {
              name: "Add Ticket",
              path: "/customer-dashboard/addticket",
              icon: <PlusOneIcon />,
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
                {/* Badge for Cart */}
                {item.name === "Cart" && cartCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartCount}
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
              onClick={() => handleNavigation("/customer-dashboard/settings")}
              className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                location.pathname === "/customer-dashboard/settings"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-blue-50 text-blue-800"
              }`}
            >
              <span className="mr-3 text-blue-600">
                <SettingIcon />
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
          <p className="mt-2 text-blue-300">
            Developed by Sajana Wickramarathna
          </p>
        </footer>
      </div>
    </div>
  );
}
