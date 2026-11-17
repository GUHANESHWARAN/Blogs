import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-row">
          <Link to="/" className="logo">
            papercup
          </Link>

          <nav className="main-nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
            >
              Categories
            </Link>
            <Link
              to="/blog"
              className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
            >
              Explore
            </Link>
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
          </nav>

          <div className="header-actions">
            <form onSubmit={handleSearchSubmit} className="header-search">
              <Search size={15} className="header-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <Link
              to={user ? "/admin/posts" : "/admin/login"}
              className="admin-login-btn"
            >
              {user ? "Dashboard" : "Admin Login"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
