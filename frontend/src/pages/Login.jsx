import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseConfig";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data?.user) {
        // Navigate to root; App.jsx will pick up session and route by role
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="decor-1"></div>
        <div className="decor-2"></div>
        <div className="decor-3"></div>
        <div className="hero">
          <div>
            <h1 className="hero-title">WELCOME</h1>
            <h2 className="hero-subtitle">Nanapiyasa</h2>
            <LogoSlider />
            <p className="hero-text">
              Access your personalized learning dashboard, track progress, and continue your educational journey with our comprehensive learning management system.
            </p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h3 className="login-title">Sign in</h3>
            <p className="login-subtitle">Enter your email and password to access your account</p>
          </div>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          <div>
            <div className="form-field">
              <label className="form-label">User Name</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button onClick={handleLogin} className="submit-button">Sign In</button>
          </div>

          <div className="login-footer">
            <p>
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </div>

          <div className="mobile-welcome">
            <h2 className="login-title" style={{ fontSize: 18 }}>Welcome to Your Learning Platform</h2>
            <p className="login-subtitle">Access your personalized dashboard and continue learning</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoSlider() {
  const images = useMemo(() => [
    "/logo.png",
    "/logo2.jpeg",
    "/vite.svg",
  ], []);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="hero-logo-slider" aria-label="logo carousel">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Logo"
          className={i === index ? "active" : ""}
          onError={(e) => {
            const el = e.currentTarget;
            const triedStr = el.getAttribute("data-tried") || "0";
            const tried = parseInt(triedStr, 10) || 0;
            const base = src.replace(/\.(png|jpe?g|svg)$/i, "");
            const fallbacks = [`${base}.jpg`, `${base}.png`, "/vite.svg"]; 
            if (tried < fallbacks.length) {
              el.setAttribute("data-tried", String(tried + 1));
              el.src = fallbacks[tried];
            } else {
              el.style.display = "none";
            }
          }}
        />
      ))}
    </div>
  );
}