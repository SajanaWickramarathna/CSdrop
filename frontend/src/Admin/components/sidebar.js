import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/adminlogo.png";
import { Logout, Copyright, ExpandMore, ExpandLess  } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PromotionIcon from "@mui/icons-material/DiscountOutlined";
import axios from "axios";



export default function Sidebar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  }

  const [isDropdown1Open, setDropdown1Open] = useState(false);
  const toggleDropdown1 = () => {
    setDropdown1Open(!isDropdown1Open);
  }

    const [isDropdown2Open, setDropdown2Open] = useState(false);
  const toggleDropdown2 = () => {
    setDropdown2Open(!isDropdown2Open);
  }

  {/* fetching user data */}

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

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      console.warn("No token found, skipping API call.");
      setIsLoading(false);
    }
  }, [token]); 

  
  if (isLoading) {
    return <div>Loading user data...</div>;
  }


  
  return (
    <div className="min-h-screen w-64 bg-white text-blue-950 flex flex-col">

      <div className="w-full h-16 p-4 ">
          <img src={Logo} alt="logo" className="w-32" />
      </div>
      <hr className="mb-5"/>
      <nav className="flex-1">
        <ul>
          {/* Dashboard Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/admin-dashboard"
              state={{data: userData}}
              end
              className={({ isActive }) =>
                `block py-[5px] px-4 rounded-md ${
                  isActive
                    ? "text-white bg-custom-gradient "
                    : "hover:bg-gray-100 transition-all"
                }`
              }
            >
              <span className="mr-2">
                <DashboardIcon />
              </span>
              Dashboard
            </NavLink>
          </li>

          {/* Manage User Link*/  }
          <li className="py-2 px-4 text-md">
            <button
              onClick={toggleDropdown}
              className="flex items-center w-full py-2 px-4 rounded-md hover:bg-gray-100 transition-all"
            >
              <PeopleIcon className="mr-2" />
              Manage Users
              {isDropdownOpen ? (
                <ExpandLess className="ml-auto" />
              ) : (
                <ExpandMore className="ml-auto" />
              )}
            </button>

            <ul
              className={`overflow-hidden transition-max-height duration-500 ease-in-out rounded-md shadow-md ${
                isDropdownOpen ? "max-h-44" : "max-h-0"
              }`}
            >
              <li className="text-md ">
                <NavLink
                  to="/admin-dashboard/users/customers"
                  state={{data: userData}}
                  className={({ isActive }) =>
                    `block py-[5px] px-12 ${
                      isActive
                      ? "text-white bg-custom-gradient "
                      : "hover:bg-gray-100 transition-all"
                    }`
                  }
                >
                  Customers
                </NavLink>
              </li>
              <li className="text-md ">
                <NavLink
                  to="/admin-dashboard/users/supporters"
                  state={{data: userData}}
                  className={({ isActive }) =>
                    `block py-[5px] px-12 ${
                      isActive
                      ? "text-white bg-custom-gradient "
                      : "hover:bg-gray-100 transition-all"
                    }`
                  }
                >
                  Supporters
                </NavLink>
              </li>
             
              <li className="text-md ">
                <NavLink
                  to="/admin-dashboard/users/admins"
                  state={{data: userData}}
                  className={({ isActive }) =>
                    `block py-[5px] px-12 ${
                      isActive
                      ? "text-white bg-custom-gradient "
                      : "hover:bg-gray-100 transition-all"
                    }`
                  }
                >
                  Admins
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Inventory Link*/  }
          <li className="py-2 px-4 text-md">
            <button
              onClick={toggleDropdown1}
              className="flex items-center w-full py-[5px] px-4  hover:bg-gray-100 rounded-md transition-all"
            >
              <InventoryIcon className="mr-2" />
              Inventory
              {isDropdown1Open ? (
                <ExpandLess className="ml-auto" />
              ) : (
                <ExpandMore className="ml-auto" />
              )}
            </button>
            <ul
              className={`overflow-hidden transition-max-height duration-500 ease-in-out rounded-md shadow-md ${
                isDropdown1Open ? "max-h-40" : "max-h-0"
              }`}
            >
                <li className="text-md">
                  <NavLink
                    to="/admin-dashboard/addproduct"
                    state={{data: userData}}
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Add Product
                  </NavLink>
                </li>
                <li className="text-md">
                  <NavLink
                    to="/admin-dashboard/products"
                    state={{data: userData}}
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Products
                  </NavLink>
                </li>
                <li className="text-md">
                  <NavLink
                    to="/admin-dashboard/category"
                    state={{data: userData}}
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Categories
                  </NavLink>
                </li>
                <li className="text-md">
                  <NavLink
                    to="/admin-dashboard/brands"
                    state={{data: userData}}
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Brands
                  </NavLink>
                </li>
              </ul>
            
          </li>

          {/* Orders Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/admin-dashboard/orders/orders"
              state={{data: userData}}
              className={({ isActive }) =>
                `block py-[5px] px-4 rounded-md ${
                  isActive
                  ? "text-white bg-custom-gradient "
                  : "hover:bg-gray-100 transition-all"
                }`
              }
            >
              <span className="mr-2">
                <ShoppingCartIcon />
              </span>
              Orders
            </NavLink>
          </li>
          {/* Analytics Link*/  }
          <li className="py-2 px-4 text-md">
            <button
              onClick={toggleDropdown2}
              className="flex items-center w-full py-[5px] px-4  hover:bg-gray-100 rounded-md transition-all"
            >
              <InventoryIcon className="mr-2" />
              Analytics
              {isDropdown2Open ? (
                <ExpandLess className="ml-auto" />
              ) : (
                <ExpandMore className="ml-auto" />
              )}
            </button>
            <ul
              className={`overflow-hidden transition-max-height duration-500 ease-in-out rounded-md shadow-md ${
                isDropdown2Open ? "max-h-40" : "max-h-0"
              }`}
            >
                <li className="text-md">
                  <NavLink
                    to="/admin-dashboard/analytics/users"
                    state={{data: userData}}
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Users
                  </NavLink>
                </li>
                {/*<li className="text-md">
                  <NavLink
                    to="/admin-dashboard/analytics/products"
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Products
                  </NavLink>
                </li>*/}
                <li className="text-md">
                  <NavLink
                    to="/admin-dashboard/analytics/orders"
                    state={{data: userData}}
                    className={({ isActive }) =>
                      `block py-[5px] px-12 ${
                        isActive
                        ? "text-white bg-custom-gradient "
                        : "hover:bg-gray-100 transition-all"
                      }`
                    }
                  >
                    Orders
                  </NavLink>
                </li>
              </ul>
            
          </li>


          <hr className="m-5"/>

          {/* Setting Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/admin-dashboard/settings"
              state={{data: userData}}
              className={({ isActive }) =>
                `block py-[5px] px-4 rounded-md ${
                  isActive
                  ? "text-white bg-custom-gradient "
                  : "hover:bg-gray-100 transition-all"
                }`
              }
            >
              <span className="mr-2">
                <SettingsIcon />
              </span>
              Settings
            </NavLink>
          </li>
        </ul>

      </nav>


      <div className="py-2 px-4 my-2">
        <button className="bg-[#ff4c51] text-white w-full py-3 rounded-xl hover:bg-[#ff0000]  flex items-center justify-center transition-all duration-300"
        onClick={() => { navigate('/logout')}}  >
          <Logout className="mr-2" />
          Logout
        </button>
      </div>

        <footer className="mt-6 text-xs text-blue-400 text-center">
          <p className="mb-1">&copy; {new Date().getFullYear()} DROPship</p>
          <p>All rights reserved</p>
          <p className="mt-2 text-blue-300">Developed by Sajana Wickramarathna</p>
        </footer>
    </div>
  );
}
