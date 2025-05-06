import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

function Upload({ token }) {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        credentials: "include",
      },
    });
    alert("File uploaded!");
  };

  return (
    <div className="upload-container">
      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload} disabled={!file}>
        Upload
      </button>
    </div>
  );
}

export default Upload;
