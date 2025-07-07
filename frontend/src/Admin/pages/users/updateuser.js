import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Updateuser() {
  const location = useLocation();
  const userData = location.state?.userData || {};
  const userId = userData.user_id;

  const [updateData, setUpdateData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
  });

  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(
    userData.profilePic ? `http://localhost:3001${userData.profilePic}` : ""
  );
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];

    if (file) {
        if (file.type.startsWith("image/")) {
            setProfileImg(file);
            setProfileImgPreview(URL.createObjectURL(file));
            setErrorMessage("");
        } else {
            toast.error("Please select a valid image file.");
        }
    } else {
        // If no new image is selected, retaiZn the current profile picture
        setProfileImg(null);
        setProfileImgPreview(userData.profilePic ? `http://localhost:3001${userData.profilePic}` : "");
    }
};

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("firstName", updateData.firstName);
      formDataToSend.append("lastName", updateData.lastName);
      formDataToSend.append("email", updateData.email);
      formDataToSend.append("phone", updateData.phone);
      formDataToSend.append("address", updateData.address);
      if(profileImg){
        formDataToSend.append("profile_image", profileImg);
      }
      console.log(userId);
      await axios.put("http://localhost:3001/api/users/updateuser", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      Swal.fire({
        title: "Success",
        text: 'Account updated successfully!',
        icon:'success'
      });
      
    }catch (error){
      toast.error("Failed to update account");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
              <ToastContainer position="top-center" autoClose={3000} />

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
        {successMsg && <p className="text-green-500 mb-3">{successMsg}</p>}

        {/* Account Details Update Form */}
        <form onSubmit={handleAccountSubmit} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Edit User Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="firstName" value={updateData.firstName} onChange={handleInputChange} className="border p-2 rounded w-full" placeholder="First Name" required />
            <input type="text" name="lastName" value={updateData.lastName} onChange={handleInputChange} className="border p-2 rounded w-full" placeholder="Last Name" required />
          </div>
          <input type="email" name="email" value={updateData.email} onChange={handleInputChange} className="border p-2 rounded w-full mt-3" placeholder="Email" required />
          <input type="text" name="phone" value={updateData.phone} onChange={handleInputChange} className="border p-2 rounded w-full mt-3" placeholder="Phone" />
          <input type="text" name="address" value={updateData.address} onChange={handleInputChange} className="border p-2 rounded w-full mt-3" placeholder="Address" />

          {/* Profile Image Upload */}
          {profileImgPreview && (
            <div className="mt-3">
              <img src={profileImgPreview} alt="Profile Preview" className="rounded-md h-24 w-24 object-cover" />
            </div>
          )}
          <div className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
            <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded-md" accept="image/*" onChange={handleProfileImgChange} />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600 transition">Update Account</button>
        </form>
        
      </div>
    </div>
  );
}
