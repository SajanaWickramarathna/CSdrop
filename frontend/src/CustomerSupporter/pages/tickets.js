import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiTrash2, FiMail, FiFilter, FiSearch, FiAlertCircle, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

// Toast Component for temporary messages
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "error" ? "bg-red-500" : type === "success" ? "bg-green-500" : "bg-yellow-500";
  const icon = type === "error" ? <FiAlertCircle /> : type === "success" ? <FiCheckCircle /> : <FiClock />;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ease-out transform translate-x-0 opacity-100`}>
      <div className="mr-2">{icon}</div>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <FiXCircle />
      </button>
    </div>
  );
};

// Modal Component for confirmations
const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all scale-100 opacity-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [replyFilter, setReplyFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showModal, setShowModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/tickets");
        setTickets(response.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        showTimedToast("Failed to fetch tickets.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Function to show a toast message
  const showTimedToast = (message, type = "info", duration = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
      setToastType("info");
    }, duration);
    return () => clearTimeout(timer);
  };

  // Handles the initial delete click, showing modal or toast
  const handleDeleteClick = (ticketId, status) => {
    if (status !== "Closed") {
      showTimedToast("Only tickets with status 'Closed' can be deleted.", "error");
      return;
    }
    setTicketToDelete({ ticketId, status });
    setShowModal(true);
  };

  // Confirms deletion after modal interaction
  const confirmDelete = async () => {
    setShowModal(false);
    if (ticketToDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/tickets/ticket/${ticketToDelete.ticketId}`);
        setTickets(prev => prev.filter(ticket => ticket.ticket_id !== ticketToDelete.ticketId));
        showTimedToast("Ticket successfully deleted!", "success");
      } catch (err) {
        console.error("Error deleting ticket:", err);
        showTimedToast("Failed to delete ticket.", "error");
      } finally {
        setTicketToDelete(null);
      }
    }
  };

  // Cancels deletion from modal
  const cancelDelete = () => {
    setShowModal(false);
    setTicketToDelete(null);
  };

  const generatePDF = () => {
    if (tickets.length === 0) {
      showTimedToast("No tickets available to generate report.", "warning");
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text("Tickets Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 22);

    const tableColumn = ["Name", "Email", "Phone", "Category", "Priority", "Status", "Message"];
    const tableRows = filteredTickets.map(ticket => [
      ticket.name,
      ticket.gmail,
      ticket.phoneNumber,
      ticket.Categories,
      ticket.priority,
      ticket.status,
      ticket.message
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save("tickets_report.pdf");
  };

  const filteredTickets = tickets.filter(ticket => {
    // Apply filters
    const isReplied = ticket.status === "Resolved" || ticket.status === "Closed";
    if (replyFilter === "replied" && !isReplied) return false;
    if (replyFilter === "not-replied" && isReplied) return false;

    if (priorityFilter !== "all" && ticket.priority.toLowerCase() !== priorityFilter.split("-")[0]) return false;
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        String(ticket.name).toLowerCase().includes(term) ||
        String(ticket.gmail).toLowerCase().includes(term) ||
        String(ticket.phoneNumber).toLowerCase().includes(term) ||
        String(ticket.Categories).toLowerCase().includes(term) ||
        String(ticket.message).toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Closed":
      case "Resolved":
        return <FiCheckCircle className="text-green-500" />;
      case "Pending":
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiAlertCircle className="text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ticket System</h1>
            <p className="text-gray-600 mt-1">
              {filteredTickets.length} {filteredTickets.length === 1 ? "ticket" : "tickets"} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FiXCircle />
                </button>
              )}
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
            >
              <FiDownload />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                <div className="flex flex-wrap gap-2">
                  {["all", "replied", "not-replied"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setReplyFilter(filter)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        replyFilter === filter
                          ? filter === "all" 
                            ? "bg-gray-200 text-gray-800" // Stronger active state for 'All'
                            : filter === "replied"
                            ? "bg-green-100 text-green-800 ring-1 ring-green-300" // Ring for active
                            : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300" // Ring for active
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter === "all" ? "All" : filter === "replied" ? "Closed/Resolved" : "Pending"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 mr-2">Priority:</span>
                <div className="flex flex-wrap gap-2">
                  {["all", "low-priority", "medium-priority", "high-priority"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setPriorityFilter(filter)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        priorityFilter === filter
                          ? filter === "all"
                            ? "bg-gray-200 text-gray-800" // Stronger active state for 'All'
                            : filter === "high-priority"
                            ? "bg-red-100 text-red-800 ring-1 ring-red-300" // Ring for active
                            : filter === "medium-priority"
                            ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300" // Ring for active
                            : "bg-green-100 text-green-800 ring-1 ring-green-300" // Ring for active
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter === "all" ? "All" : filter.split("-")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm && (replyFilter === "all" && priorityFilter === "all")
                ? "No tickets match your search."
                : (replyFilter !== "all" || priorityFilter !== "all") && !searchTerm
                ? "No tickets found matching the selected filters."
                : (searchTerm && (replyFilter !== "all" || priorityFilter !== "all"))
                ? "No tickets match your search and filters."
                : "No tickets found."
              }
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {[...filteredTickets].reverse().map((ticket) => (
                <div key={ticket._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(ticket.status)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{ticket.name}</h3>
                          <p className="text-sm text-gray-500">{ticket.gmail}</p>
                          <p className="text-sm text-gray-500">{ticket.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-gray-700">
                          <span className="font-medium">Category:</span> {ticket.Categories}
                        </p>
                        <p className="text-gray-700 mt-1">{ticket.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} Priority
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === "Closed" || ticket.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {ticket.status}
                      </span>
                      
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/support-dashboard/replyticket/${ticket.ticket_id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          <FiMail className="mr-1" /> Reply
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(ticket.ticket_id, ticket.status)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}

      {showModal && (
        <Modal
          title="Confirm Deletion"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
