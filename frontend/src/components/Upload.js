import React, { useState, useEffect } from "react";
import axios from "axios";
import MapView from "./MapView";

const API_URL = "http://localhost:4000";

// Define accepted file types
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", 
  "image/svg+xml", "image/tiff", "image/heic", "image/heif"
];

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo",
  "video/x-matroska", "video/mpeg", "video/3gpp", "video/x-ms-wmv", "video/x-flv"
];

const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

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

  const isValidFileType = (file) => {
    return ACCEPTED_TYPES.includes(file.type);
  };

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
        setMessage({ type: '', text: '' });
      } else {
        setFile(null);
        // Reset file input
        e.target.value = '';
        setMessage({ 
          type: 'error', 
          text: `Зөвхөн зураг эсвэл видео файл оруулах боломжтой.` 
        });
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Та файл сонгоно уу!' });
      return;
    }

    if (!isValidFileType(file)) {
      setMessage({ 
        type: 'error', 
        text: `Зөвхөн зураг эсвэл видео файл оруулах боломжтой.` 
      });
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
          
          const fileCategory = getFileTypeCategory(file.type);
          setMessage({ type: 'success', text: `${fileCategory} амжилттай орууллаа!` });
          setFile(null);
          // Reset file input
          document.getElementById('file-input').value = '';
          // Refresh file list
          fetchUserFiles();
        } catch (err) {
          let errorMsg = err.response?.data?.message || 'Файл оруулахад алдаа гарлаа. Дахин оролдоно уу.';
          
          // Handle specific server-side validation errors
          if (err.response?.data?.error === 'invalid_file_type') {
            errorMsg = 'Зөвхөн зураг эсвэл видео файл оруулах боломжтой.';
          }
          
          setMessage({ type: 'error', text: errorMsg });
        } finally {
          setIsUploading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setMessage({ 
          type: 'error', 
          text: 'Таны байршлыг авах боломжгүй байна. Байршлын зөвшөөрлөө шалгана уу.' 
        });
        setIsUploading(false);
      }
    );
  };

  return (
    <div style={styles.container} >
      <div style={styles.uploadSection}>
        <h2 style={styles.title}>Файл оруулах</h2>
        
        <p style={styles.description}>
          Зөвхөн зураг болон видео файл оруулах боломжтой.
        </p>
        
        <div style={styles.fileInputWrapper}>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            style={styles.fileInput}
            accept="image/*,video/*" // HTML5 file input restriction
          />
          <label htmlFor="file-input" style={styles.fileInputLabel}>
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
    flexDirection: "column",
    width: "100%",
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
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Upload;