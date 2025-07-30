import { api } from "../../api";
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
    userData.profilePic ? `${api.defaults.baseURL.replace('/api', '')}${userData.profilePic}` : ""
  );
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passErrorMessage, setPassErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("account"); // 'account' or 'password'
  const [isLoading, setIsLoading] = useState(false);

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
        if (file.size > 2 * 1024 * 1024) {
          setErrorMessage("Image size should be less than 2MB");
          return;
        }
        setProfileImg(file);
        setProfileImgPreview(URL.createObjectURL(file));
        setErrorMessage("");
      } else {
        setErrorMessage("Please select a valid image file.");
      }
    } else {
      setProfileImg(null);
      setProfileImgPreview(
        userData.profilePic ? `${api.defaults.baseURL.replace('/api', '')}${userData.profilePic}` : ""
      );
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMsg("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("firstName", updateData.firstName);
      formDataToSend.append("lastName", updateData.lastName);
      formDataToSend.append("email", updateData.email);
      formDataToSend.append("phone", updateData.phone);
      formDataToSend.append("address", updateData.address);
      if (profileImg) {
        formDataToSend.append("profile_image", profileImg);
      }
      await api.put(
        "/customers/updatecustomer",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMsg("Account updated successfully");
      setTimeout(() => {
        setSuccessMsg("");
        window.location.href = "/customer-dashboard/";
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMsg("");

    try {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setPassErrorMessage("Passwords do not match!");
        return;
      }
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("password", passwords.newPassword);
      formDataToSend.append("confirmPassword", passwords.confirmPassword);
      await api.put(
        "/customers/updatepassword",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMsg("Password updated successfully. Please login again.");
      setTimeout(() => {
        setSuccessMsg("");
        window.location.href = "/logout";
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      passwords.newPassword &&
      passwords.currentPassword === passwords.newPassword
    ) {
      setPassErrorMessage(
        "New password cannot be the same as the current password!"
      );
    } else if (
      passwords.confirmPassword &&
      passwords.newPassword !== passwords.confirmPassword
    ) {
      setPassErrorMessage("New Password & Confirm Password do not match!");
    } else {
      setPassErrorMessage("");
    }
  }, [passwords]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-blue-100">Manage your account details and security</p>
        </div>

        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === "account" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("account")}
          >
            Account Details
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "password" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMsg}
            </div>
          )}

          {activeTab === "account" ? (
            <form onSubmit={handleAccountSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={updateData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={updateData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updateData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={updateData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={updateData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {profileImgPreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={profileImgPreview}
                          alt="Profile Preview"
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                        onChange={handleProfileImgChange}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF (Max. 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Account"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Current Password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New Password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm New Password"
                    required
                  />
                  {passErrorMessage && (
                    <p className="mt-1 text-sm text-red-600">
                      {passErrorMessage}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading || !!passErrorMessage}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update Password"
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