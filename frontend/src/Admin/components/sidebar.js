import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/adminlogo.png";
import { Logout, Copyright, ExpandMore, ExpandLess } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PromotionIcon from "@mui/icons-material/DiscountOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AnalyticsIcon from "@mui/icons-material/AnalyticsOutlined";
import axios from "axios";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import StoreIcon from "@mui/icons-material/StorefrontOutlined";

export default function Sidebar() {
  const [openDropdowns, setOpenDropdowns] = useState({
    users: false,
    inventory: false,
    analytics: false,
  });

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = "/logout";
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-64 bg-white flex items-center justify-center">
        <div className="animate-pulse text-blue-500">Loading user data...</div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Home",
      icon: <HomeIcon className="mr-3" />,
      to: "/",
      type: "link",
    },
    {
      name: "Shop",
      icon: <StoreIcon className="mr-3" />,
      to: "/shop",
      type: "link",
    },
    {
      name: "Dashboard",
      icon: <DashboardIcon className="mr-3" />,
      to: "/admin-dashboard",
      type: "link",
    },
    {
      name: "Manage Users",
      icon: <PeopleIcon className="mr-3" />,
      type: "dropdown",
      items: [
        { name: "Customers", to: "/admin-dashboard/users/customers" },
        { name: "Supporters", to: "/admin-dashboard/users/supporters" },
        { name: "Admins", to: "/admin-dashboard/users/admins" },
      ],
    },
    {
      name: "Inventory",
      icon: <InventoryIcon className="mr-3" />,
      type: "dropdown",
      items: [
        { name: "Add Product", to: "/admin-dashboard/addproduct" },
        { name: "Products", to: "/admin-dashboard/products" },
        { name: "Categories", to: "/admin-dashboard/category" },
        { name: "Brands", to: "/admin-dashboard/brands" },
      ],
    },
    {
      name: "Orders",
      icon: <ShoppingCartIcon className="mr-3" />,
      to: "/admin-dashboard/orders/orders",
      type: "link",
    },
    {
      name: "Analytics",
      icon: <AnalyticsIcon className="mr-3" />,
      type: "dropdown",
      items: [
        { name: "Users", to: "/admin-dashboard/analytics/users" },
        { name: "Orders", to: "/admin-dashboard/analytics/orders" },
      ],
    },
    {
      name: "Delivery",
      to: "/admin-dashboard/delivery",
      icon: <LocalShippingIcon className="mr-3" />,
      type: "link",
    },
    { type: "divider" },
    {
      name: "Settings",
      icon: <SettingsIcon className="mr-3" />,
      to: "/admin-dashboard/settings",
      type: "link",
    },
  ];

  return (
    <div className="min-h-screen w-64 bg-white text-blue-950 flex flex-col border-r border-gray-200">
      <div className="w-full h-16 p-4 flex items-center">
        <img
          src={Logo}
          alt="logo"
          className="w-32 transition-all hover:scale-105"
        />
      </div>

      <hr className="border-gray-200 mx-4" />

      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {navItems.map((item, index) => {
            if (item.type === "divider") {
              return <hr key={index} className="border-gray-200 my-2 mx-4" />;
            }

            if (item.type === "link") {
              return (
                <li key={item.name} className="px-4 my-1">
                  <NavLink
                    to={item.to}
                    state={{ data: userData }}
                    end
                    className={({ isActive }) =>
                      `flex items-center py-2 px-4 rounded-lg transition-all ${
                        isActive
                          ? "text-white bg-gradient-to-r from-blue-600 to-blue-400 shadow-md"
                          : "hover:bg-blue-50 text-blue-900"
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                </li>
              );
            }

            if (item.type === "dropdown") {
              const isOpen =
                openDropdowns[item.name.toLowerCase().replace(" ", "_")] ||
                false;

              return (
                <li key={item.name} className="px-4 my-1">
                  <button
                    onClick={() =>
                      toggleDropdown(item.name.toLowerCase().replace(" ", "_"))
                    }
                    className={`flex items-center w-full py-2 px-4 rounded-lg transition-all ${
                      isOpen
                        ? "text-blue-600"
                        : "text-blue-900 hover:bg-blue-50"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                    {isOpen ? (
                      <ExpandLess className="ml-auto text-blue-500" />
                    ) : (
                      <ExpandMore className="ml-auto text-blue-500" />
                    )}
                  </button>

                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out rounded-lg ${
                      isOpen ? "max-h-96 mt-1" : "max-h-0"
                    }`}
                  >
                    {item.items.map((subItem) => (
                      <li key={subItem.name} className="ml-6 my-1">
                        <NavLink
                          to={subItem.to}
                          state={{ data: userData }}
                          className={({ isActive }) =>
                            `block py-2 px-4 rounded-lg transition-all ${
                              isActive
                                ? "text-white bg-gradient-to-r from-blue-500 to-blue-400 shadow-md"
                                : "hover:bg-blue-50 text-blue-900"
                            }`
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <button
          className="w-full py-3 rounded-xl flex items-center justify-center transition-all duration-300
                    bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                    text-white shadow-md hover:shadow-lg"
          onClick={() => navigate("/logout")}
        >
          <Logout className="mr-2" />
          Logout
        </button>
      </div>

      <footer className="p-4 text-xs text-blue-400 text-center border-t border-gray-200">
        <p className="mb-1">&copy; {new Date().getFullYear()} DROPship</p>
        <p>All rights reserved</p>
        <p className="mt-2 text-blue-300">Developed by Sajana Wickramarathna</p>
      </footer>
    </div>
  );
}
