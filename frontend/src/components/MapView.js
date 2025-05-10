import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const statusColors = {
  free: "green",
  closed: "red",
  full: "gray",
};

const demoParkings = [
  { id: 1, lat: 47.9186, lng: 106.9176, status: "free", count: 74 },
  { id: 2, lat: 47.9200, lng: 106.9200, status: "closed", count: 0 },
  { id: 3, lat: 47.9150, lng: 106.9150, status: "full", count: 0 },
  { id: 4, lat: 47.9220, lng: 106.9180, status: "free", count: 228 },
  { id: 5, lat: 47.923493, lng: 106.930035, status: "free", count: 0 },
];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
  const [position, setPosition] = useState([47.9186, 106.9176]);
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("Geolocation failed, using default.")
    );

    // Radar анимэйшн (цикль)
    const interval = setInterval(() => {
      setRadius((prev) => (prev >= 300 ? 50 : prev + 10));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "900px", margin: "0 auto" }}>
      <MapContainer center={position} zoom={14} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />
        {/* Radar анимэйшн */}
        <Circle
          center={position}
          radius={radius}
          pathOptions={{ color: "lime", fillColor: "lime", fillOpacity: 0.2 }}
        />
        <Marker position={position}>
          <Tooltip direction="top" offset={[0, -10]} permanent>
            Та энд байна 👋
          </Tooltip>
        </Marker>

        {demoParkings.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={20}
            color={statusColors[p.status]}
            fillOpacity={0.8}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent>
              <strong>
                {p.status === "free"
                  ? `${p.count} сул`
                  : p.status === "closed"
                  ? "Хаалттай"
                  : "Дүүрсэн"}
              </strong>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
