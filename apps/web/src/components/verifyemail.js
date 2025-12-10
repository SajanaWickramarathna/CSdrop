import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./navigation";
import Swal from "sweetalert2";
import { api } from "../api"; // Adjust if api is elsewhere

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/users/verify/${token}`)
      .then((res) => {
        setMessage(res.data.message);
        Swal.fire({
          title: "Success!",
          text: res.data?.message,
          icon: "success",
        });
        navigate('/signin');
      })
      .catch(() => {
        setMessage("Invalid or expired token");
        Swal.fire({
          title: "Error!",
          text: "Invalid or expired token, Contact Administration",
          icon: "error",
        });
        navigate('/contactform');
      });
  }, [token, navigate]);

  return (
    <div>
      <Nav />
      <h2 className="py-32 px-16">{message}</h2>
    </div>
  );
};

export default VerifyEmail;
