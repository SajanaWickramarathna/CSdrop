import React, { useState } from "react";
import "./resources/ContactUsForm.css";
import Swal from "sweetalert2";
import axios from "axios";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import Nav from '../components/navigation';

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
      <Nav/>
      <div className="contact-container py-36">
        {/* Contact Header */}
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">
          KHB is ready to provide the right solution according to your needs.
        </p>

        {/* Main Section (Two Columns) */}
        <div className="contact-wrapper">
          {/* Left Section */}
          <div className="contact-info">
            <h2>Get in touch</h2>

            <div className="info-box">
              <FaLocationDot className="icon-location" />
              <div>
                <h3>Head Office</h3>
                <p>47, Byrde Place, Colombo 06, Sri Lanka</p>
              </div>
            </div>

            <div className="info-box">
              <MdEmail className="icon-email" />
              <div>
                <h3>Email Us</h3>
                <p>khb@khbassociates.com</p>
              </div>
            </div>

            <div className="info-box">
              <PiPhoneCallFill className="icon-call" />
              <div>
                <h3>Call Us</h3>
                <p>+94 11 2556855</p>
                <p>Fax: +94 11 2556576</p>
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
                <label className="label">Your Message</label>
                <textarea
                  name="message"
                  className="field textarea"
                  placeholder="Enter your message"
                  value={input.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}