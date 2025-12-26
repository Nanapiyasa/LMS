import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Change when deploying

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, loading: authLoading, user } = useAuth();

  const [mode, setMode] = useState('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [initials, setInitials] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [username, setUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = useMemo(() => (location.state?.from?.pathname) || '/', [location.state]);

  // Redirect after login (no role check - fixed to /teacher as default)
  useEffect(() => {
    if (user) {
      navigate(location.state?.from ? from : '/teacher', { replace: true });
    }
  }, [user, from, navigate, location.state]);

  // Logo color extraction
  useEffect(() => {
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
          if (data[i + 3] < 128) continue;
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
      } catch (_) {}
    };
  }, []);

  // Live clock - only in login mode
  useEffect(() => {
    if (mode !== 'login') return;

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
  }, [mode]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Real login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      if (authLogin) {
        authLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real signup - sends all fields (including username, no role)
  const handleSignup = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // Convert profile picture to base64 (if selected)
      let image_base64 = null;
      if (profilePic) {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = () => {
            image_base64 = reader.result.split(',')[1]; // remove data:url prefix
            resolve();
          };
          reader.readAsDataURL(profilePic);
        });
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initials: initials.trim() || null,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          image_base64,
          address: address.trim() || null,
          mobile_no: mobile.trim(),
          email: signupEmail.trim(),
          username: username.trim(),
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success! Auto-login
      localStorage.setItem('token', data.token);
      if (authLogin) {
        authLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAndNext = (requiredFields, nextMode) => {
    const missing = requiredFields.filter(field => !field.value.trim());
    if (missing.length > 0) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    setMode(nextMode);
  };

  const goBack = () => {
    setError('');
    if (mode === 'signup-step2') setMode('signup-step1');
    else if (mode === 'signup-step3') setMode('signup-step2');
    else if (mode === 'signup-step4') setMode('signup-step3');
    else setMode('login');
  };

  const isSignupMode = mode.startsWith('signup');

  return (
    <div className="login-wrapper">
      <div className="decorative-global" aria-hidden="true">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="plus">+</div>
        <div className="plus">+</div>
        <div className="dots">
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        </div>
        <div className="wave-pattern">
          <div className="wave-line"></div><div className="wave-line"></div>
          <div className="wave-line"></div><div className="wave-line"></div>
        </div>
      </div>

      <div className={`container ${isSignupMode ? 'full-width' : ''}`}>
        {!isSignupMode && (
          <div className="left-panel">
            <div className="brand-center">
              <img src={new URL('../assets/logo.png', import.meta.url).href} alt="Logo" className="brand-image" />
            </div>

            <div className="content"></div>

            <div className="datetime-display">
              <div className="time" id="login-time">12:00</div>
              <div className="date" id="login-date">Monday, January 1</div>
            </div>
          </div>
        )}

        <div className={`right-panel ${isSignupMode ? 'full-width-panel' : ''}`}>
          <div className="form-container">
            <h2>
              {mode === 'login' && 'Sign In'}
              {mode === 'signup-step1' && 'Create Account'}
              {mode === 'signup-step2' && 'Your Name'}
              {mode === 'signup-step3' && 'Contact Details'}
              {mode === 'signup-step4' && 'Account Credentials'}
            </h2>

            {isSignupMode && (
              <div className="progress-indicator">
                <span className={mode === 'signup-step1' ? 'active' : 'complete'}>1</span>
                <span className="line"></span>
                <span className={mode === 'signup-step2' ? 'active' : (['signup-step3', 'signup-step4'].includes(mode) ? 'complete' : '')}>2</span>
                <span className="line"></span>
                <span className={mode === 'signup-step3' ? 'active' : (mode === 'signup-step4' ? 'complete' : '')}>3</span>
                <span className="line"></span>
                <span className={mode === 'signup-step4' ? 'active' : ''}>4</span>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            {/* Sign In */}
            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="input-group underline">
                  <label>Email</label>
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>

                <div className="input-group underline">
                  <label>Password</label>
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <div className="button-row">
                  <button type="submit" className="btn-primary" disabled={isSubmitting || authLoading}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setMode('signup-step1')}>
                    Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* Step 1: Initials + Profile Picture */}
            {mode === 'signup-step1' && (
              <form onSubmit={(e) => { e.preventDefault(); validateAndNext([{ value: initials }], 'signup-step2'); }}>
                <div className="input-group underline">
                  <label>Initials *</label>
                  <input type="text" value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase())} maxLength="3" required placeholder="e.g. ABC" />
                </div>

                <div className="input-group">
                  <label>Profile Picture (optional)</label>
                  <input type="file" accept="image/*" onChange={handleProfilePicChange} className="file-input" />
                  {profilePreview && (
                    <div className="profile-preview">
                      <img src={profilePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="button-row">
                  <button type="button" className="btn-secondary" onClick={goBack}>Back</button>
                  <button type="submit" className="btn-primary">Next</button>
                </div>
              </form>
            )}

            {/* Step 2: First Name + Last Name */}
            {mode === 'signup-step2' && (
              <form onSubmit={(e) => { e.preventDefault(); validateAndNext([{ value: firstName }, { value: lastName }], 'signup-step3'); }}>
                <div className="input-group underline">
                  <label>First Name *</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>

                <div className="input-group underline">
                  <label>Last Name *</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>

                <div className="button-row">
                  <button type="button" className="btn-secondary" onClick={goBack}>Back</button>
                  <button type="submit" className="btn-primary">Next</button>
                </div>
              </form>
            )}

            {/* Step 3: Contact Details */}
            {mode === 'signup-step3' && (
              <form onSubmit={(e) => { e.preventDefault(); validateAndNext([{ value: address }, { value: mobile }, { value: signupEmail }], 'signup-step4'); }}>
                <div className="input-group underline">
                  <label>Address *</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>

                <div className="input-group underline">
                  <label>Mobile No *</label>
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                </div>

                <div className="input-group underline">
                  <label>Email *</label>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                </div>

                <div className="button-row">
                  <button type="button" className="btn-secondary" onClick={goBack}>Back</button>
                  <button type="submit" className="btn-primary">Next</button>
                </div>
              </form>
            )}

            {/* Step 4: Username + Password */}
            {mode === 'signup-step4' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                <div className="input-group underline">
                  <label>Username *</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Choose a username" />
                </div>

                <div className="input-group underline password-group">
                  <label>Password *</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="button-row">
                  <button type="button" className="btn-secondary" onClick={goBack}>Back</button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Complete Sign Up'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}