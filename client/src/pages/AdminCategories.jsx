import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function AdminCategories() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const catsRes = await api.getCategories();
      setCategories(catsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (cat) => {
    setEditingId(cat.id || cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await api.updateCategory(editingId, formData);
        alert('Category updated!');
      } else {
        await api.createCategory(formData);
        alert('Category created!');
      }
      handleCancelEdit();
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await api.deleteCategory(id);
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
            <Link to="/admin/categories" className="active">Categories</Link>
            <Link to="/admin/authors">Authors</Link>
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
              {editingId ? 'Edit Category' : 'Add New Category'}
            </span>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Brief category scope"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ background: '#d95328' }}>
                  {editingId ? 'Update Category' : 'Add Category'}
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
            <span style={{ fontFamily: "var(--font-serif)", fontSize: '18px' }}>Existing Categories</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#b5aca1' }}>Total: {categories.length}</span>
          </div>
          <div className="admin-card-body">
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b6560' }}>Loading categories...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Slug</th>
                    <th style={{ textAlign: 'center' }}>Articles</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id || cat._id}>
                      <td>
                        <strong style={{ fontSize: '15px' }}>{cat.name}</strong>
                        {cat.description && (
                          <div style={{ fontSize: '12px', color: '#948d85', marginTop: '2px' }}>
                            {cat.description}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '13px', color: '#6b6560' }}>
                        <code>{cat.slug}</code>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: '#f5efe6', color: '#7a4329', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
                          {cat.postCount || 0}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleEditClick(cat)} className="btn-action-edit">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(cat.id || cat._id, cat.name)} className="btn-action-delete">
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
