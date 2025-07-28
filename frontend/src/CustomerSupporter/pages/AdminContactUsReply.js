import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FiArrowLeft, FiMail, FiPhone, FiUser, FiMessageSquare } from "react-icons/fi";

function AdminContactUsReply() {
  const [input, setInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/contact/${id}`);
        setInputs(res.data.Ms);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load message details",
        });
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    return await axios.put(`http://localhost:3001/api/contact/${id}`, {
      name: input.name,
      gmail: input.gmail,
      phoneNumber: input.phoneNumber,
      message: input.message,
      reply: input.reply,
    });
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      ...prevState, // This line seems redundant, consider removing one.
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate reply input
    if (!input.reply || input.reply.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Reply is required",
        text: "Please type a reply before submitting.",
      });
      setIsSubmitting(false);
      return;
    }

    if (input.reply.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Reply Too Short",
        text: "Your reply should be at least 10 characters long.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await sendRequest();
      await Swal.fire({
        title: "Success!",
        text: "Reply submitted successfully!",
        icon: "success",
        confirmButtonColor: "#10B981",
      });
      history("/support-dashboard/forms");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit reply",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => history("/support-dashboard/forms")}
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Messages
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-teal-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Reply to Message</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                  <FiUser className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{input.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                  <FiMail className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{input.gmail}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                  <FiPhone className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-sm text-gray-900">{input.phoneNumber}</p>
                </div>
              </div>

              {/* Original Message Section - Updated */}
              <div className="flex items-start w-full"> {/* Added w-full here */}
                <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full">
                  <FiMessageSquare className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-3 flex-1 min-w-0"> {/* Added min-w-0 */}
                  <p className="text-sm font-medium text-gray-700">Original Message</p>
                  <p className="text-base text-gray-800 bg-teal-50 p-4 rounded-lg mt-1 border border-teal-200 shadow-sm break-words"> {/* Added break-words */}
                    {input.message}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reply" className="block text-sm font-medium text-gray-700">
                  Your Reply
                </label>
                <div className="mt-1">
                  <textarea
                    id="reply"
                    name="reply"
                    rows={6}
                    value={input.reply || ""}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                    placeholder="Type your detailed reply here..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Minimum 10 characters required
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Reply"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminContactUsReply;