import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Edit, Delete } from '@mui/icons-material';
import { api } from "../../api";

export default function Profile() {
  const location = useLocation();
  const userData = location.state?.data;
  const navigate = useNavigate();

  const handleDeleteAccount = async() => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!confirmDelete) return;
      
      const deleteUser = await api.delete(`/customers/delete?id=${userData.user_id}`);
      alert(deleteUser?.data?.message || "Account deleted successfully");
      navigate('/logout');
    } catch(error) {
      alert('Something went wrong');
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-3xl p-6 w-full max-w-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-gray-200 overflow-hidden shadow-lg mb-4">
            <img
              src={`${api.defaults.baseURL.replace('/api', '')}${userData.profilePic}`}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-gray-500 mt-1">{userData.email}</p>
        </div>

        {/* User Info */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-gray-800 font-medium">{userData.email}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 font-medium">Phone</p>
              <p className="text-gray-800 font-medium">{userData.phone || "Not provided"}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
              <p className="text-sm text-gray-500 font-medium">Address</p>
              <p className="text-gray-800 font-medium">{userData.address || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to={'/customer-dashboard/settings'} 
            state={{data: userData}}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <Edit className="mr-2" />
            <span>Edit Profile</span>
          </Link>
          
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <Delete className="mr-2" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}