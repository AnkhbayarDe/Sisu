import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


const API_URL = "http://localhost:4000";

const MapView = ({ userFiles }) => {
  const [position, setPosition] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user's current position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error", err);
        // Set default position if geolocation fails
        setPosition([51.505, -0.09]);
      }
    );
  }, []);

  // Load files data, either from props or from API
  useEffect(() => {
    if (userFiles && userFiles.length > 0) {
      setFiles(userFiles);
      setLoading(false);
    } else {
      fetchFiles();
    }
  }, [userFiles]);

  // Fetch files from API if not provided through props
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/myfiles`, {
        withCredentials: true
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files for map:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create custom icons for file markers
  const fileIcon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  

  // Loading state
  if (!position || loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p>Газрын зураг ачааллаж байна...</p>
      </div>
    );
  }

  return (
    <div style={styles.mapWrapper}>
      <MapContainer
        center={position}
        zoom={13}
        style={styles.map}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* User's current location */}
        <Marker position={position}>
          <Popup>
            <span style={styles.popupText}>Та энд байна 👋</span>
          </Popup>
        </Marker>
        
        {/* File locations */}
        {files.map((file) => 
          file.location && (
            <Marker 
              key={file._id} 
              position={[file.location.lat, file.location.lng]}
              icon={fileIcon}
            >
              <Popup>
                <div style={styles.filePopup}>
                  <p style={styles.fileName}>{file.filename}</p>
                  <p style={styles.fileDate}>
                    {new Date(file.uploadedAt).toLocaleDateString()} - {new Date(file.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
};

const styles = {
  mapWrapper: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    maxWidth: "900px",
    margin: "0 auto",
  },
  map: {
    height: "400px",
    width: "100%",
  },
  popupText: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  loaderContainer: {
    textAlign: "center",
    padding: "2rem",
  },
  loader: {
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #555",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 1rem",
  },
  filePopup: {
    padding: "5px",
  },
  fileName: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 5px 0",
  },
  fileDate: {
    fontSize: "0.8rem",
    color: "#7f8c8d",
    margin: 0,
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  }
};

export default MapView;