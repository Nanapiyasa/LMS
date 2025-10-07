import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, user, userData } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = useMemo(() => (location.state?.from?.pathname) || '/', [location.state]);

  useEffect(() => {
    if (user) {
      // If already authenticated, redirect to intended or role-based dashboard
      const role = userData?.role || 'student';
      const roleHome = role === 'teacher' ? '/teacher' : role === 'parent' ? '/parent' : role === 'admin' ? '/admin' : '/student';
      navigate(location.state?.from ? from : roleHome, { replace: true });
    }
  }, [user, userData, from, navigate, location.state]);

  useEffect(() => {
    // Extract dominant color from logo to theme the UI
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = new URL('../assets/logo.png', import.meta.url).href;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = 64;
        const h = 64;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 128) continue; // skip mostly transparent
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          const primary = `rgb(${r}, ${g}, ${b})`;
          // create a darker secondary for gradient depth
          const darken = (v, pct) => Math.max(0, Math.min(255, Math.round(v * (1 - pct))));
          const r2 = darken(r, 0.25);
          const g2 = darken(g, 0.25);
          const b2 = darken(b, 0.25);
          const secondary = `rgb(${r2}, ${g2}, ${b2})`;
          const root = document.documentElement;
          root.style.setProperty('--brand-1', primary);
          root.style.setProperty('--brand-2', secondary);
          root.style.setProperty('--brand-1-strong', primary);
          root.style.setProperty('--brand-1-weak', `rgba(${r}, ${g}, ${b}, 0.15)`);
        }
      } catch (_) {
        // noop on failure; defaults remain
      }
    };
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const date = now.getDate();
      const dateString = `${dayName}, ${monthName} ${date}`;

      const timeEl = document.getElementById('login-time');
      const dateEl = document.getElementById('login-date');
      if (timeEl) timeEl.textContent = timeString;
      if (dateEl) dateEl.textContent = dateString;
    };

    updateDateTime();
    const t = setInterval(updateDateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { error: signInError } = await login(email, password);
      if (signInError) {
        setError(signInError.message || 'Failed to sign in');
        return;
      }
      // Redirect will be handled by auth listener, but as a fallback:
      const role = userData?.role || 'student';
      const roleHome = role === 'teacher' ? '/teacher' : role === 'parent' ? '/parent' : role === 'admin' ? '/admin' : '/student';
      navigate(location.state?.from ? from : roleHome, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="decorative-global" aria-hidden="true">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="plus">+</div>
        <div className="plus">+</div>
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="wave-pattern">
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
        </div>
      </div>

      <div className="container">
        <div className="left-panel">
          <div className="brand-center">
            <img src={new URL('../assets/logo.png', import.meta.url).href} alt="Logo" className="brand-image" />
          </div>
            
          <div className="content">
            {/* <div className="logo">Welcome back!</div> */}
                {/* <h1>Welcome back!</h1> */}
            {/* <p className="subtitle">Please sign in to access with your existing account.</p> */}
            </div>

          <div className="datetime-display">
            <div className="time" id="login-time">12:00</div>
            <div className="date" id="login-date">Monday, January 1</div>
            </div>
        </div>

        <div className="right-panel">
          <div className="form-container">
                <h2>Sign In</h2>

            {error ? (
              <div className="alert alert-error" role="alert">{error}</div>
            ) : null}

            <form onSubmit={onSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username or email</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
                    </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                    </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
                </form>
            </div>
        </div>
    </div>
    </div>
  );
}