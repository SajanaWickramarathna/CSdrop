import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Chat from "./chat";
import "./resources/replyticket.css";

function ViweReplyTicket() {
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

  if (!ticket) return <p>Loading...</p>;

  return (
    <div>

        <div className="view-ticket">
          <h1>Ticket Details</h1>
          <div className="ticket-actions">
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
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            {/* Chat for users to reply */}
            <Chat ticketId={id} user="user" />
          </div>
        </div>
      </div>
  );
}

export default ViweReplyTicket;
