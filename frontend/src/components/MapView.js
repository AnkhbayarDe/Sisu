import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error", err);
      }
    );
  }, []);

  if (!position)
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p>Газрын зураг ачааллаж байна...</p>
      </div>
    );

  return (
    <div style={styles.mapWrapper}>
      <MapContainer
        center={position}
        zoom={13}
        style={styles.map}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            <span style={styles.popupText}>Та энд байна 👋</span>
          </Popup>
        </Marker>
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
};

export default MapView;
