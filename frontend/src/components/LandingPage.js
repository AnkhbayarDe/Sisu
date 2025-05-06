import React, { useState } from "react";
import MapView from "./MapView";
import LandingPageExtras from "./LandingPageExtras";

function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleMode = () => setDarkMode(!darkMode);
  const themeStyles = darkMode ? styles.dark : styles.light;

  return (
    <div style={{ ...styles.container, ...themeStyles.container }}>
      {/* Dark Mode toggle товч */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button onClick={toggleMode} style={styles.toggleButton}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Үндсэн контент */}
      <div style={styles.topSection}>
        <div style={styles.textContainer}>
          <h1 style={{ ...styles.title, ...themeStyles.title }}>
            Хүмүүс нэг нэгнээ хамгаалдаг орон зай.
          </h1>
          <p style={{ ...styles.description, ...themeStyles.description }}>
            Аюулгүй, амар тайван амьдрахад зориулагдсан платформ. Энэхүү систем нь таныг болон танай гэр бүл, найз нөхөд,
            оршин буй газрынхаа аюулгүй байдлыг хангахад туслах сүлжээ юм. Газрын зураг дээр өөрийн байршлаа харах,
            бодит цагийн мэдээлэл авах боломжтой.
          </p>
        </div>
        <div style={styles.imageContainer}>
          <img
            src="/ganbat.jpg"
            alt="Safety example"
            style={styles.image}
          />
        </div>
      </div>

      {/* Доод хэсэг - Газрын зураг */}
      <div style={styles.mapSection}>
        <h2 style={{ ...styles.mapTitle, ...themeStyles.mapTitle }}>Таны байршил</h2>
        <MapView />
      </div>

      {/* ✨ Нэмэлт онцлох боломжууд, мессеж, footer */}
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
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    background: "transparent",
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
