import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Chat from "../../Customer/pages/tickets/chat";
import "../resource/ReplyTicket.css";

function ReplyTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/tickets/ticket/${id}`)
      .then((response) => {
        setTicket(response.data.ticket);
      })
      .catch((error) => {
        console.error("Error fetching the ticket:", error);
      });
  }, [id]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    axios
      .put(`http://localhost:3001/api/tickets/${id}`, { status: newStatus })
      .then(() => {
        setTicket((prev) => ({ ...prev, status: newStatus }));
      })
      .catch((error) => {
        console.error("Error updating ticket status:", error);
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
            {/* Chat component for Admin to reply */}
            <Chat ticketId={id} user="admin" />
          </div>
        </div>
      </div>
  );
}

export default ReplyTicket;
