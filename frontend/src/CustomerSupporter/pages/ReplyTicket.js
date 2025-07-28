import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TicketChat from "../../pages/chat"; // Correct path to TicketChat
import "../resource/ReplyTicket.css"; // Ensure this CSS file exists

import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert from MUI

function ReplyTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [userData, setUserData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/tickets/ticket/${id}`)
      .then((response) => {
        setTicket(response.data.ticket);
      })
      .catch((error) => {
        console.error("Error fetching the ticket:", error);
        showSnackbar("Failed to load ticket details", "error");
      });
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        showSnackbar("Failed to load user data", "error");
      }
    };

    if (token) { // Only fetch user data if a token exists
      fetchUserData();
    }
  }, [token]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    axios
      .put(`http://localhost:3001/api/tickets/${id}`, { status: newStatus })
      .then(() => {
        setTicket((prev) => ({ ...prev, status: newStatus }));
        showSnackbar("Ticket status updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating ticket status:", error);
        showSnackbar("Failed to update ticket status", "error");
      });
  };

  if (!ticket) return <p>Loading...</p>;

  return (
    <div>
      <div className="contentrtck">
        <h1>Ticket Details</h1>
        <p>
          <strong>Name:</strong> {ticket.name}
        </p>
        <p>
          <strong>Gmail:</strong> {ticket.gmail}
        </p>
        <p>
          <strong>Phone Number:</strong> {ticket.phoneNumber}
        </p>
        <p>
          <strong>Categories:</strong> {ticket.Categories}
        </p>
        <p>
          <strong>Message:</strong> {ticket.message}
        </p>
        <p>
          <strong>Priority:</strong> {ticket.priority}
        </p>

        <div className="input-boxrtck">
          <label>Status:</label>
          <select
            name="status"
            className="fieldrtck"
            value={ticket.status}
            onChange={handleStatusChange}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold </option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
      {userData && (
        <TicketChat ticketId={ticket.ticket_id} user_id={userData.user_id} role={"admin"} />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ReplyTicket;