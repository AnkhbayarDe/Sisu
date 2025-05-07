import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      setToken("valid");
      alert("Амжилттай нэвтэрлээ!");
      navigate("/");
    } catch (err) {
      alert("Нэвтрэхэд алдаа гарлаа");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Нэвтрэх</button>
    </div>
  );
}

export default Login;
