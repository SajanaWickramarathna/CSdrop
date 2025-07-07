import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/supportlogo.png";
import { Logout, Copyright, ExpandMore, ExpandLess  } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import FormIcon from '@mui/icons-material/FormatAlignJustify';
import TicketsIcon from '@mui/icons-material/Quiz';
import AnalyticsIcon from "@mui/icons-material/AnalyticsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import axios from "axios";



export default function Sidebar() {

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
          <img src={Logo} alt="logo" className="w-44" />
      </div>
      <hr className="mb-5"/>
      <nav className="flex-1">
        <ul>
          {/* Dashboard Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/support-dashboard"
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

          {/* Forms Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/support-dashboard/forms"
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
                <FormIcon />
              </span>
              Contact Forms
            </NavLink>
          </li>

          {/* Tickets Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/support-dashboard/tickets"
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
                <TicketsIcon />
              </span>
              Tickets
            </NavLink>
          </li>



          {/* Analytics Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/support-dashboard/analytics"
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
                <AnalyticsIcon />
              </span>
              Analytics
            </NavLink>
          </li>

          <hr className="m-5"/>

          {/* Setting Link*/  }
          <li className="py-2 px-4 text-md">
            <NavLink
              to="/support-dashboard/settings"
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
        onClick={() => { navigate('/logout')}} >
          <Logout className="mr-2" />
          Logout
        </button>
      </div>

        <footer className="py-3 text-sm text-center">
            <div>
                2025 <Copyright aria-label="Copyright" /> All Rights Reserved.
            </div>
            <div>S JAY Web Solutions (Pvt) Ltd.</div>
        </footer>
    </div>
  );
}
