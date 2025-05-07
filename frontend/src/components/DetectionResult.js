import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000";

function DetectionResult() {
  const [darkMode, setDarkMode] = useState(true);
  const [detectionData, setDetectionData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // State for image
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#f9fafc";
    document.body.style.color = darkMode ? "#f0f0f0" : "#333";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [darkMode]);

  // Function to fetch image
  // const fetchImage = async () => {
  //   if (location.state?.file?._id) {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/myfiles/${location.state.file._id}`,
  //         { withCredentials: true }
  //       );
  //       // Set the image source as a base64-encoded string
  //       setImageSrc(
  //         `data:${response.data.contentType};base64,${response.data.image}`
  //       );
  //     } catch (error) {
  //       console.error("Error fetching image:", error);
  //     }
  //   }
  // };
  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/myfiles/${location.state.file._id}`,
        { withCredentials: true }
      );
      setImageSrc(response.data);
    } catch (err) {
      console.error("Error fetching image data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetectionData = async () => {
    if (location.state?.file?._id) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/myfiles/${location.state.file._id}`,
          { withCredentials: true }
        );
        setDetectionData(response.data.detectionResults);
        // Fetch the image data
        fetchImage();
      } catch (error) {
        console.error("Error fetching detection data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/upload");
    }
  };

  useEffect(() => {
    if (location.state?.file?._id) {
      fetchDetectionData();
    }
  }, [location.state?.file?._id]);

  const theme = darkMode ? darkStyles : lightStyles;

  return (
    <div
      style={{
        ...styles.container,
        background: theme.background,
        color: theme.text,
      }}
    >
      <div style={{ textAlign: "right", marginBottom: "1rem", width: "100%" }}>
        <button onClick={toggleDarkMode} style={styles.toggleButton}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={{ ...styles.uploadSection, background: theme.card }}>
        <h2 style={styles.title}>Илрүүлэлтийн Үр Дүн</h2>

        {location.state?.file?.filename && (
          <div style={styles.fileInfo}>
            <p>
              <strong>Файл:</strong> {location.state.file.filename}
            </p>
            <p>
              <strong>Төрөл:</strong>{" "}
              {location.state.file.contentType.includes("image")
                ? "зураг"
                : location.state.file.contentType.includes("video")
                ? "видео"
                : "файл"}
            </p>
          </div>
        )}

        {loading ? (
          <p>Илрүүлэлтийн мэдээлэл ачааллаж байна...</p>
        ) : detectionData ? (
          <div style={{ marginTop: "20px" }}>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(detectionData, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Илрүүлэлтийн мэдээлэл байхгүй.</p>
        )}

        {/* Display the image if available */}
        {imageSrc && (
          <div style={{ marginTop: "20px" }}>
            <h3>Зураг:</h3>
            <img
              src={`data:${imageSrc.contentType};base64,${imageSrc.image}`}
              alt={imageSrc.filename}
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}

        <button
          onClick={() => navigate("/upload")}
          style={{
            ...styles.uploadButton,
            backgroundColor: theme.primary,
            marginTop: "20px",
          }}
        >
          Буцах
        </button>
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
    padding: "25px 0",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
    flexDirection: "column",
    width: "100%",
  },
  fileInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10px",
  },
  fileName: {
    fontWeight: 500,
    color: "#2c3e50",
    wordBreak: "break-all",
  },
  fileType: {
    color: "#7f8c8d",
    fontSize: "0.9rem",
    marginTop: "5px",
  },
  uploadButton: {
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "6px",
    transition: "background-color 0.3s",
    fontWeight: 500,
  },
  errorMessage: {
    backgroundColor: "#fadbd8",
    color: "#c0392b",
    border: "1px solid #e74c3c",
    padding: "12px",
    borderRadius: "6px",
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

export default DetectionResult;
