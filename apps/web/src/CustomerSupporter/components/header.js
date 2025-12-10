import React from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import NotifyIcon from '@mui/icons-material/NotificationsOutlined';
import UserIcon from "@mui/icons-material/AccountCircleOutlined"

export default function Header() {
  return (
    <div className="w-full p-4 h-full bg-white rounded-2xl shadow-md flex justify-between">
      <div className="flex items-center rounded-lg p-2 w-6/12">
        <SearchIcon className="text-gray-400 mr-2"  fontSize="medium"/>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent outline-none text-sm text-gray-700"
        />
      </div>
      <div className="px-4">
        <Link to="/notifications" className="text-gray-400 hover:text-gray-700 px-2">
            <NotifyIcon fontSize="medium"/>
        </Link>
        <Link to="/account" className="text-gray-800">
            <UserIcon fontSize="medium"/>
        </Link>
        
      </div>
    </div>
  );
}
