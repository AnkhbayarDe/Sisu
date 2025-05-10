import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Routing from "./Routing";

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

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearestFreeParking = (userPos, parkings) => {
  const freeParkings = parkings.filter((p) => p.status === "free");
  let nearest = null;
  let minDistance = Infinity;

  freeParkings.forEach((p) => {
    const dist = getDistance(userPos[0], userPos[1], p.lat, p.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = p;
    }
  });

  return nearest;
};

const MapView = () => {
  const [position, setPosition] = useState([47.9186, 106.9176]);
  const [radius, setRadius] = useState(50);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Geolocation алдаа:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    const interval = setInterval(() => {
      setRadius((prev) => (prev >= 200 ? 50 : prev + 15));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDrawRoute = () => {
    const nearest = findNearestFreeParking(position, demoParkings);
    if (nearest) {
      setRoute([nearest.lat, nearest.lng]);
    } else {
      alert("Ойрхон сул зогсоол олдсонгүй.");
    }
  };

  return (
    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "900px", margin: "0 auto" }}>
      <button
        onClick={handleDrawRoute}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#0066ff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Ойрхон сул зогсоол руу
      </button>

      <MapContainer center={position} zoom={15} style={{ height: "1000px", width: "200%" }}>
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
        />


        <Circle
          center={position}
          radius={radius}
          pathOptions={{ color: "lime", fillColor: "lime", fillOpacity: 0.15 }}
        />
        <Marker position={position}>
          <Tooltip direction="top" offset={[0, -20]} permanent>
            <span style={styles.myLocation}>Та энд байна 👋</span>
          </Tooltip>
        </Marker>

        {demoParkings.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={15}
            color={statusColors[p.status]}
            fillOpacity={0.8}
          >
            <Tooltip direction="top" offset={[0, -20]} permanent>
              <span style={{ ...styles.tag, backgroundColor: statusColors[p.status] }}>
                {p.status === "free"
                  ? `${p.count} сул`
                  : p.status === "closed"
                  ? "Хаалттай"
                  : "Дүүрсэн"}
              </span>
            </Tooltip>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <h4>Зогсоол #{p.id}</h4>
                <img
                  src={p.image}
                  alt={`Parking ${p.id}`}
                  style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "8px", marginBottom: "5px" }}
                />
                <p>Статус: {p.status === "free" ? "Сул" : p.status === "closed" ? "Хаалттай" : "Дүүрсэн"}</p>
                <p>Сул суудал: {p.count}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {route && <Routing from={position} to={route} />}
      </MapContainer>
    </div>
  );
};

const styles = {
  tag: {
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
  },
  myLocation: {
    backgroundColor: "#0066ff",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

export default MapView;
