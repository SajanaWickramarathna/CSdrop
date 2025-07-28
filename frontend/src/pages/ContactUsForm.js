import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaChevronRight } from "react-icons/fa";
import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import Nav from "../components/navigation";
import { Link } from "react-router-dom";

export default function ContactUsForm() {
  const [input, setInputs] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendRequest();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendRequest = async () => {
    try {
      await axios.post("http://localhost:3001/api/contact/", {
        name: input.name.trim(),
        gmail: input.email.trim(),
        phoneNumber: input.phoneNumber.replace(/\D/g, ""),
        message: input.message.trim(),
      });

      Swal.fire({
        title: "Success!",
        text: "Your message has been submitted. Our team will get back to you soon!",
        icon: "success",
        timer: 3500,
        timerProgressBar: true,
      });

      // Reset form after success
      setInputs({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
      
    } catch (err) {
      console.error("API Error:", err);
      let errorMessage = "Something went wrong. Please try again later.";
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }

      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
      
      throw err; // Re-throw to handle in the calling function
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav />
      
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          {/* Contact Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </header>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Info Section */}
            <div className="w-full lg:w-2/5 bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Get in touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaLocationDot className="text-2xl text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Head Office</h3>
                    <p className="text-gray-600">123 Business Street, Maharagama, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MdEmail className="text-2xl text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                    <a href="mailto:contact@dropship.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                      contact@dropship.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PiPhoneCallFill className="text-2xl text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                    <a href="tel:+94701422030" className="text-gray-600 hover:text-green-600 transition-colors">
                      +94 70 142 2030
                    </a>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-gray-200" />

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: <FaFacebook className="text-xl" />, name: "Facebook", url: "https://facebook.com", color: "text-blue-600" },
                    { icon: <FaXTwitter className="text-xl" />, name: "Twitter", url: "https://twitter.com", color: "text-black" },
                    { icon: <FaInstagram className="text-xl" />, name: "Instagram", url: "https://instagram.com", color: "text-pink-600" },
                    { icon: <FaTiktok className="text-xl" />, name: "TikTok", url: "https://tiktok.com", color: "text-black" },
                    { icon: <FaLinkedin className="text-xl" />, name: "LinkedIn", url: "https://linkedin.com", color: "text-blue-700" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${social.color}`}
                    >
                      {social.icon}
                      <span className="text-gray-800">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="w-full lg:w-3/5 bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    placeholder="Your name"
                    value={input.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    placeholder="your.email@example.com"
                    value={input.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    placeholder="+94 70 123 4567"
                    value={input.phoneNumber}
                    onChange={handleChange}
                    pattern="[\+]\d{2}\s\d{2}\s\d{3}\s\d{4}|[\+]\d{11}|\d{10}"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    placeholder="Tell us how we can help..."
                    value={input.message}
                    onChange={handleChange}
                    required
                    minLength={15}
                    maxLength={500}
                  ></textarea>
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>Minimum 15 characters</span>
                    <span>{input.message.length}/500 characters</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      
      {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">DROPship</h3>
              <p className="mb-4">
                Premium products delivered straight to your doorstep.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaXTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTiktok className="text-xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/shop" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Shop</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> About Us</Link></li>
                <li><Link to="/contactform" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link to="/shipping" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Return Policy</Link></li>
                <li><Link to="/privacypolicy" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Privacy Policy</Link></li>
                <li><Link to="/termsofservice" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>
              <address className="not-italic space-y-2">
                <p className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Main Street, Colombo
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +94 76 123 4567
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@dropship.com
                </p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} DROPship. All rights reserved.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>
              Developed by Sajana Wickramarathna
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}