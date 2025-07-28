import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TicketChat from "../../pages/chat";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiUser, 
  FiMessageSquare,
  FiTag,
  FiAlertTriangle,
  FiCheckCircle
} from "react-icons/fi";

function ReplyTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, userRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/tickets/ticket/${id}`),
          token ? axios.get("http://localhost:3001/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          }) : Promise.resolve(null)
        ]);
        
        setTicket(ticketRes.data.ticket);
        if (userRes) setUserData(userRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load ticket details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`http://localhost:3001/api/tickets/${id}`, { status: newStatus });
      setTicket(prev => ({ ...prev, status: newStatus }));
      Swal.fire({
        title: "Success!",
        text: "Ticket status updated successfully!",
        icon: "success",
        confirmButtonColor: "#10B981",
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update ticket status",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Failed to load ticket details</p>
      </div>
    );
  }

  const getPriorityIcon = () => {
    switch (ticket.priority) {
      case 'High':
        return <FiAlertTriangle className="h-5 w-5 text-red-600" />;
      case 'Medium':
        return <FiAlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <FiAlertTriangle className="h-5 w-5 text-green-500" />;
      default:
        return <FiAlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (ticket.status) {
      case 'Open':
        return <FiCheckCircle className="h-5 w-5 text-blue-500" />;
      case 'In Progress':
        return <FiCheckCircle className="h-5 w-5 text-yellow-500" />;
      case 'On Hold':
        return <FiCheckCircle className="h-5 w-5 text-orange-500" />;
      case 'Closed':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <FiCheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Tickets
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="bg-teal-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Ticket Details</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                    <FiUser className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{ticket.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                    <FiMail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{ticket.gmail}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                    <FiPhone className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-sm text-gray-900">{ticket.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                    <FiTag className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-sm text-gray-900">{ticket.Categories}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                    {getPriorityIcon()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Priority</p>
                    <p className={`text-sm font-semibold ${
                      ticket.priority === 'High' ? 'text-red-600' : 
                      ticket.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {ticket.priority}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                    {getStatusIcon()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <select
                      value={ticket.status}
                      onChange={handleStatusChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md border"
                    >
                      <option value="Open" className="text-blue-600">Open</option>
                      <option value="In Progress" className="text-yellow-600">In Progress</option>
                      <option value="On Hold" className="text-orange-600">On Hold</option>
                      <option value="Closed" className="text-green-600">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start w-full">
              <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                <FiMessageSquare className="h-5 w-5 text-teal-600" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">Message</p>
                <p className="text-base text-gray-800 bg-teal-50 p-4 rounded-lg mt-1 border border-teal-200 shadow-sm break-words">
                  {ticket.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {userData && (
          
            <div className="p-6">
              <TicketChat 
                ticketId={ticket.ticket_id} 
                user_id={userData.user_id} 
                role="admin" 
              />
            </div>
          
        )}
      </div>
    </div>
  );
}

export default ReplyTicket;