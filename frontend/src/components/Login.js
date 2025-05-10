import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (email === "admin@example.com" && password === "1234") {
      setToken("valid");
      alert("Амжилттай нэвтэрлээ!");
      navigate("/");
    } else {
      alert("Имэйл эсвэл нууц үг буруу байна!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Нэвтрэх</h2>
      <input
        placeholder="Имэйл"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Нууц үг"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={login} style={styles.button}>
        Нэвтрэх
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    textAlign: "center",
    background: "#fff",
  },
  title: {
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
