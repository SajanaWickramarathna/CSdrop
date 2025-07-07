import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Nav from "./navigation";
import Swal from "sweetalert2";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`http://localhost:3001/api/users/verify/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        Swal.fire({
          title: "Success!",
          text: data?.message,
          icon: "success",
        });
        navigate('/signin');
      })
      .catch(() => {
        setMessage("Invalid or expired token");
        Swal.fire({
          title: "Error!",
          text: "Invalid or expired token, Conatct Administration",
          icon: "error",
        });
        navigate('/contactform');
      });
  }, [token]);

  return (
    <div>
      <Nav />
      <h2 className="py-32 px-16">{message}</h2>
    </div>
  );
};

export default VerifyEmail;
