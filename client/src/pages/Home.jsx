import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../api';
import BlogCard from '../components/BlogCard';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [featured, latestRes, trending, cats] = await Promise.all([
          api.getFeaturedPosts(),
          api.getPosts({ limit: 6, sort: 'newest' }),
          api.getTrendingPosts(),
          api.getCategories()
        ]);
        setFeaturedPosts(featured || []);
        setLatestPosts(latestRes.posts || []);
        setTrendingPosts(trending || []);
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/blog?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const handleCategoryFilter = async (catName) => {
    setSelectedCategory(catName);
    try {
      const res = await api.getPosts({
        category: catName === 'All' ? undefined : catName,
        limit: 6
      });
      setLatestPosts(res.posts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const mainFeatured = featuredPosts[0];
  const sideFeatured = featuredPosts.slice(1, 4);

  return (
    <div>
      <section className="category-nav-bar">
        <div className="container">
          <div className="category-pills">
            <button
              className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('All')}
            >
              All Topics
            </button>
            {categories.map((c) => (
              <button
                key={c.id || c._id}
                className={`category-pill ${selectedCategory === c.name ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {mainFeatured && (
        <section className="hero-banner">
          <div className="container">
            <div className="hero-featured-grid">
              <Link to={`/blog/${mainFeatured.slug}`} className="hero-main-card">
                <img src={mainFeatured.featuredImage} alt={mainFeatured.title} />
                <div className="hero-main-overlay">
                  <span className="category-tag">{mainFeatured.category}</span>
                  <h2 style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
                    {mainFeatured.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '16px', maxWidth: '650px' }}>
                    {mainFeatured.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                    <span>By {mainFeatured.author?.name || 'Staff'}</span>
                    <span>&bull;</span>
                    <span>{mainFeatured.readingTime}</span>
                  </div>
                </div>
              </Link>

              <div className="hero-side-list">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  <Sparkles size={18} color="#8c4a2f" />
                  <span>Editor's Picks</span>
                </div>
                {sideFeatured.map((post) => (
                  <Link to={`/blog/${post.slug}`} key={post.id || post._id} className="hero-side-item">
                    <img src={post.featuredImage} alt={post.title} className="hero-side-img" />
                    <div className="hero-side-content">
                      <span className="category-tag" style={{ marginBottom: '4px', fontSize: '10px' }}>{post.category}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.35, color: '#0f172a', marginBottom: '6px' }}>
                        {post.title}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.readingTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container">
        <div className="home-layout-sidebar">
          <div>
            <div className="section-head">
              <div className="section-title">
                {selectedCategory === 'All' ? 'Latest Tech Articles' : `${selectedCategory} Articles`}
              </div>
              <Link to={`/blog${selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`} className="section-link">
                View All <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
                Loading published articles...
              </div>
            ) : latestPosts.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <BookOpen size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h3>No articles found</h3>
                <p style={{ marginTop: '6px' }}>There are currently no articles in this category.</p>
              </div>
            ) : (
              <div className="blog-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {latestPosts.map((post) => (
                  <BlogCard key={post.id || post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          <aside>
            <div className="sidebar-widget">
              <h4 className="widget-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#8c4a2f" />
                Popular & Trending
              </h4>
              <div>
                {trendingPosts.map((post, idx) => (
                  <div key={post.id || post._id} className="trending-item">
                    <span className="trending-num">0{idx + 1}</span>
                    <div>
                      <Link to={`/blog/${post.slug}`} className="trending-title">
                        {post.title}
                      </Link>
                      <div className="trending-date">
                        {post.category} &bull; {post.readingTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-widget">
              <h4 className="widget-title">Explore Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id || cat._id}
                    to={`/blog?category=${encodeURIComponent(cat.name)}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#334155'
                    }}
                  >
                    <span>{cat.name}</span>
                    <span style={{ background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>
                      {cat.postCount || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="newsletter-box">
              <h4>Stay Ahead in Technology</h4>
              <p>Get architectural breakdowns and tutorials delivered straight to your inbox every Thursday.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="newsletter-form">
                <input type="email" placeholder="you@company.com" required />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
