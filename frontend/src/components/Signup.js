import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.";
    }
    if (!hasLetter) {
      return "Нууц үгэнд дор хаяж 1 үсэг байх ёстой.";
    }
    if (!hasNumber) {
      return "Нууц үгэнд дор хаяж 1 тоо байх ёстой.";
    }
    return "";
  };

  const signup = async () => {
    const validationError = validatePassword(password);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      await axios.post(`${API_URL}/signup`, { email, password });
      setMessage("Амжилттай бүртгэгдлээ!");
    } catch (err) {
      setMessage("Бүртгэхэд алдаа гарлаа.");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
  };

  const boxStyle = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "400px",
    textAlign: "center",

  };

  const inputStyle = {
    width: "93%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #dcdcdc",
    borderRadius: "6px",
    backgroundColor: "#edf2ff",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    marginTop: "1rem",
    backgroundColor: "#212529",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  };

  const messageStyle = {
    marginTop: "1rem",
    color: "#e74c3c",
    fontSize: "0.9rem",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Бүртгүүлэх</h2>
        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={buttonStyle} onClick={signup}>
          Бүртгүүлэх
        </button>
        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
