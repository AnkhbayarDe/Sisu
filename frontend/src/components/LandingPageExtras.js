import React from "react";
import { useNavigate } from "react-router-dom";

const demoImages = [
  { src: "/parking1.jpg", alt: "Чөлөөт зогсоол 1" },
  { src: "/parking2.jpg", alt: "Чөлөөт зогсоол 2" },
  { src: "/parking3.jpg", alt: "Чөлөөт зогсоол 3" },
];

const FeatureCard = ({ icon, title, description, darkMode, onClick }) => (
  <div
    style={{
      ...styles.card,
      background: darkMode ? "#2a2a2a" : "#fff",
      color: darkMode ? "#f0f0f0" : "#333",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.3s, box-shadow 0.3s",
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    }}
  >
    <div style={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPageExtras = ({ darkMode }) => {
  const navigate = useNavigate();
  const theme = darkMode ? styles.dark : styles.light;
  const icons = darkMode ? ["🚗", "🗺️", "📍", "📊"] : ["🚙", "🌍", "🅿️", "📈"];

  return (
    <div style={{ ...styles.extrasContainer, background: theme.background, color: theme.color }}>
      <h2 style={styles.sectionTitle}>Манай системийн онцлох боломжууд</h2>
      <div style={styles.cardContainer}>
        <FeatureCard
          icon={icons[0]}
          title="Чөлөөт зогсоол илрүүлэх"
          description="Бодит цагийн чөлөөт зогсоолуудыг автоматаар илрүүлж харуулах."
          darkMode={darkMode}
          onClick={() => navigate("/upload")}
        />
        <FeatureCard
          icon={icons[1]}
          title="Газрын зураг үзэх"
          description="Хотын газрын зураг дээр чөлөөт болон завгүй зогсоолуудыг харуулах."
          darkMode={darkMode}
        />
        <FeatureCard
          icon={icons[2]}
          title="Зогсоол тэмдэглэх"
          description="Өөрийн байршлыг тэмдэглэж, хадгалах боломж."
          darkMode={darkMode}
        />
        <FeatureCard
          icon={icons[3]}
          title="Хэрэглэгчийн хяналт"
          description="Зогсоолын статистик, хэрэглэгчийн тайлан харуулах."
          darkMode={darkMode}
        />
      </div>

      <h2 style={styles.sectionTitle}>Жишээ зогсоолууд</h2>
      <div style={styles.imageGrid}>
        {demoImages.map((image, index) => (
          <div key={index} style={styles.demoItem}>
            <img src={image.src} alt={image.alt} style={styles.demoImage} />
            <p>{image.alt}</p>
          </div>
        ))}
      </div>

      <footer style={{ ...styles.footer, color: theme.color }}>
        © 2025 Ухаалаг Зогсоолын Систем | 📧{" "}
        <a href="mailto:info@parkingsystem.mn" style={{ color: theme.color }}>
          info@parkingsystem.mn
        </a>
      </footer>
    </div>
  );
};

const styles = {
  extrasContainer: {
    padding: "2rem",
    textAlign: "center",
    transition: "background 0.3s, color 0.3s",
  },
  sectionTitle: {
    fontSize: "2rem",
    margin: "2rem 0 1rem",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "220px",
    flex: "1 1 200px",
  },
  icon: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  imageGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },
  demoItem: {
    textAlign: "center",
  },
  demoImage: {
    width: "300px",
    height: "180px",
    borderRadius: "8px",
    objectFit: "cover",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    marginBottom: "0.5rem",
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.9rem",
  },
  light: {
    background: "#f9fafc",
    color: "#333",
  },
  dark: {
    background: "#1a1a1a",
    color: "#f0f0f0",
  },
};

export default LandingPageExtras;
