import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function Profile() {
  const location = useLocation();
  const userData = location.state?.data;
  const navigate = useNavigate();

  const handleDeleteAccount = async() =>{
    try{
      const deleteUser = await axios.delete(`http://localhost:3001/api/customers/delete?id=${userData.user_id}`);
      alert(deleteUser?.data?.message || "Customer Deleted");
      navigate('/logout');
    }catch(error){
      alert('Something went wrong');
    }
  }

  return (
    <div className="min-h-max w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className={`w-36 h-36 rounded-full border-8
           ${userData.user_level === 'Silver' ? 'border-gray-400' : 
            userData.user_level === 'Gold' ? 'border-yellow-500' : 
            userData.user_level === 'Platinum' ? 'border-blue-500' :
            'border-red-950'} overflow-hidden shadow-md`}>
            <img
              src={`http://localhost:3001${userData.profilePic}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-gray-400 -mt-1">{userData.email}</p>
        </div>

        {/* User Info */}
        <div className="mt-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <p className="text-gray-700 py-2"><strong>Email:</strong> {userData.email}</p>
            <p className="text-gray-700 py-2"><strong>Phone:</strong> {userData.phone || "N/A"}</p>
            <p className="text-gray-700 py-2"><strong>Address:</strong> {userData.address || "Not provided"}</p>
            
            <p className="text-gray-700 py-2"><strong>Points:</strong> {userData.points}</p>
            <p className="text-gray-700 py-2"><strong>Level:</strong> {userData.user_level}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center">
          <Link to={'/customer-dashboard/settings'} state={{data:userData}}>
            <button className="px-4 py-2 mx-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
              <Edit/>
              Edit Profile
            </button>
          </Link>
          <button className="px-4 py-2 mx-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          onClick={handleDeleteAccount}>
            <Delete/>
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  )
}
