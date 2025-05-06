import React from "react";

function LandingPage() {
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Хүмүүс нэг нэгнээ хамгаалдаг орон зай.</h1>
        <p style={styles.description}>
          Аюулгүй, амар тайван амьдрахад зориулагдсан платформ. Citizen нь таныг болон танай гэр бүл, найз нөхөд, оршин буй
          газрынхаа аюулгүй байдлыг хангахад туслах сүлжээ юм. Апп-аар дамжуулан бодит цагийн мэдээлэл хүлээн авах,
          яаралтай тусламж дуудах, эрсдэлээс урьдчилан сэргийлэх, хайртай хүмүүсээ хянах боломжтой.
        </p>
      </div>
      <div style={styles.imageContainer}>
        <img
          src="/ganbat.jpg" // public хавтсанд banner.jpg хийнэ
          alt="Safety example"
          style={styles.image}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "4rem",
    background: "#f9fafc",
    color: "#333",
    minHeight: "100vh",
  },
  textContainer: {
    flex: "1 1 400px",
    paddingRight: "2rem",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  description: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
    color: "#555",
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
};

export default LandingPage;
