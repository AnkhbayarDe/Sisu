import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API_URL = "http://localhost:4000"; // Replace with your backend API URL

const AdminManager = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarker, setNewMarker] = useState(null);

  useEffect(() => {
    // Fetch existing markers from the backend
    axios
      .get(`${API_URL}/admin/markers`)
      .then((response) => setMarkers(response.data))
      .catch((error) => console.error("Error fetching markers:", error));
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setNewMarker({ lat, lng, description: "" });
  };

  const handleSaveMarker = () => {
    if (newMarker) {
      axios
        .post(`${API_URL}/admin/markers`, newMarker)
        .then((response) => {
          setMarkers([...markers, response.data]);
          setNewMarker(null);
        })
        .catch((error) => console.error("Error saving marker:", error));
    }
  };

  const handleUpdateMarker = (updatedMarker) => {
    axios
      .put(`${API_URL}/admin/markers/${updatedMarker.id}`, updatedMarker)
      .then(() => {
        setMarkers((prevMarkers) =>
          prevMarkers.map((marker) =>
            marker.id === updatedMarker.id ? updatedMarker : marker
          )
        );
        setSelectedMarker(null);
      })
      .catch((error) => console.error("Error updating marker:", error));
  };

  const handleDeleteMarker = (markerId) => {
    axios
      .delete(`${API_URL}/admin/markers/${markerId}`)
      .then(() => {
        setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== markerId));
      })
      .catch((error) => console.error("Error deleting marker:", error));
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer
        center={[47.9186, 106.9176]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          map.on("click", handleMapClick);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          >
            <Popup>
              <div>
                <p>{marker.description}</p>
                <button onClick={() => handleDeleteMarker(marker.id)}>Delete</button>
              </div>
            </Popup>
          </Marker>
        ))}

        {newMarker && (
          <Marker position={[newMarker.lat, newMarker.lng]}>
            <Popup>
              <div>
                <textarea
                  placeholder="Enter description"
                  value={newMarker.description}
                  onChange={(e) =>
                    setNewMarker({ ...newMarker, description: e.target.value })
                  }
                />
                <button onClick={handleSaveMarker}>Save</button>
              </div>
            </Popup>
          </Marker>
        )}

        {selectedMarker && (
          <Popup
            position={[selectedMarker.lat, selectedMarker.lng]}
            onClose={() => setSelectedMarker(null)}
          >
            <div>
              <textarea
                value={selectedMarker.description}
                onChange={(e) =>
                  setSelectedMarker({ ...selectedMarker, description: e.target.value })
                }
              />
              <button onClick={() => handleUpdateMarker(selectedMarker)}>Update</button>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default AdminManager;