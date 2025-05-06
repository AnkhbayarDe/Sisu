import React from "react";

const FeatureCard = ({ icon, title, description, darkMode }) => (
  <div style={{ 
    ...styles.card, 
    background: darkMode ? "#2a2a2a" : "#fff", 
    color: darkMode ? "#f0f0f0" : "#333" 
  }}>
    <div style={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPageExtras = ({ darkMode }) => {
  const theme = darkMode ? styles.dark : styles.light;

  return (
    <div style={{ ...styles.extrasContainer, background: theme.background, color: theme.color }}>
      <h2 style={styles.sectionTitle}>Манай системийн онцлох боломжууд</h2>
      <div style={styles.cardContainer}>
        <FeatureCard
          icon="📸"
          title="Зураг, бичлэг илгээх"
          description="Тулгарсан асуудлаа зураг, бичлэгээр илгээх."
          darkMode={darkMode}
        />
        <FeatureCard
          icon="🔴"
          title="Шууд дамжуулалт"
          description="Онцгой байдлыг live дамжуулах."
          darkMode={darkMode}
        />
        <FeatureCard
          icon="🌍"
          title="Газрын зураг тэмдэглэгээ"
          description="Аюултай газрыг газрын зураг дээр тэмдэглэх."
          darkMode={darkMode}
        />
        <FeatureCard
          icon="✅"
          title="Хуурамч мэдээлэл шалгах"
          description="Fact-check хийж баталгаажуулах."
          darkMode={darkMode}
        />
      </div>

      <h2 style={styles.sectionTitle}>ллр зургууд</h2>
      <div style={styles.imageSlider}>
        <div style={styles.demoItem}>
          <img src="/ganbat1.jpg" alt="Demo 1" style={styles.demoImage} />
          <p>Demo 1</p>
        </div>
        <div style={styles.demoItem}>
          <img src="/ganbat2.jpg" alt="Demo 2" style={styles.demoImage} />
          <p>Demo 2</p>
        </div>
        <div style={styles.demoItem}>
          <img src="/ganbat3.jpg" alt="Demo 3" style={styles.demoImage} />
          <p>Demo 3</p>
        </div>
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
  imageSlider: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  demoItem: {
    textAlign: "center",
  },
  demoImage: {
    width: "200px",
    height: "120px",
    borderRadius: "8px",
    objectFit: "cover",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
