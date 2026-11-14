import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin/posts');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ref-login-wrapper">
      <Link to="/" className="ref-back-home-btn" title="Back to papercup Homepage">
        <ArrowLeft size={16} />
        <span>Back to papercup</span>
      </Link>

      <div className="ref-login-container">
        <div className="ref-login-left">
          <div className="ref-brand-box">
            <svg
              className="ref-brand-icon"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 6C32 6 46 16 46 32C46 44 38 52 32 58C32 58 42 42 38 28C35 20 32 6 32 6Z"
                fill="url(#paint0_linear)"
              />
              <path
                d="M32 58C32 58 18 48 18 32C18 20 26 12 32 6C32 6 22 22 26 36C29 44 32 58 32 58Z"
                fill="url(#paint1_linear)"
              />
              <defs>
                <linearGradient id="paint0_linear" x1="32" y1="6" x2="46" y2="58" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8c4a2f" />
                  <stop offset="1" stopColor="#c85a32" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="18" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6e351f" />
                  <stop offset="1" stopColor="#8c4a2f" />
                </linearGradient>
              </defs>
            </svg>
            <span className="ref-brand-text">papercup</span>
          </div>
        </div>

        <div className="ref-login-divider"></div>

        <div className="ref-login-right">
          <div className="ref-login-form-area">
            <h1 className="ref-title">Welcome</h1>
            <p className="ref-subtitle">PLEASE LOGIN TO ADMIN DASHBOARD.</p>

            {error && (
              <div className="ref-error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="ref-form">
              <div className="ref-field-wrap">
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ref-input"
                  required
                />
              </div>

              <div className="ref-field-wrap">
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ref-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="ref-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              <div className="ref-forgot-wrap">
                <button
                  type="button"
                  onClick={() => alert('Contact the site administrator to reset your password.')}
                  className="ref-forgot-btn"
                >
                  FORGOTTEN YOUR PASSWORD?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
