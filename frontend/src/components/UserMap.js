// src/components/UserMap.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const API_URL = "http://localhost:4000"; // change if needed

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const SetViewToUser = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position]);
  return null;
};

const UserMap = ({ token }) => {
  const [markers, setMarkers] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    // Get user's current position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setUserPosition([47.9222, 106.9057]); // Default Ulaanbaatar
      }
    );

    // Fetch user's uploaded files with location
    axios
      .get(`${API_URL}/files/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMarkers(res.data); // each marker has: { filename, location: { lat, lng }, uploadedAt }
      })
      .catch((err) => {
        console.error("Error fetching file locations:", err);
      });
  }, [token]);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer
        center={[47.9222, 106.9057]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPosition && <SetViewToUser position={userPosition} />}
        {markers.map((file, idx) => (
          <Marker key={idx} position={[file.location.lat, file.location.lng]}>
            <Popup>
              <strong>{file.filename}</strong>
              <br />
              {new Date(file.uploadedAt).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default UserMap;
