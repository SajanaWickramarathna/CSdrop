import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./resources/tickets.css";

function TicketUserDash() {
  const location = useLocation();
  const userData = location.state?.data || {};

  const userId = userData.user_id;
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (userId) {
      // Ensure userId is defined before making the request
      axios
        .get(`http://localhost:3001/api/tickets/tickets/${userId}`)
        .then((response) => {
          setTickets(response.data.tickets);
        })
        .catch((error) => {
          console.error("There was an error fetching the tickets!", error);
        });
    }
  }, [userId]); // Add userId as a dependency

  const deleteTicket = async (id, status) => {
    if (status !== "Closed") {
      alert("Only tickets with the status 'Closed' can be deleted.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(`http://localhost:3001/api/tickets/${id}`);
        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== id));
      } catch (err) {
        console.error("Error deleting ticket:", err);
      }
    }
  };

  return (
    <div>
      <div className="tkucontainer">
        <h1 className="headingtku">User Dashboard</h1>

        <table className="message-tabletku">
          <thead>
            <tr>
              <th>Categories</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...tickets] // Create a copy of the array
              .reverse() // Reverse the order
              .map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.Categories}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <Link to={`/customer-dashboard/viewticket/${ticket._id}`}>
                      <button className="update-btntku">Chat</button>
                    </Link>
                    <button
                      className="delete-btntku"
                      onClick={() => deleteTicket(ticket._id, ticket.status)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketUserDash;