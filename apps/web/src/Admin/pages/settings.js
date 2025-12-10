import { api } from "../../api";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    userData.profilePic ? `${api.defaults.baseURL.replace('/api', '')}${userData.profilePic}` : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    
    // Calculate password strength when new password changes
    if (name === 'newPassword') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      if (file.type.startsWith("image/")) {
        setProfileImg(file);
        setProfileImgPreview(URL.createObjectURL(file));
      } else {
        toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      }
    } else {
      setProfileImg(null);
      setProfileImgPreview(userData.profilePic ? `${api.defaults.baseURL.replace('/api', '')}${userData.profilePic}` : "");
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      await api.put("/admins/updateadmin", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      Swal.fire({
        title: "Success!",
        text: "Account updated successfully!",
        icon: "success",
        confirmButtonColor: '#4f46e5',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update account");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (passwords.newPassword !== passwords.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      
      if (passwords.currentPassword === passwords.newPassword) {
        toast.error("New password must be different from current password");
        return;
      }
      
      if (passwordStrength < 3) {
        toast.error("Password is too weak. Please use a stronger password.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("password", passwords.newPassword);
      formDataToSend.append("confirmPassword", passwords.confirmPassword);
      
      await api.put("/admins/updatepassword", formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      Swal.fire({
        title: "Success!",
        text: "Password updated successfully! You'll be logged out to apply changes.",
        icon: "success",
        confirmButtonColor: '#4f46e5',
      }).then(() => {
        window.location.href = "/logout";
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-4xl">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="fas fa-user-circle mr-2"></i>
            Account Details
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="fas fa-lock mr-2"></i>
            Password
          </button>
        </div>
        
        <div className="p-6">
          {/* Account Details Tab */}
          {activeTab === 'account' && (
            <form onSubmit={handleAccountSubmit}>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={updateData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={updateData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updateData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={updateData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={updateData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Address"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      {profileImgPreview && (
                        <div className="relative">
                          <img 
                            src={profileImgPreview} 
                            alt="Profile Preview" 
                            className="rounded-full h-16 w-16 object-cover border-2 border-gray-200"
                          />
                          {profileImg && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 text-xs">
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                            <i className="fas fa-upload mr-2"></i>
                            {profileImg ? 'Change Image' : 'Upload Image'}
                          </span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleProfileImgChange} 
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Current Password"
                      required
                    />
                    <i className="fas fa-lock absolute right-3 top-3 text-gray-400"></i>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="New Password"
                      required
                    />
                    <i className="fas fa-key absolute right-3 top-3 text-gray-400"></i>
                  </div>
                  {passwords.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getPasswordStrengthColor()}`} 
                            style={{ width: `${passwordStrength * 25}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                      </div>
                      <ul className="text-xs text-gray-500 list-disc pl-5">
                        <li>At least 8 characters</li>
                        <li>Contains uppercase letter</li>
                        <li>Contains number</li>
                        <li>Contains special character</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Confirm New Password"
                      required
                    />
                    <i className="fas fa-redo absolute right-3 top-3 text-gray-400"></i>
                  </div>
                  {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || passwords.newPassword !== passwords.confirmPassword || passwordStrength < 3}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock mr-2"></i>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}