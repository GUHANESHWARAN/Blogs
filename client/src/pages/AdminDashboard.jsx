import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const postsRes = await api.getPosts({ status: 'all', limit: 100 });
      setPosts(postsRes.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      const updated = await api.togglePublish(id);
      setPosts(posts.map((p) => ((p.id === id || p._id === id) ? updated : p)));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeletePost = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.deletePost(id);
        setPosts(posts.filter((p) => p.id !== id && p._id !== id));
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesQuery = !filterQuery || p.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const categoriesList = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <div style={{ background: '#f8f5ee', minHeight: '100vh' }}>
      <div className="admin-strap-header">
        <div className="container admin-strap-nav">
          <div className="admin-strap-links">
            <Link to="/" style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: '18px', color: '#ffffff', letterSpacing: '-0.3px', marginRight: '16px' }}>
              papercup Admin
            </Link>
            <Link to="/admin/posts" className="active">Posts</Link>
            <Link to="/admin/categories">Categories</Link>
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
        <div className="admin-card">
          <div className="admin-card-header">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: '18px' }}>All Articles</span>
            <Link to="/admin/posts/new" className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px', background: '#d95328' }}>
              <Plus size={15} /> Create Content
            </Link>
          </div>

          <div className="admin-card-body">
            <div style={{ display: 'flex', gap: '14px', marginBottom: '22px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#948d85' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter Posts by title..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <select
                className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: '220px' }}
              >
                <option value="All">All Categories</option>
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#6b6560' }}>
                Loading posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#6b6560' }}>
                No blog posts match your filter.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'center' }}>Published</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => {
                    const isPub = post.status === 'published';
                    const createdFormatted = new Date(post.createdAt || post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <tr key={post.id || post._id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#1f1d1b', fontSize: '15px' }}>
                            <Link to={`/blog/${post.slug}`} target="_blank" title="Preview article">
                              {post.title}
                            </Link>
                          </div>
                          <div style={{ fontSize: '12px', color: '#948d85', marginTop: '3px' }}>
                            {post.author?.name || 'Staff'} &bull; {post.readingTime}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', background: '#f5efe6', color: '#7a4329', padding: '3px 9px', borderRadius: '4px', fontWeight: 500 }}>
                            {post.category}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleTogglePublish(post.id || post._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Click to toggle publish status"
                          >
                            {isPub ? (
                              <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '16px' }}>&#10004;</span>
                            ) : (
                              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '16px' }}>&#10006;</span>
                            )}
                          </button>
                        </td>
                        <td style={{ fontSize: '13px', color: '#6b6560' }}>
                          {createdFormatted}
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <Link
                            to={`/admin/posts/edit/${post.id || post._id}`}
                            className="btn-action-edit"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id || post._id, post.title)}
                            className="btn-action-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
