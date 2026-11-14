import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Eye, FileText, Globe, Sparkles, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    status: 'draft',
    isFeatured: false,
    isTrending: false,
    publishedAt: '',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    async function init() {
      try {
        const [cats, auths] = await Promise.all([
          api.getCategories(),
          api.getAuthors()
        ]);
        setCategories(cats || []);
        setAuthors(auths || []);

        if (isEditing) {
          const post = await api.getPostById(id);
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || (cats[0]?.name || ''),
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
            author: post.author?.id || post.author?._id || post.author?.name || '',
            featuredImage: post.featuredImage || '',
            status: post.status || 'draft',
            isFeatured: Boolean(post.isFeatured),
            isTrending: Boolean(post.isTrending),
            publishedAt: post.publishedAt ? post.publishedAt.split('T')[0] : '',
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || ''
          });
        } else if (cats.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: cats[0].name,
            author: auths[0]?.name || 'Editorial Team'
          }));
        }
      } catch (err) {
        alert('Failed to load post data: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        featuredImage: res.url
      }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const insertSnippet = (snippet) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + '\n' + snippet
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      alert('Please fill in Title, Content, and Category.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : (formData.status === 'published' ? new Date().toISOString() : null)
      };

      if (isEditing) {
        await api.updatePost(id, payload);
        alert('Post updated successfully!');
      } else {
        await api.createPost(payload);
        alert('Post created successfully!');
      }
      navigate('/admin/posts');
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
        Loading article editor...
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/admin/posts" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Posts
          </Link>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            {isEditing ? 'Edit Blog Article' : 'Create New Blog Article'}
          </h2>

          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={submitting}
          >
            <Save size={16} /> {submitting ? 'Saving...' : 'Save Article'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <div className="admin-card-header">
              <span>1. Basic Article Information</span>
            </div>
            <div className="admin-card-body">
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Modern Architecture Patterns in Enterprise Systems"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    placeholder="auto-generated-if-blank"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id || c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Author</label>
                  <select
                    name="author"
                    className="form-control"
                    value={formData.author}
                    onChange={handleChange}
                  >
                    {authors.map((a) => (
                      <option key={a.id || a._id} value={a.name}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description / Excerpt *</label>
                <textarea
                  name="excerpt"
                  className="form-control"
                  rows={2}
                  placeholder="Brief 1-2 sentence overview of the article for listings and previews."
                  value={formData.excerpt}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control"
                  placeholder="Microservices, Architecture, Cloud, DevOps"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <span>2. Featured Image</span>
            </div>
            <div className="admin-card-body">
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    name="featuredImage"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.featuredImage}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Or Upload File</label>
                  <label className="btn-secondary" style={{ width: '100%', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {formData.featuredImage && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Preview:</div>
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    style={{ maxHeight: '180px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <span>3. Article Content (HTML / Rich Blocks)</span>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Eye size={13} /> {previewMode ? 'Back to Editor' : 'Live Preview'}
              </button>
            </div>

            <div className="admin-card-body">
              {!previewMode && (
                <>
                  <div className="editor-toolbar">
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<h2>Subheading Title</h2>')}>H2</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<h3>Minor Section</h3>')}>H3</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<p>Add paragraph text here.</p>')}>Paragraph</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<ul>\n  <li>Key takeaway 1</li>\n  <li>Key takeaway 2</li>\n</ul>')}>List</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<blockquote>\n  Architecture wisdom quote here.\n</blockquote>')}>Quote</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<pre><code class="language-javascript">\nconst greeting = "Hello World";\nconsole.log(greeting);\n</code></pre>')}>Code Snippet</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<table>\n  <thead>\n    <tr><th>Feature</th><th>Description</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Item 1</td><td>Detail 1</td></tr>\n  </tbody>\n</table>')}>Table</button>
                    <button type="button" className="toolbar-btn" onClick={() => insertSnippet('<img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="Diagram" />')}>Image</button>
                  </div>

                  <textarea
                    name="content"
                    className="editor-textarea"
                    placeholder="Write article content with HTML formatting..."
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {previewMode && (
                <div className="content-preview-box">
                  <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <span>4. Publication, Scheduling & SEO</span>
            </div>
            <div className="admin-card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft (Saved privately)</option>
                    <option value="published">Published (Visible to public)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Scheduled Publication Date</label>
                  <input
                    type="date"
                    name="publishedAt"
                    className="form-control"
                    value={formData.publishedAt}
                    onChange={handleChange}
                  />
                  <small style={{ color: '#64748b', fontSize: '11px' }}>
                    Leave blank to publish immediately or select future date.
                  </small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', margin: '14px 0 20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  Highlight in Featured Banner
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleChange}
                  />
                  Mark as Popular / Trending
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">SEO Meta Title</label>
                <input
                  type="text"
                  name="seoTitle"
                  className="form-control"
                  placeholder="Target keyword title for search engines"
                  value={formData.seoTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SEO Meta Description</label>
                <textarea
                  name="seoDescription"
                  className="form-control"
                  rows={2}
                  placeholder="Search engine summary (recommended 150-160 characters)"
                  value={formData.seoDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to="/admin/posts" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Save size={16} /> {submitting ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
