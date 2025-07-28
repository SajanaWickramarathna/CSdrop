import React, { useEffect, useState } from "react";
import axios from "axios";

// Define a simple loading spinner component for better UX
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Define a simple error message component
const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center shadow-sm">
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.542 2.705-1.542 3.47 0l5.58 11.199A1.5 1.5 0 0117.035 16H2.965a1.5 1.5 0 01-1.352-2.102l5.58-11.199zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
    </svg>
    <span>{message}</span>
  </div>
);

export default function Dashboard() {
  const [ticketCount, setTicketCount] = useState(0);
  const [totalTicketCount, setTotalTicketCount] = useState(0);
  const [contactFormCount, setContactFormCount] = useState(0);
  const [totalContactFormCount, setTotalContactFormCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using Promise.all to fetch data concurrently for better performance
        const [ticketsResponse, contactResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/tickets"),
          axios.get("http://localhost:3001/api/contact")
        ]);

        // Process ticket data
        const tickets = ticketsResponse.data.tickets || [];
        const pendingTickets = tickets.filter(ticket => ticket.status !== "Closed");
        setTicketCount(pendingTickets.length);
        setTotalTicketCount(tickets.length);

        // Process contact form data
        const forms = contactResponse.data.Ms || [];
        const pendingForms = forms.filter(form => !form.reply || form.reply.trim() === "");
        setContactFormCount(pendingForms.length);
        setTotalContactFormCount(forms.length);

        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please ensure the backend server is running.");
      } finally {
        setLoading(false); // Always set loading to false after fetch attempt
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs once on mount

  // StatCard component for displaying individual statistics
  const StatCard = ({ title, count, isPending = false }) => {
    return (
      <div className={`
        bg-gray-50 rounded-xl p-6 text-center relative transition-all duration-200 ease-in-out
        hover:scale-105 hover:shadow-lg
        ${isPending ? 'bg-orange-50 border-l-4 border-orange-400' : 'border border-gray-200'}
      `}>
        <h2 className="text-sm sm:text-base font-semibold text-gray-500 mb-2">{title}</h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            count.toLocaleString()
          )}
        </p>
        {isPending && count > 0 && (
          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-md">
            {count}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-inter bg-gray-50 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">Dashboard Overview</h1>
        <p className="text-base sm:text-lg text-gray-600">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
      </header>

      {error && <ErrorMessage message={error} />}

      {loading && !error ? ( // Show loading spinner only if loading and no error
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Support Tickets Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-blue-500 text-3xl sm:text-4xl">🎫</span> Support Tickets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard title="Pending Tickets" count={ticketCount} isPending />
              <StatCard title="Total Tickets" count={totalTicketCount} />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              onClick={() => {
                window.location.href = "/support-dashboard/tickets";
              }}
            >
              Manage Tickets
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>

          {/* Contact Forms Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-green-500 text-3xl sm:text-4xl">✉️</span> Contact Forms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard title="Pending Forms" count={contactFormCount} isPending />
              <StatCard title="Total Forms" count={totalContactFormCount} />
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              onClick={() => {
                window.location.href = "/support-dashboard/forms";
              }}
            >
              Review Forms
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
