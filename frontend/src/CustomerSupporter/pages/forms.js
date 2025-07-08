import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../resource/ContactUsAdminDash.css";

const URL = "http://localhost:3001/api/contact";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

export default function Forms() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchHandler().then((data) => setMessages(data.Ms));
  }, []);

  const deleteHandler = async (id, reply) => {
    if (!reply || reply.trim() === "") {
      alert("Only messages that have been replied to can be deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this message?")) {
      await axios
        .delete(`http://localhost:3001/api/contact/${id}`)
        .then(() => {
          fetchHandler().then((data) => setMessages(data.Ms));
        })
        .catch((err) => console.error("Error deleting message:", err));
    }
  };
  //pdf generate
  const generatePDF = () => {
  if (messages.length === 0) {
    alert("No messages available to generate the report.");
    return;
  }

  const doc = new jsPDF();
  const currentDate = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.text("Contact Form Messages Report", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${currentDate}`, 14, 22);

  const tableColumn = ["Name", "Email", "Phone", "Message", "Reply"];
  const tableRows = messages.map((message) => [
    message.name,
    message.gmail,
    message.phoneNumber,
    message.message,
    message.reply?.trim() !== "" ? message.reply : "No reply yet",
  ]);

  autoTable(doc, {
    startY: 30,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [22, 160, 133] }, // Teal heading
    didDrawPage: function (data) {
      // Optional footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(
        `Page ${pageCount}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("contact_form_report.pdf");
};
  // Filter messages based on the selected filter

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true;
    if (filter === "replied") return message.reply?.trim() !== "";
    if (filter === "not-replied") return !message.reply || message.reply.trim() === "";
    return true;
  });

  return (
    <div className="forms-container">
      <h1 className="heading">Contact Form Replies</h1>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={`filter-button ${filter === "all" ? "filter-button-active" : ""}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("replied")}
          className={`filter-button ${filter === "replied" ? "filter-button-active" : ""}`}
        >
          Replied
        </button>
        <button
          onClick={() => setFilter("not-replied")}
          className={`filter-button ${filter === "not-replied" ? "filter-button-active" : ""}`}
        >
          Pending
        </button>
      </div>

      <button onClick={generatePDF} className="generate-pdf-button">
        Generate PDF Report
      </button>

      {/* Table layout for medium & larger screens */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Name</th>
              <th className="table-cell">Email</th>
              <th className="table-cell">Phone</th>
              <th className="table-cell">Message</th>
              <th className="table-cell">Reply</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...filteredMessages].reverse().map((msg, i) => (
              <tr key={i} className="border-b">
                <td className="table-cell">{msg.name}</td>
                <td className="table-cell">{msg.gmail}</td>
                <td className="table-cell">{msg.phoneNumber}</td>
                <td className="table-cell">{msg.message}</td>
                <td className="table-cell">
                  <span
                    className={`status-badge ${
                      msg.reply ? "replied" : "pending"
                    }`}
                  >
                    {msg.reply || "No reply yet"}
                  </span>
                </td>
                <td className="table-cell flex gap-2">
                  <Link to={`admin/${msg.contact_id}`}>
                    <button className="reply-button">Reply</button>
                  </Link>
                  <button
                    onClick={() => deleteHandler(msg.contact_id, msg.reply)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="card-container">
        {[...filteredMessages].reverse().map((msg, i) => (
          <div key={i} className="card">
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.gmail}</p>
            <p><strong>Phone:</strong> {msg.phoneNumber}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p>
              <strong>Reply:</strong>{" "}
              <span
                className={`status-badge ${
                  msg.reply ? "replied" : "pending"
                }`}
              >
                {msg.reply || "No reply yet"}
              </span>
            </p>
            <div className="mt-3 flex gap-2">
              <Link to={`admin/${msg.contact_id}`} className="flex-1">
                <button className="card-reply-button">Reply</button>
              </Link>
              <button
                onClick={() => deleteHandler(msg.contact_id, msg.reply)}
                className="card-delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
