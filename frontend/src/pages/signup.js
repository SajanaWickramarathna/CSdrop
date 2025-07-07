import React, { useState } from 'react';
import axios from "axios";
import Vector from '../assets/login image.png';
import Logo from '../assets/logo 4.png';
import Nav from "../components/navigation";
import Swal from 'sweetalert2';


export default function SignUp() {
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
      setError("Passwords do not match!");
      return;
    }

    if(formData.password.length < 8){
      setError("Password must more than 8 characters.");
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

      const response = await axios.post("http://localhost:3001/api/customers/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setSuccess("Registration successful! Redirecting...");
        Swal.fire({
          title: "Success!",
          text: "You Successfully Registered a New Account! Activation Link Sent to Email",
          icon: "success",
        });
        setError("");
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
    <div className="flex flex-row bg-gray-100 px-32 py-32" style={{ height: '100%' }}>
      <div className="flex flex-row bg-white min-h-full w-full border-2 rounded-3xl shadow-lg">
        
        {/* Left Hero Section */}
        <div className="p-6 flex flex-col items-center w-1/2">
          <img src={Logo} alt="Company Logo" className="w-32 mb-4" />

          <h1 className="font-bold text-3xl">Welcome to KHB Associates</h1>
          <p className="text-gray-500 text-sm ">Please register for login to your account</p>

          {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2 font-bold">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col w-full mt-6 space-y-4" encType="multipart/form-data">
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
                        pattern="^0\d{9}$"
                        title='Enter valid phone number'
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


          {/* Signup Link */}
          <p className="text-xs text-gray-400 mt-4">
           Already have an account?{' '}
            <a href="/signin" className="text-purple-700 font-bold hover:underline">
              Signin
            </a>
          </p>
        </div>

        {/* Right Hero Section */}
        <div className="p-6 w-full flex-1 flex flex-col items-center justify-center bg-purple-800 h-full border-2 rounded-r-3xl">
          <h1 className="text-5xl mt-4 text-white font-bold leading-tight text-center">
            Simplify management with a <span className="text-purple-950 decoration-black">user</span> dashboard
          </h1>
          <p className="text-white mt-1 text-sm text-center">
          Weaving success begins with seamless management. Empower your textile business with a user-friendly dashboard."
          </p>
          <img src={Vector} alt="Dashboard visualization" className="w-full h-64 mt-1 object-contain transform scale-x-[-1]" />
        </div>

        
      </div>
    </div>
    </div>
  );
}
