import React, { useState } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddUser() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  let registerText;

  if (role === 'customer') {
    registerText = 'new customer';
  } else if (role === 'admin') {
    registerText = 'new admin';
  } else if (role === 'deliver') {
    registerText = 'new deliver';
  } else if (role === 'manager') {
    registerText = 'new inventory manager';
  } else {
    registerText = 'new customer supporter';
  }

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    cpassword: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.cpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.fname);
      formDataToSend.append("lastName", formData.lname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.cpassword);
      if (image) {
        formDataToSend.append("profile_image", image);
      }

      let response;
      if(role === 'customer'){
        response = await axios.post("http://localhost:3001/api/customers/signup", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }else if(role === 'supporter'){
        response = await axios.post("http://localhost:3001/api/supporters/signup", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }else if(role === 'manager') {
        response = await axios.post("http://localhost:3001/api/managers/signup", formDataToSend,{
          headers: { "Content-Type": "multipart/form-data" },
        });
      }else if (role === 'deliver') {
        response = await axios.post("http://localhost:3001/api/delivers/signup", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }else if (role === 'admin'){
        response = await axios.post("http://localhost:3001/api/admins/signup", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }else{
        setError("Invalid role");
      }
      

      if (response.status === 200) {
        setSuccess(response?.data?.message);
        Swal.fire({
          title: "Success",
          text: response?.data?.message,
          icon:'success'
        });
        setError("");
        setTimeout(() => {
          window.location.href = "/admin-dashboard/";
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }


  };
  return (
    <div className="flex flex-row px-32 py-2 mt-6" style={{ height: '100%' }}>
              <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex flex-row bg-white min-h-full w-full border-2 rounded-3xl shadow-lg">
        
        {/* Left Hero Section */}
        <div className="p-6 flex flex-col items-center w-full">

          <h1 className="font-bold text-3xl uppercase">Register a {registerText}</h1>

          {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2 font-bold">{success} & Redirecting....</p>}

          <form onSubmit={handleSubmit} className="flex flex-col w-full  space-y-4" encType="multipart/form-data">
            <div className="container space-y-4">
                {/* Row for Name Inputs */}
                <div className="row flex flex-col lg:flex-row lg:space-x-4 m-3">
                    <div className="col w-full lg:w-1/2">
                        <input
                        type="text"
                        placeholder="First Name"
                        name='fname'
                        className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={formData.fname}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="col w-full lg:w-1/2 mt-4 lg:mt-0">
                        <input
                        type="text"
                        placeholder="Last Name"
                        name='lname'
                        className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={formData.lname}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>

                {/* Row for Address Inputs */}
                <div className="row flex flex-col lg:flex-row lg:space-x-4 m-3">
                    <div className="col w-full lg:w-full">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          className="p-2 w-full bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                          required
                        />
                    </div>
                </div>

                {/* Row for Contact Inputs */}
                <div className="row flex flex-col lg:flex-row lg:space-x-4 m-3">
                    <div className="col w-full lg:w-1/2">
                        <input
                        type="email"
                        placeholder="Primary Email"
                        name='email'
                        className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="col w-full lg:w-1/2 mt-4 lg:mt-0">
                        <input
                        type="text"
                        placeholder="Phone Number"
                        name='phone'
                        pattern="^\+?[1-9]\d{1,11}$"
                        title="Phone number must be in the format +94712345678"
                        value={formData.phone}
                        onChange={handleChange}
                        className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        required
                        />
                    </div>
                </div>

                {/* Row for Address Inputs */}
                <div className="row flex flex-col lg:flex-row lg:space-x-4 m-3">
                    <div className="col w-full lg:w-full">
                        <input
                        type="text"
                        placeholder="Address"
                        name='address'
                        className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>

                {/* Row for Password Inputs */}
                <div className="row flex flex-col space-y-4 m-3">
                <input
                    type="password"
                    placeholder="Password"
                    name='password'
                    className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name='cpassword'
                    className="p-3 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    value={formData.cpassword}
                    onChange={handleChange}
                    required
                />
                </div>
            </div>

            {/* Register Button */}
            <button
                type="submit"
                className="bg-purple-600 text-white p-3 rounded font-bold hover:bg-purple-950 transition-all duration-300"
            >
                Register
            </button>
            </form>


         
        </div>

        
      </div>
    </div>
  );
}
