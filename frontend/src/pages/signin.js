import React, { useState } from 'react';
import axios from 'axios';
import Vector from '../assets/login image.png';
import Logo from '../assets/logo 4.png';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/navigation";
import Swal from "sweetalert2";



export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = {
        email: formData.email,
        password: formData.password,
      }

      const response = await axios.post('http://localhost:3001/api/users/signin', formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.setItem('token', response.data.token);
      Swal.fire({
        title: "Success!",
        text: "You Successfully Logged in to Your Account!",
        icon: "success",
      });
      setLoading(false);

      switch(response.data.role){
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'customer':
          navigate('/customer-dashboard');
          break;
        case 'inventory_manager':
          navigate('/inventory-dashboard');
          break;
        case 'customer_supporter':
          navigate('/support-dashboard');
          break;
        case 'deliver':
          navigate('/deliver-dashboard');
          break;
        default:
          navigate('/');
      }
      
    }catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "An error occurred!",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Nav/>
      <div className="flex flex-row bg-gray-100 px-32 py-32" >
        <div className="flex flex-row bg-white min-h-full w-full border-2 rounded-3xl shadow-lg">
          
          {/* Left Hero Section */}
          <div className="p-6 w-1/2 flex flex-col items-center justify-center bg-purple-800 h-full border-2 rounded-l-3xl">
            <h1 className="text-5xl mt-4 text-white font-bold leading-tight text-center">
              Simplify management with a <span className="text-purple-950 decoration-black">user</span> dashboard
            </h1>
            <p className="text-white mt-1 text-sm text-center">
            Weaving success begins with seamless management. Empower your textile business with a user-friendly dashboard."
            </p>
            <img src={Vector} alt="Dashboard visualization" className="w-full h-64 mt-1 object-contain" />
          </div>

          {/* Right Hero Section */}
          <div className="p-10 flex-1 flex flex-col items-center w-full">
            <img src={Logo} alt="Company Logo" className="w-32 mb-4" />

            <h1 className="font-bold text-3xl">Welcome Back</h1>
            <p className="text-gray-500 text-sm ">Please login to your account</p>

            {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-2 font-bold">{success}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col w-full mt-6 space-y-4">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Email"
                name='email'
                className="p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* Password Input */}
              <input
                type="password"
                placeholder="Password"
                name='password'
                className="p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              {/* Forgot Password */}
              <p className="text-gray-400 text-sm text-right">
                <a href="/forgotpassword" className="hover:text-purple-600 transition">Forgot password?</a>
              </p>

              {/* Login Button */}
              <button
                type="submit"
                className="bg-purple-600 text-white p-3 rounded font-bold hover:bg-purple-950 transition-all duration-300"
              >
                Login
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-xs text-gray-400 mt-4">
              Don't have an account?{' '}
              <a href="/signup" className="text-purple-700 font-bold hover:underline">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
