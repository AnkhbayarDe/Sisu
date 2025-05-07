import React, { useState, useEffect } from "react";
import axios from "axios";
import MapView from "./MapView";

const API_URL = "http://localhost:4000";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/heic",
  "image/heif",
];

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/mpeg",
  "video/3gpp",
  "video/x-ms-wmv",
  "video/x-flv",
];

const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userFiles, setUserFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#f9fafc";
    document.body.style.color = darkMode ? "#f0f0f0" : "#333";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [darkMode]);

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/myfiles`, {
        withCredentials: true,
      });
      setUserFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const isValidFileType = (file) => ACCEPTED_TYPES.includes(file.type);

  const getFileTypeCategory = (fileType) => {
    if (ACCEPTED_IMAGE_TYPES.includes(fileType)) return "зураг";
    if (ACCEPTED_VIDEO_TYPES.includes(fileType)) return "видео";
    return "файл";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        setMessage({ type: "", text: "" });
      } else {
        setFile(null);
        e.target.value = "";
        setMessage({
          type: "error",
          text: `Зөвхөн зураг эсвэл видео файл оруулах боломжтой.`,
        });
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage({ type: "error", text: "Та файл сонгоно уу!" });
      return;
    }

    setIsUploading(true);
    setMessage({ type: "", text: "" });

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
          const fileCategory = getFileTypeCategory(file.type);
          setMessage({
            type: "success",
            text: `${fileCategory} амжилттай орууллаа!`,
          });
          setFile(null);
          document.getElementById("file-input").value = "";
          fetchUserFiles();
        } catch (err) {
          let errorMsg =
            err.response?.data?.message ||
            "Файл оруулахад алдаа гарлаа. Дахин оролдоно уу.";
          setMessage({ type: "error", text: errorMsg });
        } finally {
          setIsUploading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setMessage({
          type: "error",
          text: "Таны байршлыг авах боломжгүй байна. Байршлын зөвшөөрлөө шалгана уу.",
        });
        setIsUploading(false);
      }
    );
  };

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
        <h2 style={styles.title}>Файл оруулах</h2>
        <p>Зөвхөн зураг болон видео файл оруулах боломжтой.</p>
        <div style={styles.fileInputWrapper}>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            style={styles.fileInput}
            accept="image/*,video/*"
          />
          <label
            htmlFor="file-input"
            style={{ ...styles.fileInputLabel, backgroundColor: theme.primary }}
          >
            Файл сонгох
          </label>
          {file && (
            <div style={styles.fileInfo}>
              <span style={styles.fileName}>{file.name}</span>
              <span style={styles.fileType}>
                ({getFileTypeCategory(file.type)})
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          style={{
            ...styles.uploadButton,
            backgroundColor: isUploading
              ? theme.warning
              : file
              ? theme.success
              : theme.disabled,
            cursor: !file ? "not-allowed" : "pointer",
          }}
        >
          {isUploading ? "Оруулж байна..." : "Оруулах"}
        </button>

        {message.text && (
          <div
            style={{
              ...styles.message,
              backgroundColor:
                message.type === "success" ? theme.successBg : theme.errorBg,
              color: message.type === "success" ? theme.success : theme.error,
              border: `1px solid ${
                message.type === "success" ? theme.success : theme.error
              }`,
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      <div style={{ ...styles.mapSection, background: theme.card }}>
        <h3>Файл оруулсан байршил</h3>
        <MapView userFiles={userFiles} />
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
  fileInput: {
    display: "none",
  },
  fileInputWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
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
  message: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    width: "100%",
    maxWidth: "400px",
  },
  successMessage: {
    backgroundColor: "#d5f5e3",
    color: "#27ae60",
    border: "1px solid #2ecc71",
  },
  errorMessage: {
    backgroundColor: "#fadbd8",
    color: "#c0392b",
    border: "1px solid #e74c3c",
  },
  filesSection: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
  },
  subtitle: {
    marginTop: 0,
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginBottom: "15px",
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
