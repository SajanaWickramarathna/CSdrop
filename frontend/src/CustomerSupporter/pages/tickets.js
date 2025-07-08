import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../resource/TicketAdminDash.css";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [replyFilter, setReplyFilter] = useState("all"); // 'all', 'replied', 'not-replied'
  const [priorityFilter, setPriorityFilter] = useState("all"); // 'all', 'low-priority', 'medium-priority', 'high-priority'

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/tickets")
      .then((response) => {
        setTickets(response.data.tickets);
      })
      .catch((error) => {
        console.error("There was an error fetching the tickets!", error);
      });
  }, []);

  const deleteTicket = async (ticketId, status) => {
    if (status !== "Closed") {
      alert("Only tickets with the status 'Closed' can be deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        // Use the route that deletes by ticket_id, assuming backend uses this path:
        await axios.delete(
          `http://localhost:3001/api/tickets/ticket/${ticketId}`
        );

        // Update state filtering by ticket_id
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.ticket_id !== ticketId)
        );
      } catch (err) {
        console.error("Error deleting ticket:", err);
      }
    }
  };

  const generatePDF = () => {
    if (tickets.length === 0) {
      alert("No tickets available to generate the report.");
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();

    // Title and date
    doc.setFontSize(16);
    doc.text("Tickets Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 22);

    // Table columns and rows
    const tableColumn = [
      "Name",
      "Gmail",
      "Phone",
      "Categories",
      "Priority",
      "Status",
      "Message",
    ];

    const tableRows = tickets.map((ticket) => [
      ticket.name,
      ticket.gmail,
      ticket.phoneNumber,
      ticket.Categories,
      ticket.priority,
      ticket.status,
      ticket.message,
    ]);

    // Generate table with autoTable
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] }, // Teal heading
      didDrawPage: function (data) {
        // Optional footer with page number
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    // Save the PDF
    doc.save("tickets_report.pdf");
  };

  // Filter tickets based on selected filters
  const filteredTickets = tickets.filter((ticket) => {
    // Apply reply filter
    if (
      replyFilter === "replied" &&
      !(ticket.status === "Resolved" || ticket.status === "Closed")
    ) {
      return false;
    }
    if (
      replyFilter === "not-replied" &&
      (ticket.status === "Resolved" || ticket.status === "Closed")
    ) {
      return false;
    }

    // Apply priority filter
    if (priorityFilter === "low-priority" && ticket.priority !== "Low") {
      return false;
    }
    if (priorityFilter === "medium-priority" && ticket.priority !== "Medium") {
      return false;
    }
    if (priorityFilter === "high-priority" && ticket.priority !== "High") {
      return false;
    }

    return true;
  });

  return (
    <div>
      <div className="contentatck">
        <h1 className="ticksysh1">Ticket System</h1>

        <div className="filter-controls">
          {/* Reply Filter */}
          <div className="filter-group">
            <h3>Reply Filter</h3>
            <button
              className={`filter-btn ${replyFilter === "all" ? "active" : ""}`}
              onClick={() => setReplyFilter("all")}
            >
              All Tickets
            </button>
            <button
              className={`filter-btn ${
                replyFilter === "replied" ? "active" : ""
              }`}
              onClick={() => setReplyFilter("replied")}
            >
              Closed Tickets
            </button>
            <button
              className={`filter-btn ${
                replyFilter === "not-replied" ? "active" : ""
              }`}
              onClick={() => setReplyFilter("not-replied")}
            >
              Pending Tickets
            </button>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <h3>Priority Filter</h3>
            <button
              className={`filter-btn ${
                priorityFilter === "all" ? "active" : ""
              }`}
              onClick={() => setPriorityFilter("all")}
            >
              All Priorities
            </button>
            <button
              className={`filter-btn ${
                priorityFilter === "low-priority" ? "active" : ""
              }`}
              onClick={() => setPriorityFilter("low-priority")}
            >
              Low Priority
            </button>
            <button
              className={`filter-btn ${
                priorityFilter === "medium-priority" ? "active" : ""
              }`}
              onClick={() => setPriorityFilter("medium-priority")}
            >
              Medium Priority
            </button>
            <button
              className={`filter-btn ${
                priorityFilter === "high-priority" ? "active" : ""
              }`}
              onClick={() => setPriorityFilter("high-priority")}
            >
              High Priority
            </button>
          </div>
        </div>

        <button onClick={generatePDF} className="pdfbtn">
          Generate PDF Report
        </button>

        <ul>
          {filteredTickets &&
            [...filteredTickets] // Create a copy of the array
              .reverse() // Reverse the order
              .map((ticket) => (
                <li key={ticket._id}>
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
                    <strong>Categories:</strong>{" "}
                    <strong className="Highlight">{ticket.Categories}</strong>
                  </p>
                  <p>
                    <strong>Message:</strong> {ticket.message}
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <strong className="Highlight">{ticket.priority}</strong>
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <strong className="Highlight">{ticket.status}</strong>
                  </p>
                  <Link
                    to={`/support-dashboard/replyticket/${ticket.ticket_id}`}
                  >
                    Reply
                  </Link>
                  <button
                    onClick={() =>
                      deleteTicket(ticket.ticket_id, ticket.status)
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
