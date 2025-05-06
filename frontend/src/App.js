import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [file, setFile] = useState(null);

  const signup = async () => {
    await axios.post(`${API_URL}/signup`, { email, password });
    alert("Signed up!");
  };

  const login = async () => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    setToken(res.data.token);
    alert("Logged in!");
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("File uploaded!");
  };

  return (
    <div>
      <h2>Signup / Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <button onClick={upload} disabled={!token}>
        Upload
      </button>
    </div>
  );
}

export default App;
