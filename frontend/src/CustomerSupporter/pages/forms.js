import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiSearch, FiDownload, FiTrash2, FiMail } from "react-icons/fi";

const fetchHandler = async () => {
  return await axios.get(`http://localhost:3001/api/contact`).then((res) => res.data);
};

export default function Forms() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for modal visibility
  const [messageToDelete, setMessageToDelete] = useState(null); // New state for message to delete

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setMessages(data.Ms);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteClick = (id, reply) => {
    if (!reply || reply.trim() === "") {
      alert("Only messages that have been replied to can be deleted.");
      return;
    }
    setMessageToDelete({ id, reply });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      await axios.delete(`http://localhost:3001/api/contact/${messageToDelete.id}`);
      const data = await fetchHandler();
      setMessages(data.Ms);
      setShowDeleteConfirm(false); // Close the modal
      setMessageToDelete(null); // Clear the message to delete
    } catch (err) {
      console.error("Error deleting message:", err);
      setShowDeleteConfirm(false); // Close the modal even on error
      setMessageToDelete(null); // Clear the message to delete
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

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
    const tableRows = filteredMessages.map((message) => [
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

    doc.save("contact_form_report.pdf");
  };

  const filteredMessages = messages
    .filter((message) => {
      if (filter === "all") return true;
      if (filter === "replied") return message.reply?.trim() !== "";
      if (filter === "not-replied") return !message.reply || message.reply.trim() === "";
      return true;
    })
    .filter((message) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        String(message.name).toLowerCase().includes(term) ||
        String(message.gmail).toLowerCase().includes(term) ||
        String(message.phoneNumber).toLowerCase().includes(term) ||
        String(message.message).toLowerCase().includes(term) ||
        (message.reply && String(message.reply).toLowerCase().includes(term))
      );
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contact Messages</h1>
            <p className="text-gray-600 mt-1">
              {filteredMessages.length} {filteredMessages.length === 1 ? "message" : "messages"} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiDownload />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                filter === "all"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "all" && <span className="h-2 w-2 rounded-full bg-teal-800"></span>}
              All Messages
            </button>
            <button
              onClick={() => setFilter("replied")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                filter === "replied"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "replied" && <span className="h-2 w-2 rounded-full bg-green-800"></span>}
              Replied
            </button>
            <button
              onClick={() => setFilter("not-replied")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                filter === "not-replied"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "not-replied" && <span className="h-2 w-2 rounded-full bg-yellow-800"></span>}
              Pending
            </button>
          </div>

          {isLoading ? (
            <div className="p-8">
              {/* Skeleton for desktop table */}
              <div className="hidden md:block">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
              {/* Skeleton for mobile cards */}
              <div className="md:hidden">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border-b border-gray-200 animate-pulse">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="mt-3 flex space-x-2">
                      <div className="h-9 bg-gray-200 rounded flex-1"></div>
                      <div className="h-9 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 mt-8">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex justify-center mb-4">
                <FiSearch className="h-16 w-16 text-gray-300" />
              </div>
              <p className="text-lg font-semibold mb-2">
                {searchTerm ? "No messages match your search." : "No messages found."}
              </p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search term or filters.</p>
              )}
              {!searchTerm && filter !== "all" && (
                  <p className="text-sm">There are no messages in the "{filter.replace('-', ' ')}" category.</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...filteredMessages].reverse().map((msg, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{msg.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">{msg.gmail}</div>
                          <div className="text-gray-500 text-sm">{msg.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-gray-700 max-w-xs truncate overflow-hidden text-ellipsis cursor-help"
                            title={msg.message}
                          >
                            {msg.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              msg.reply
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {msg.reply ? "Replied" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`admin/${msg.contact_id}`}
                              className="text-teal-600 hover:text-teal-900 flex items-center"
                            >
                              <FiMail className="mr-1" /> Reply
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(msg.contact_id, msg.reply)}
                              className={`flex items-center ${msg.reply && msg.reply.trim() !== "" ? "text-red-600 hover:text-red-900" : "text-gray-400 cursor-not-allowed"}`}
                              disabled={!msg.reply || msg.reply.trim() === ""}
                              title={!msg.reply || msg.reply.trim() === "" ? "Reply must be sent before deleting" : "Delete message"}
                            >
                              <FiTrash2 className="mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {[...filteredMessages].reverse().map((msg, i) => (
                  <div key={i} className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{msg.name}</h3>
                        <p className="text-sm text-gray-500">{msg.gmail}</p>
                        <p className="text-sm text-gray-500">{msg.phoneNumber}</p>
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          msg.reply
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {msg.reply ? "Replied" : "Pending"}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-700 text-sm">{msg.message}</p>
                      {msg.reply && (
                        <div className="mt-2 bg-gray-50 p-2 rounded">
                          <p className="text-sm font-medium text-gray-700">Reply:</p>
                          <p className="text-sm text-gray-600">{msg.reply}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link
                        to={`admin/${msg.contact_id}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded text-sm"
                      >
                        <FiMail size={14} />
                        <span>Reply</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(msg.contact_id, msg.reply)}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-sm ${msg.reply && msg.reply.trim() !== "" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        disabled={!msg.reply || msg.reply.trim() === ""}
                        title={!msg.reply || msg.reply.trim() === "" ? "Reply must be sent before deleting" : "Delete message"}
                      >
                        <FiTrash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}