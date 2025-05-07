import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Имэйл хаяг буруу байна.";
    }
    if (!/@gmail\.com$/.test(email)) {
      return "Зөвхөн gmail хаяг ашиглах ёстой.";
    }
    return "";
  };

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
    const emailError = validateEmail(email);
    if (emailError) {
      setMessage(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    try {
      await axios.post(`${API_URL}/signup`, { email, password });
      setMessage("Амжилттай бүртгэгдлээ!");
    } catch (err) {
      setMessage("Бүртгэхэд алдаа гарлаа.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Бүртгүүлэх</h2>
      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={styles.button} onClick={signup}>
        Бүртгүүлэх
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#f9fafc",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    color: "#e74c3c",
    fontWeight: "bold",
  },
};

export default Signup;
