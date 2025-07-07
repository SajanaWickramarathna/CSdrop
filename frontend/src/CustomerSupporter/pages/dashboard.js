import React, { useEffect, useState } from "react";
import axios from "axios";
import "../resource/Dashboard.css";

export default function Dashboard() {
  const [ticketCount, setTicketCount] = useState(0);
  const [totalTicketCount, setTotalTicketCount] = useState(0);
  const [contactFormCount, setContactFormCount] = useState(0);
  const [totalContactFormCount, setTotalContactFormCount] = useState(0);

  useEffect(() => {
    // Fetch tickets
    axios
      .get("http://localhost:3001/api/tickets")
      .then((response) => {
        const tickets = response.data.tickets;
        const pendingTickets = tickets.filter(
          (ticket) => ticket.status !== "Closed"
        );
        setTicketCount(pendingTickets.length);
        setTotalTicketCount(tickets.length);
      })
      .catch((error) => console.error("Error fetching tickets:", error));

    // Fetch contact forms
    axios
      .get("http://localhost:3001/api/contact")
      .then((response) => {
        const forms = response.data.Ms;
        const pendingForms = forms.filter(
          (form) => !form.reply || form.reply.trim() === ""
        );
        setContactFormCount(pendingForms.length);
        setTotalContactFormCount(forms.length);
      })
      .catch((error) => console.error("Error fetching contact forms:", error));
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Dashboard</h1>

      <div className="dashboard-pair-container">
        {/* Ticket Column */}
        <div className="dashboard-group">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Pending Tickets</h2>
            <p className="dashboard-count">{ticketCount}</p>
          </div>
          <div className="dashboard-card">
            <h2 className="dashboard-title">Total Tickets</h2>
            <p className="dashboard-count">{totalTicketCount}</p>
          </div>
          <button
            className="dashboard-button"
            onClick={() => {
              window.location.href = "/support-dashboard/tickets";
            }}
          >
            View Tickets
          </button>
        </div>

        {/* Contact Form Column */}
        <div className="dashboard-group">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Pending Contact Forms</h2>
            <p className="dashboard-count">{contactFormCount}</p>
          </div>
          <div className="dashboard-card">
            <h2 className="dashboard-title">Total Contact Forms</h2>
            <p className="dashboard-count">{totalContactFormCount}</p>
          </div>
          <button
            className="dashboard-button"
            onClick={() => {
              window.location.href = "/support-dashboard/forms";
            }}
          >
            View Contact Forms
          </button>
        </div>
      </div>
    </div>
  );
}
