import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Upload from "./components/Upload";
import "./App.css";

import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = "http://localhost:4000";

function App() {
  const [token, setToken] = useState(null);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    return token ? <Navigate to="/upload" /> : children;
  };

  const logout = () => {
    setToken("");
  };

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, {
          withCredentials: true,
        });
        if (res.data.userId) {
          setToken("valid");
        }
      } catch (err) {
        setToken(null);
      }
    };
    checkSession();
  }, []);

  return (
    <div>
      <nav style={styles.nav}>
        <h3 style={styles.title}>Citizen</h3>
        <div>
          {token ? (
            <>
              <Link to="/upload" style={styles.link}>
                Файл оруулах
              </Link>
              <button onClick={logout} style={styles.button}>
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
          path="*"
          element={<Navigate to={token ? "/upload" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 3rem",
    background: "#393E46",
    color: "white",
    alignItems: "center",
  },
  title: {
    margin: 0,
  },
  link: {
    color: "white",
    marginRight: "1rem",
    textDecoration: "none",
    fontWeight: "bold",
    paddingRight: "20px",
  },
  button: {
    background: "white",
    color: "#393E46",
    border: "none",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default App;
