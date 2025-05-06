import React, { useState } from "react";
import axios from "axios";
import MapView from "./MapView";

const API_URL = "http://localhost:4000";

function Upload({ token }) {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return alert("No file selected");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lat", position.coords.latitude);
        formData.append("lng", position.coords.longitude);

        try {
          await axios.post(`${API_URL}/upload`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
              credentials: "include",
            },
          });
          alert("File uploaded!");
        } catch (err) {
          console.error(err);
          alert("Upload failed");
        }
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  return (
    <div>
      <div className="upload-container">
        <h2>Upload File</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload} disabled={!file}>
          Upload
        </button>
      </div>
      <div>
        <MapView />
      </div>
    </div>
  );
}

export default Upload;
