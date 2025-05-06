import React, { useState, useEffect } from "react";
import axios from "axios";
import MapView from "./MapView";

const API_URL = "http://localhost:4000";

function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userFiles, setUserFiles] = useState([]);

  // Fetch user's files on component mount
  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/myfiles`, {
        withCredentials: true
      });
      setUserFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      // Clear any previous messages
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
    
    // Request user's location and upload file
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lat", position.coords.latitude);
        formData.append("lng", position.coords.longitude);

        try {
          await axios.post(`${API_URL}/upload`, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          setMessage({ type: 'success', text: 'Файл амжилттай оруулагдлаа!' });
          setFile(null);
          // Reset file input
          document.getElementById('file-input').value = '';
          // Refresh file list
          fetchUserFiles();
        } catch (err) {
          setMessage({ 
            type: 'error', 
            text: err.response?.data?.message || 'Файл оруулахад алдаа гарлаа. Дахин оролдоно уу.' 
          });
        } finally {
          setIsUploading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setMessage({ 
          type: 'error', 
          text: 'Таны байршлыг авах боломжгүй байна. Байршил зөвшөөрлөө шалгана уу.' 
        });
        setIsUploading(false);
      }
    );
  };

  return (
    <div style={styles.container} >
      <div style={styles.uploadSection}>
        <h2 style={styles.title}>Файл оруулах</h2>
        
        
        <div style={styles.fileInputWrapper}>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <label htmlFor="file-input" style={styles.fileInputLabel}>
            Файл сонгох
          </label>
          {file && <span style={styles.fileName}>{file.name}</span>}
        </div>
        
        <button 
          onClick={handleUpload} 
          disabled={isUploading || !file}
          style={{
            ...styles.uploadButton,
            ...(isUploading ? styles.uploadingButton : {}),
            ...(!file ? styles.disabledButton : {})
          }}
        >
          {isUploading ? 'Оруулж байна...' : 'Оруулах'}
        </button>
        
        {message.text && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.successMessage : {}),
            ...(message.type === 'error' ? styles.errorMessage : {})
          }}>
            {message.text}
          </div>
        )}
      </div>


      <div style={styles.mapSection}>
        <h3 style={styles.subtitle}>Файл оруулсан байршил</h3>
        <MapView userFiles={userFiles} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  uploadSection: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
    display: "flex",           
    flexDirection: "column",   
    alignItems: "center",       
    textAlign: "center",        
  },
  title: {
    marginTop: 0,
    color: "#2c3e50",
    fontSize: "1.8rem",
  },
  description: {
    color: "#7f8c8d",
    marginBottom: "20px",
  },
  fileInputWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  fileInput: {
    display: "none",
  },
  fileInputLabel: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    display: "inline-block",
    transition: "background-color 0.3s",
    marginBottom: "10px",
  },
  fileName: {
    fontWeight: 500,
    color: "#2c3e50",
    wordBreak: "break-all",
  },
  uploadButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontWeight: 500,
  },
  uploadingButton: {
    backgroundColor: "#f39c12",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
    cursor: "not-allowed",
  },
  message: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
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
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    textAlign: "left",
    padding: "12px 15px",
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #dee2e6",
    color: "#2c3e50",
  },
  tableRow: {
    borderBottom: "1px solid #dee2e6",
  },
  tableCell: {
    padding: "12px 15px",
    color: "#34495e",
  },
  mapSection: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Upload;