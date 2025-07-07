import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        } else {
          setError("API Error: " + (error.response?.status || "Unknown"));
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
        const response = await axios.get(`http://localhost:3001/api/notifications/user/${userData.user_id}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);      
      }
    };

    fetchNotifications();
  }, [userData]);

  // Clear all notifications
  const handleClearNotifications = () => {
    axios.delete(`http://localhost:3001/api/notifications/user/${userData.user_id}`)
      .then(() => {
        setNotifications([]);
      })
      .catch(() => {
        setError('Error clearing notifications');
      });
  };

  // Delete single notification
  const handleDeleteNotification = (id) => {
    axios.delete(`http://localhost:3001/api/notifications/${id}`)
      .then(() => {
        setNotifications((prev) => prev.filter((notification) => notification._id !== id));
      })
      .catch(() => {
        setError('Error deleting notification');
      });
  };

  // Render logic
  if (!token) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-center text-gray-500 text-lg font-semibold mt-4">
          Please log in to view your notifications
        </p>
        <Link to="/signin" className="mt-6 px-8 py-3 bg-custom-gradient text-white rounded-lg text-center">
          Log in
        </Link>
      </div>
    );
  }

  if (isLoading) return <div>Loading notifications...</div>;
  if (error) return <p>{error}</p>;
  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-center text-gray-500 text-lg font-semibold mt-4">
          You have no notifications
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Notifications</h2>
      <div className="flex flex-col space-y-6">
        {notifications.map(notification => (
          <div key={notification._id} className="flex items-center bg-white p-4 rounded-xl shadow-md">
            <div className="flex-1">
              <p className="text-lg text-gray-900">{notification.message}</p>
              <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
            <button
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => handleDeleteNotification(notification._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="mt-auto flex justify-between items-center">
        <button
          className="px-6 py-3 bg-red-500 text-white rounded-lg"
          onClick={handleClearNotifications}
         
        >
          Clear All Notifications
        </button>
      </div>
    </div>
  );
}