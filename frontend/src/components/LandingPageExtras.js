import React from "react";

const demoImages = [
  { src: "/demo1.jpg", alt: "Зураг 1" },
  { src: "/demo2.jpg", alt: "Зураг 2" },
  { src: "/demo3.jpg", alt: "Зураг 3" },
];

const FeatureCard = ({ icon, title, description, darkMode }) => (
  <div style={{
    ...styles.card,
    background: darkMode ? "#2a2a2a" : "#fff",
    color: darkMode ? "#f0f0f0" : "#333",
  }}>
    <div style={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPageExtras = ({ darkMode }) => {
  const theme = darkMode ? styles.dark : styles.light;
  const icons = darkMode ? ["📷", "🧿", "🌌", "⚡"] : ["📸", "🔴", "🌍", "✅"];

  return (
    <div style={{ ...styles.extrasContainer, background: theme.background, color: theme.color }}>
      <h2 style={styles.sectionTitle}>Манай системийн онцлох боломжууд</h2>
      <div style={styles.cardContainer}>
        <FeatureCard
          icon={icons[0]}
          title="Зураг, бичлэг илгээх"
          description="Тулгарсан асуудлаа зураг, бичлэгээр илгээх."
          darkMode={darkMode}
        />
        <FeatureCard
          icon={icons[1]}
          title="Шууд дамжуулалт"
          description="Онцгой байдлыг live дамжуулах."
          darkMode={darkMode}
        />
        <FeatureCard
          icon={icons[2]}
          title="Газрын зураг тэмдэглэгээ"
          description="Аюултай газрыг газрын зураг дээр тэмдэглэх."
          darkMode={darkMode}
        />
        <FeatureCard
          icon={icons[3]}
          title="Хуурамч мэдээлэл шалгах"
          description="Fact-check хийж баталгаажуулах."
          darkMode={darkMode}
        />
      </div>

      <h2 style={styles.sectionTitle}>Зурагнууд</h2>
      <div style={styles.imageGrid}>
        {demoImages.map((image, index) => (
          <div key={index} style={styles.demoItem}>
            <img src={image.src} alt={image.alt} style={styles.demoImage} />
            <p>{image.alt}</p>
          </div>
        ))}
      </div>

      <footer style={{ ...styles.footer, color: theme.color }}>
        © 2025 Манай Баг | 📧 <a href="mailto:info@project.mn" style={{ color: theme.color }}>info@project.mn</a>
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
    transition: "background 0.3s, color 0.3s",
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
