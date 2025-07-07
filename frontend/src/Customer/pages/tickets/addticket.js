import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./resources/addticket.css";

function AddTicket() {
  const location = useLocation();
  const userDataFromState = location.state?.data || {};
  const userId = userDataFromState.user_id;
  const navigate = useNavigate();

  const [input, setInput] = useState({
    user_id: userId,
    name: "",
    gmail: "",
    phoneNumber: "",
    Categories: "After-Sales Support",
    message: "",
    priority: "Low",
  });

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/logout");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (userData) {
      setInput({
        ...input,
        name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        gmail: userData.email || "",
        phoneNumber: userData.phone || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/tickets", input)
      .then((response) => {
        navigate("/customer-dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating the ticket!", error);
      });
  };

  if (isLoading) return <div>Loading user data...</div>;

  return (
    <div>
      <div className="containerT">
        <h2 className="titleT">Add New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-boxT">
            <label className="labelT">Full Name</label>
            <input
              type="text"
              className="fieldT"
              placeholder="Enter your name"
              name="name"
              value={input.name}
              readOnly // Make the field read-only
            />
          </div>

          <div className="input-boxT">
            <label className="labelT">Email Address</label>
            <input
              type="email"
              name="gmail"
              className="fieldT"
              placeholder="Enter your email"
              value={input.gmail}
              readOnly // Make the field read-only
            />
          </div>

          <div className="input-boxT">
            <label className="labelT">Phone Number</label>
            <input
              type="tel"
              className="fieldT"
              placeholder="Enter your Phone Number"
              name="phoneNumber"
              value={input.phoneNumber}
              readOnly // Make the field read-only
            />
          </div>

          <div className="input-boxT">
            <label className="labelT">Categories</label>
            <select
              name="Categories"
              className="fieldT"
              value={input.Categories}
              onChange={handleChange}
            >
              <option value="Logistics & Shipping">📦 Logistics & Shipping</option>
              <option value="Technical Support">🛠️ Technical Support</option>
              <option value="Orders & Invoices">📑 Orders & Invoices</option>
              <option value="Payments & Billing">💰 Payments & Billing</option>
              <option value="Returns & Refunds">🔁 Returns & Refunds</option>
              <option value="After-Sales Support">👨‍🔧 After-Sales Support</option>
              <option value="Product Information">🧠 Product Information</option>
              <option value="Machine Renting">💼 Machine Renting</option>
              <option value="Account & Sales">🧑‍💼 Account & Sales</option>
              <option value="Feedback & Complaints">🎯 Feedback & Complaints</option>
              <option value="Website & System Issues">🌐 Website & System Issues</option>
            </select>
          </div>

          <div className="input-boxT">
            <label className="labelT">Your Message</label>
            <textarea
              name="message"
              className="field textareaT"
              placeholder="Enter your message"
              value={input.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="input-boxT">
            <label className="labelT">Priority</label>
            <select
              name="priority"
              className="fieldT"
              value={input.priority}
              onChange={handleChange}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>
          <button type="submit" className="btnT">
            Add Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTicket;