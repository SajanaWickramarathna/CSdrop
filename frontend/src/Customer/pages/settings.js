import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Settings() {
  const location = useLocation();
  const userData = location.state?.data || {};

  const userId = userData.user_id;

  const [updateData, setUpdateData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(
    userData.profilePic ? `http://localhost:3001${userData.profilePic}` : ""
  );
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passErrorMessage, setPassErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];

    if (file) {
        if (file.type.startsWith("image/")) {
            setProfileImg(file);
            setProfileImgPreview(URL.createObjectURL(file));
            setErrorMessage("");
        } else {
            setErrorMessage("Please select a valid image file.");
        }
    } else {
        // If no new image is selected, retaiZn the current profile picture
        setProfileImg(null);
        setProfileImgPreview(userData.profilePic ? `http://localhost:3001${userData.profilePic}` : "");
    }
};

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    console.log(userId)

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
      await axios.put("http://localhost:3001/api/customers/updatecustomer", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setSuccessMsg("Account updated successfully");
      setTimeout(() => {
        setSuccessMsg("");
        window.location.href="/customer-dashboard/";
      }, 3000);
      
    }catch (error){
      setErrorMessage("Failed to update account 2");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try{
      if (passwords.newPassword !== passwords.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
      }
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("password", passwords.newPassword);
      formDataToSend.append("confirmPassword", passwords.confirmPassword);
      await axios.put("http://localhost:3001/api/customers/updatepassword", formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setSuccessMsg("Password updated successfully");
      setTimeout(() => {
        setSuccessMsg("");
        window.location.href="/logout";
      }, 3000);
    }catch (error){
      setErrorMessage("Failed to update password");
    }
    
  };

  useEffect(() => {
    if (passwords.newPassword && passwords.currentPassword === passwords.newPassword) {
      setPassErrorMessage("New password cannot be the same as the current password!");
    } else if (passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword) {
      setPassErrorMessage("New Password & Confirm Password do not match!");
    } else {
      setPassErrorMessage("");
    }
  }, [passwords]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
        {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
        {successMsg && <p className="text-green-500 mb-3">{successMsg}</p>}

        {/* Account Details Update Form */}
        <form onSubmit={handleAccountSubmit} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Edit Account Details</h3>
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

        <hr className="my-6" />

        {/* Update Password Form */}
        {passErrorMessage && <p className="text-red-500 mb-3">{passErrorMessage}</p>}
        <form onSubmit={handlePasswordSubmit}>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Update Password</h3>
          <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="border p-2 rounded w-full" placeholder="Current Password" required />
          <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="border p-2 rounded w-full mt-3" placeholder="New Password" required />
          <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="border p-2 rounded w-full mt-3" placeholder="Confirm New Password" required />
          <button type="submit" className="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-600 transition">Update Password</button>
        </form>
      </div>
    </div>
  );
}
