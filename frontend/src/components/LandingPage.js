import React, { useState } from "react";
import MapView from "./MapView";
import LandingPageExtras from "./LandingPageExtras";

function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleMode = () => setDarkMode(!darkMode);
  const themeStyles = darkMode ? styles.dark : styles.light;

  return (
    <div style={{ ...styles.container, ...themeStyles.container }}>
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={toggleMode}
          style={{
            ...styles.toggleButton,
            color: darkMode ? "#fff" : "#333",
            borderColor: darkMode ? "#ccc" : "#555",
          }}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={styles.topSection}>
        <div style={styles.textContainer}>
          <h1 style={{ ...styles.title, ...themeStyles.title }}>
            Ухаалаг зогсоолын систем
          </h1>
          <p style={{ ...styles.description, ...themeStyles.description }}>
            Таны жолоодлогын туршлагыг хялбарчилж, зогсоол олох асуудлыг мартах цаг ирлээ.
            Манай ухаалаг зогсоолын платформ нь бодит цагийн мэдээлэл, газрын зураг дээрх
            чөлөөт зогсоолыг харуулах боломжийг олгож, таны цагийг хэмнэнэ.
          </p>
        </div>
        <div style={styles.imageContainer}>
          <img
            src="/parking-banner.jpg"
            alt="Smart Parking System"
            style={styles.image}
          />
        </div>
      </div>

      <div style={styles.mapSection}>
        <h2 style={{ ...styles.mapTitle, ...themeStyles.mapTitle }}>
          Чөлөөт зогсоолуудын газрын зураг
        </h2>
        <MapView
          userFiles={[
            {
              _id: "1",
              filename: "Demo Parking 1",
              uploadedAt: new Date(),
              location: { lat: 47.9186, lng: 106.9176 },
            },
            {
              _id: "2",
              filename: "Demo Parking 2",
              uploadedAt: new Date(),
              location: { lat: 47.9200, lng: 106.9200 },
            },
          ]}
          darkMode={darkMode}
        />
      </div>

      <LandingPageExtras darkMode={darkMode} />
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    minHeight: "100vh",
    transition: "background 0.3s, color 0.3s",
  },
  topSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2rem",
    gap: "2rem",
  },
  textContainer: {
    flex: "1 1 400px",
  },
  imageContainer: {
    flex: "1 1 400px",
    textAlign: "center",
  },
  image: {
    maxWidth: "100%",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  mapSection: {
    maxWidth: "900px",
    margin: "3rem auto 0",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
  },
  mapTitle: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  toggleButton: {
    padding: "0.4rem 0.8rem",
    border: "1px solid",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    background: "transparent",
    fontWeight: "bold",
    transition: "color 0.3s, border-color 0.3s",
  },
  light: {
    container: { background: "#f9fafc", color: "#333" },
    title: { color: "#2c3e50" },
    description: { color: "#555" },
    mapTitle: { color: "#2c3e50" },
  },
  dark: {
    container: { background: "#1a1a1a", color: "#f0f0f0" },
    title: { color: "#f0f0f0" },
    description: { color: "#ccc" },
    mapTitle: { color: "#f0f0f0" },
  },
};

export default LandingPage;
