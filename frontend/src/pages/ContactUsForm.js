import React, { useState } from "react";
import "./resources/ContactUsForm.css";
import Swal from "sweetalert2";
import axios from "axios";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import Nav from "../components/navigation";
import { Link } from "react-router-dom";

export default function ContactUsForm() {
  const [input, setInputs] = useState({
    name: "",
    gmail: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);

    // Send data to the backend
    await sendRequest();
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:3001/api/contact/", {
        name: String(input.name),
        gmail: String(input.gmail),
        phoneNumber: Number(input.phoneNumber),
        message: String(input.message),
      })
      .then((res) => res.data)
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "You Submitted the Message, Our team will get back to you!",
          icon: "success",
        });

        // Refresh the page after a successful form submission
        setTimeout(() => {
          window.location.reload();
        }, 3500); // Add a delay before refreshing the page
      })
      .catch((err) => {
        console.error("Error submitting the form:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again later.",
          icon: "error",
        });
      });
  };

  return (
    <div>
      <Nav />
      <div className="contact-container py-36">
        {/* Contact Header */}
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">yo yoooooooooooooooooooo</p>

        {/* Main Section (Two Columns) */}
        <div className="contact-wrapper">
          {/* Left Section */}
          <div className="contact-info">
            <h2>Get in touch</h2>

            <div className="info-box">
              <FaLocationDot className="icon-location" />
              <div>
                <h3>Head Office</h3>
                <p>mahargama</p>
              </div>
            </div>

            <div className="info-box">
              <MdEmail className="icon-email" />
              <div>
                <h3>Email Us</h3>
                <p>@.com</p>
              </div>
            </div>

            <div className="info-box">
              <PiPhoneCallFill className="icon-call" />
              <div>
                <h3>Call Us</h3>
                <p>+94 70 142 2030</p>
              </div>
            </div>

            <hr className="hr"></hr>
            <h3 className="Followtxt">Follow Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=100073905762464">
                <FaFacebook className="icon-socialfb" />
                Facebook
              </a>
              <a href="https://www.instagram.com/iamsaj.__/">
                <FaXTwitter className="icon-socialtw" /> X
              </a>
              <a href="https://www.instagram.com/iamsaj.__/">
                <FaInstagram className="icon-socialin" />
                Instagram
              </a>
              <a href="https://www.instagram.com/iamsaj.__/">
                <FaTiktok className="icon-socialtt" />
                Tik Tok
              </a>
            </div>
          </div>

          <div className="container">
            <h2 className="title">Send Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="field"
                  placeholder="Enter your name"
                  name="name"
                  pattern="[A-Za-z\s]+"
                  value={input.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="field"
                  placeholder="Enter your email"
                  name="gmail"
                  value={input.gmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  className="field"
                  placeholder="Enter your Phone Number"
                  name="phoneNumber"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  value={input.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <label className="label">Your Message (15-100 characters)</label>
                <textarea
                  name="message"
                  className="field textarea"
                  placeholder="Enter your message (15-100 characters)"
                  value={input.message}
                  onChange={handleChange}
                  minLength={15}
                  maxLength={100}
                  required
                ></textarea>
                <small className="char-count">
                  {input.message.length}/100 characters
                </small>
              </div>
              <button type="submit" className="btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
       {/* Footer */}
      <footer className="py-6 bg-custom-gradient text-white text-center space-y-4">
        <p>
          &copy; {new Date().getFullYear()} DROPship. All rights reserved.
          <br />
          Developed by Sajana Wickramarathna
        </p>

        <div className="flex justify-center gap-6 text-white text-lg">
          <a
            href="https://www.facebook.com/profile.php?id=100073905762464"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            <FaFacebook className="text-2xl" /> Facebook
          </a>

          <a
            href="https://www.instagram.com/iamsaj.__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors flex items-center gap-2"
          >
            <FaInstagram className="text-2xl" /> Instagram
          </a>

          <a
            href="https://www.instagram.com/iamsaj.__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors flex items-center gap-2"
          >
            <FaXTwitter className="text-2xl" /> X
          </a>

          <a
            href="https://www.instagram.com/iamsaj.__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors flex items-center gap-2"
          >
            <FaTiktok  className="text-2xl" /> Tik tok
          </a>
        </div>

        <p>
          <Link to="/privacypolicy" className="text-blue-200 hover:underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link to="/termsofservice" className="text-blue-200 hover:underline">
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
}
