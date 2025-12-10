import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Nav from "../components/navigation";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';
import { api } from "../api";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post('/users/signin', {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.setItem('token', response.data.token);
      Swal.fire({
        title: "Success!",
        text: "You have successfully logged in!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Dashboard redirection based on role
      const dashboardPaths = {
        'admin': '/admin-dashboard',
        'customer': '/customer-dashboard',
        'inventory_manager': '/inventory-dashboard',
        'customer_supporter': '/support-dashboard',
        'deliver': '/deliver-dashboard'
      };

      navigate(dashboardPaths[response.data.role] || '/');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Auth Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-purple-100 mt-1">Sign in to access your account</p>
          </div>

          {/* Auth Form */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <a 
                    href="/forgotpassword" 
                    className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <RingLoader color="#ffffff" size={20} className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="font-medium text-purple-600 hover:text-purple-500 hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}