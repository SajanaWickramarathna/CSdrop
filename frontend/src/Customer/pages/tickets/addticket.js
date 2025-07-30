import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../api";

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
      const response = await api.get("/users/me", {
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
    api
      .post("/tickets", input)
      .then(() => {
        navigate("/customer-dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating the ticket!", error);
      });
  };

  if (isLoading) return <div className="text-center py-10 text-lg">Loading user data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={input.name}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="gmail"
              value={input.gmail}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={input.phoneNumber}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Categories</label>
            <select
              name="Categories"
              value={input.Categories}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700"
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

          <div>
            <label className="block mb-1 font-medium text-gray-700">Your Message</label>
            <textarea
              name="message"
              value={input.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
              placeholder="Enter your message"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={input.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700"
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTicket;
