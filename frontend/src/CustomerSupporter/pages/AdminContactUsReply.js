import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Swal from "sweetalert2"; 
import "../resource/AdminContactUsReply.css";


function AdminContactUsReply() {
  const [input, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:3001/api/contact/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.Ms));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:3001/api/contact/${id}`, {
        name: input.name,
        gmail: input.gmail,
        phoneNumber: input.phoneNumber,
        message: input.message,
        reply: input.reply,
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate reply input
    if (!input.reply || input.reply.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Reply is required",
        text: "Please type a reply before submitting.",
      });
      return;
    }

    if (input.reply.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Reply Too Short",
        text: "Your reply should be at least 10 characters long.",
      });
      return;
    }

    // Submit if valid
    sendRequest().then(() => {
      Swal.fire({
        title: "Success!",
        text: "You submitted the reply successfully!",
        icon: "success",
      }).then(() => {
        history("/support-dashboard/forms");
      });
    });
  };

  return (
    <div>
      <div className="contact-reply-container">
        <div className="contentreply">
          <h1 className="contact-reply-title">Reply to Message</h1>

          <div className="message-details">
            <p>
              <strong>Name:</strong> {input.name}
            </p>
            <p>
              <strong>Email:</strong> {input.gmail}
            </p>
            <p>
              <strong>Phone Number:</strong> {input.phoneNumber}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              <strong className="Messagereply"> {input.message}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              <label className="contact-reply-label">Reply:</label>
              <textarea
                name="reply"
                value={input.reply || ""}
                placeholder="Type your reply here..."
                onChange={handleChange}
                className="contact-reply-textarea"
              />
              <button type="submit" className="contact-reply-button">
                Send Reply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminContactUsReply;
