import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Upload from "./components/Upload";
import LandingPage from "./components/LandingPage";
import MapView from "./components/MapView";
import DetectionResult from "./components/DetectionResult";
import AdminPage from "./components/AdminManager"; // Import AdminPage

import "./App.css";
import "leaflet/dist/leaflet.css";

import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = "http://localhost:4000";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return token ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return token ? <Navigate to="/" /> : children;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setToken(null);
      alert("Амжилттай гарлаа!");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Гарахад алдаа гарлаа");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
        if (res.data.userId) {
          setToken("valid");
        }
      } catch (err) {
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  return (
    <div style={styles.fadeIn}>
      <nav style={styles.nav}>
        <div style={styles.logo}>Finding Park Slot</div>
        <div style={styles.linksContainer}>
          {token ? (
            <>
              <Link to="/upload" style={styles.link}>
                Upload
              </Link>
              <Link to="/" style={styles.link}>
                Home
              </Link>
              <Link to="/admin" style={styles.link}>
                Admin
              </Link>
              <button
                onClick={logout}
                style={styles.contactButton}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1abc9c")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a085")}
              >
                Гарах
              </button>
            </>
          ) : (
            <>
              {currentPath !== "/login" && (
                <Link to="/login" style={styles.link}>
                  Нэвтрэх
                </Link>
              )}
              {currentPath !== "/signup" && (
                <Link to="/signup" style={styles.link}>
                  Бүртгүүлэх 
                </Link>
              )}
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/map" element={<MapView />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login setToken={setToken} />
            </PublicRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/detection"
          element={
            <PrivateRoute>
              <DetectionResult token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/upload" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

const styles = {
  fadeIn: {
    animation: "fadeIn 1s",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 40px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  linksContainer: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    color: "#ecf0f1",
    marginRight: "20px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s",
  },
  contactButton: {
    backgroundColor: "#16a085",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.3s",
    marginLeft: "10px",
  },
};

export default App;