import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              papercup
            </div>
            <p style={{ lineHeight: '1.7', marginBottom: '18px', color: '#b5aca1' }}>
              An independent engineering journal dedicated to software architecture,
              systems design, foundational artificial intelligence, and cloud engineering.
            </p>
            <div style={{ display: 'flex', gap: '14px', color: '#d5cec5' }}>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/blog">Explore Archive</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/admin">Admin Management</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Core Domains</h4>
            <ul className="footer-links">
              <li><Link to="/blog?category=Software%20Development">Software Engineering</Link></li>
              <li><Link to="/blog?category=Artificial%20Intelligence%20%26%20Machine%20Learning">Artificial Intelligence</Link></li>
              <li><Link to="/blog?category=Cloud%20Computing">Cloud Computing</Link></li>
              <li><Link to="/blog?category=Cybersecurity">Cybersecurity</Link></li>
              <li><Link to="/blog?category=Industry%20Insights">Industry Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Engineering Letter</h4>
            <p style={{ fontSize: '13px', marginBottom: '12px', color: '#b5aca1' }}>
              Join 45,000+ senior engineers receiving our weekly architectural essays every Thursday.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to papercup!'); }} className="newsletter-form">
              <input type="email" placeholder="Enter your work email" required />
              <button type="submit" className="btn-primary" style={{ padding: '8px 12px', fontSize: '13px' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} papercup Journal. All rights reserved. Built with MERN Stack.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer">XML Sitemap</a>
            <a href="/robots.txt" target="_blank" rel="noreferrer">Robots.txt</a>
            <Link to="/about">Editorial Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
