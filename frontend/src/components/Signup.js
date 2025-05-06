import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await axios.post(
        `${API_URL}/signup`,
        { email, password },
        { withCredentials: true }
      );
      alert("Амжилттай бүртгэгдлээ!");
      navigate("/login");
    } catch (err) {
      alert("Бүртгэхэд алдаа гарлаа.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signup}>Бүртгүүлэх</button>
    </div>
  );
}

export default Signup;
