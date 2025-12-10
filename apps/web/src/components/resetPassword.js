import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import Nav from "./navigation";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password < 8) {
      setError("Passwords must be more than 8 characters!");
      return;
    }

    try {
      const response = await api.post(`/users/reset-password/${token}`, {
        password,
      });
      setSuccess(response.data.message);
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      navigate('/signin');
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      Swal.fire({
        title: "Success!",
        text: err.response?.data?.message,
        icon: "success",
      });
      navigate('/signin');
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Nav />
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Reset Password</h2>

        {error && <p className="text-center text-red-500">{error}</p>}
        {success && <p className="text-center text-green-500">{success}</p>}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
