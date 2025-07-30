import React, { useState, useEffect } from 'react';
import Footer from "../components/footer";
import { Link } from 'react-router-dom';
import Nav from '../components/navigation';
import { 
  CircularProgress,
  Alert,
  IconButton,
  Badge
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ClearAll as ClearAllIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { api } from "../api";


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token")); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [userData, setUserData] = useState(null);

  // Fetch user data
  useEffect(() => {
    if (!token) return;

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
          window.location.href = "/logout";
        } else {
          setError("Failed to load notifications");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch notifications
  useEffect(() => {
    if (!userData) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/notifications/user/${userData.user_id}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
              <NotificationsIcon className="text-gray-300 text-5xl mb-4 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Notifications
              </h2>
              <p className="text-gray-600">
                You don't have any notifications yet
              </p>
            </div>
          </div>
      }
    };

    fetchNotifications();
  }, [userData]);

  // Clear all notifications
  const handleClearNotifications = async () => {
    try {
      await api.delete(`/notifications/user/${userData.user_id}`);
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError('Error clearing notifications');
    }
  };

  // Delete single notification
  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Error deleting notification');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Nav />
      
      <div className="pt-24 px-4 pb-10">
        {!token ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
              <NotificationsIcon className="text-gray-400 text-5xl mb-4 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Notifications Unavailable
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in to view your notifications
              </p>
              <Link 
                to="/signin" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <CircularProgress size={60} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Alert severity="error" className="max-w-md">
              {error}
            </Alert>
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
              <NotificationsIcon className="text-gray-300 text-5xl mb-4 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Notifications
              </h2>
              <p className="text-gray-600">
                You don't have any notifications yet
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Badge 
                  badgeContent={notifications.filter(n => !n.read).length} 
                  color="error" 
                  className="mr-3"
                >
                  <NotificationsIcon fontSize="large" />
                </Badge>
                Notifications
              </h1>
              
              <button
                onClick={handleClearNotifications}
                className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <ClearAllIcon className="mr-2" />
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`flex items-start p-5 rounded-xl shadow-sm border-l-4 ${
                    notification.read 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-lg ${
                        notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span>
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}