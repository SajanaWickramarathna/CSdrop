import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Nav from "../components/navigation";
import Swal from "sweetalert2";
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';
import { api } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        '/users/forgotpassword', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      Swal.fire({
        title: "Email Sent!",
        text: response.data.message || "Password reset link has been sent to your email.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
      setEmailSent(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         "Failed to send reset email. Please try again.";
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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="text-blue-100 mt-1">
              {emailSent ? "Check your email for instructions" : "Enter your email to receive a reset link"}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!emailSent ? (
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
                      placeholder="your@email.com"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <RingLoader color="#ffffff" size={20} className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiArrowRight className="mr-2" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
                  We've sent password reset instructions to your email.
                </div>
                <button
                  onClick={() => navigate('/signin')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {/* Sign In Link */}
            {!emailSent && (
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <button 
                    onClick={() => navigate('/signin')}
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}