import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function AdminAuthors() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const authRes = await api.getAuthors();
      setAuthors(authRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (auth) => {
    setEditingId(auth.id || auth._id);
    setFormData({
      name: auth.name,
      role: auth.role || '',
      email: auth.email || '',
      bio: auth.bio || '',
      avatar: auth.avatar || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      email: '',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await api.updateAuthor(editingId, formData);
        alert('Author updated!');
      } else {
        await api.createAuthor(formData);
        alert('Author created!');
      }
      handleCancelEdit();
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete author "${name}"?`)) {
      try {
        await api.deleteAuthor(id);
        fetchData();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div style={{ background: '#f8f5ee', minHeight: '100vh' }}>
      <div className="admin-strap-header">
        <div className="container admin-strap-nav">
          <div className="admin-strap-links">
            <Link to="/" style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: '18px', color: '#ffffff', letterSpacing: '-0.3px', marginRight: '16px' }}>
              papercup Admin
            </Link>
            <Link to="/admin/posts">Posts</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/authors" className="active">Authors</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ fontSize: '13px', color: '#d5cec5' }}>{user?.name || user?.username || 'Admin'}</span>
            <Link to="/" target="_blank" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View Site</span>
              <ExternalLink size={13} />
            </Link>
            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="admin-logout-btn"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px', marginBottom: '60px' }}>
        <div className="admin-card" style={{ marginBottom: '28px' }}>
          <div className="admin-card-header">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: '18px' }}>
              {editingId ? 'Edit Author' : 'Add New Author'}
            </span>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Alex Turner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Role / Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Principal Software Architect"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="author@papercup.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar Photo URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Brief bio about background and focus area"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ background: '#d95328' }}>
                  {editingId ? 'Update Author' : 'Add Author'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: '18px' }}>Existing Authors & Contributors</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#b5aca1' }}>Total: {authors.length}</span>
          </div>
          <div className="admin-card-body">
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b6560' }}>Loading authors...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((auth) => (
                    <tr key={auth.id || auth._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={auth.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                            alt={auth.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '15px' }}>{auth.name}</strong>
                            {auth.bio && (
                              <div style={{ fontSize: '12px', color: '#948d85', maxWidth: '380px', marginTop: '2px' }}>
                                {auth.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#4a453f' }}>
                        {auth.role}
                      </td>
                      <td style={{ fontSize: '13px', color: '#6b6560' }}>
                        {auth.email || '-'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleEditClick(auth)} className="btn-action-edit">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(auth.id || auth._id, auth.name)} className="btn-action-delete">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
