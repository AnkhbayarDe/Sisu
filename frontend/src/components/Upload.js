import React, { useState, useEffect } from "react";
import axios from "axios";
import MapView from "./MapView";

const API_URL = "http://localhost:4000";

function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userFiles, setUserFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // dark mode-оор эхлэх

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#f9fafc";
    document.body.style.color = darkMode ? "#f0f0f0" : "#333";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [darkMode]);
  
  const fetchUserFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/myfiles`, { withCredentials: true });
      setUserFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Та файл сонгоно уу!' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lat", position.coords.latitude);
        formData.append("lng", position.coords.longitude);

        try {
          await axios.post(`${API_URL}/upload`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });

          setMessage({ type: 'success', text: 'Файл амжилттай оруулагдлаа!' });
          setFile(null);
          document.getElementById('file-input').value = '';
          fetchUserFiles();
        } catch (err) {
          setMessage({
            type: 'error',
            text: err.response?.data?.message || 'Файл оруулахад алдаа гарлаа. Дахин оролдоно уу.',
          });
        } finally {
          setIsUploading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setMessage({
          type: 'error',
          text: 'Таны байршлыг авах боломжгүй байна. Байршил зөвшөөрлөө шалгана уу.',
        });
        setIsUploading(false);
      }
    );
  };

  const theme = darkMode ? darkStyles : lightStyles;

  return (
    <div style={{ ...styles.container, background: theme.background, color: theme.text }}>
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            ...styles.toggleButton,
            background: darkMode ? "#f0f0f0" : "#333",
            color: darkMode ? "#333" : "#f0f0f0",
          }}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={{ ...styles.uploadSection, background: theme.card, color: theme.text }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Файл оруулах</h2>

        <div style={styles.fileInputWrapper}>
          <input type="file" id="file-input" onChange={handleFileChange} style={styles.fileInput} />
          <label htmlFor="file-input" style={{ ...styles.fileInputLabel, backgroundColor: theme.primary }}>
            Файл сонгох
          </label>
          {file && <span style={styles.fileName}>{file.name}</span>}
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          style={{
            ...styles.uploadButton,
            backgroundColor: isUploading ? theme.warning : file ? theme.success : theme.disabled,
            cursor: !file ? "not-allowed" : "pointer",
          }}
        >
          {isUploading ? 'Оруулж байна...' : 'Оруулах'}
        </button>

        {message.text && (
          <div
            style={{
              ...styles.message,
              backgroundColor: message.type === 'success' ? theme.successBg : theme.errorBg,
              color: message.type === 'success' ? theme.success : theme.error,
              border: `1px solid ${message.type === 'success' ? theme.success : theme.error}`,
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      <div style={{ ...styles.mapSection, background: theme.card, color: theme.text }}>
        <h3 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>Файл оруулсан байршил</h3>
        <div style={{ borderRadius: "12px", overflow: "hidden" }}>
          <MapView userFiles={userFiles} />
        </div>
      </div>
    </div>
  );
}

const lightStyles = {
  background: "#f9fafc",
  text: "#333",
  card: "#fff",
  primary: "#3498db",
  success: "#2ecc71",
  warning: "#f39c12",
  error: "#c0392b",
  disabled: "#bdc3c7",
  successBg: "#d5f5e3",
  errorBg: "#fadbd8",
};

const darkStyles = {
  background: "#1a1a1a",
  text: "#f0f0f0",
  card: "#2a2a2a",
  primary: "#2980b9",
  success: "#27ae60",
  warning: "#f1c40f",
  error: "#e74c3c",
  disabled: "#7f8c8d",
  successBg: "#145a32",
  errorBg: "#922b21",
};

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
  uploadSection: {
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  fileInputWrapper: { display: "flex", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" },
  fileInput: { display: "none" },
  fileInputLabel: {
    color: "white",
    padding: "12px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    marginBottom: "10px",
    transition: "background-color 0.3s",
  },
  fileName: { fontWeight: 500, wordBreak: "break-all", marginLeft: "10px" },
  uploadButton: {
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "6px",
    transition: "background-color 0.3s",
    fontWeight: 500,
  },
  message: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    maxWidth: "400px",
  },
  mapSection: {
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  toggleButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s, color 0.3s",
  },
};

export default Upload;
