import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logout, Copyright} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import OrdersIcon from "@mui/icons-material/ShoppingBag";
import NotificationIcon from '@mui/icons-material/Notifications';
import TicketIcon from '@mui/icons-material/ListAltOutlined';
import PlusOneIcon  from "@mui/icons-material/PlusOneOutlined";
import SettingIcon from "@mui/icons-material/SettingsOutlined";
import axios from "axios";

export default function Sidebar() {

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); 
  const [isLoading, setIsLoading] = useState(true); 

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, { state: { data: userData } });
  };

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

      <div className="w-full h-32 p-4 flex justify-center items-center">
        <img src={`http://localhost:3001${userData.profilePic}`} alt="Profile" className="h-28 w-28 rounded-md" />
      </div>
      <div className="px-3 py-1 text-xl font-bold text-center uppercase">{userData.firstName} {userData.lastName}</div>
      <hr className="mb-5"/>

      <nav className="flex-1">
      <ul>
        {[
          { name: "Dashboard", path: "/customer-dashboard", icon: <DashboardIcon />, exact: true },
          { name: "Profile", path: "/customer-dashboard/profile",  icon: <AccountCircleIcon /> },
          { name: "Cart", path: "/customer-dashboard/cart", icon: <ShoppingCartIcon /> },
          { name: "Orders", path: "/customer-dashboard/orders", icon: <OrdersIcon /> },
          { name: "Notifications", path: "/customer-dashboard/notifications", icon: <NotificationIcon /> },
          { name: "Tickets", path: "/customer-dashboard/tickets", icon: <TicketIcon /> },
          { name: "Add Ticket", path: "/customer-dashboard/addticket", icon: <PlusOneIcon /> },
        ].map((item) => (
          <li key={item.name} className="py-1 px-4 text-md">
          <button
            onClick={() => handleNavigation(item.path)} 
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 transition-all"
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </button>
        </li>
        ))}

          <hr className="my-4"/>

          <li className="py-2 px-4 text-md">
          <button
            onClick={() => handleNavigation("/customer-dashboard/settings")} 
            className="block w-full text-left py-2 px-4 rounded-md hover:bg-gray-100 transition-all"
          >
            <span className="mr-2"><SettingIcon/></span>
            Settings
          </button>
          </li>
        </ul>
      </nav>

      <div className="py-2 px-4 my-2">
        <button className="bg-[#ff4c51] text-white w-full py-3 rounded-xl hover:bg-[#ff0000] flex items-center justify-center transition-all duration-300"
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
