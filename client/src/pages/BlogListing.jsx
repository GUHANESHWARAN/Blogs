import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, BookOpen } from 'lucide-react';
import { api } from '../api';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';

export default function BlogListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await api.getPosts({
          category: currentCategory === 'All' ? undefined : currentCategory,
          search: currentSearch || undefined,
          page: currentPage,
          limit: 8
        });
        setPosts(res.posts || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [currentCategory, currentSearch, currentPage]);

  const handleCategorySelect = (categoryName) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      params.delete('category');
    } else {
      params.set('category', categoryName);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '36px 0 60px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Technology & Engineering Articles
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Browse published articles, industry insights, and developer tutorials.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div className="category-pills" style={{ paddingBottom: 0 }}>
            <button
              className={`category-pill ${currentCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('All')}
            >
              All Topics
            </button>
            {categories.map((c) => (
              <button
                key={c.id || c._id}
                className={`category-pill ${currentCategory === c.name ? 'active' : ''}`}
                onClick={() => handleCategorySelect(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
              <Search size={16} />
            </button>
          </form>
        </div>

        {(currentCategory !== 'All' || currentSearch) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
            <span>Filtered by:</span>
            {currentCategory !== 'All' && (
              <span className="category-tag">{currentCategory}</span>
            )}
            {currentSearch && (
              <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Query: "{currentSearch}"
              </span>
            )}
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#d9383a', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} /> Clear Filter
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <BookOpen size={48} style={{ color: '#94a3b8', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>No matching articles</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Try adjusting your search query or selecting a different category.</p>
            <button onClick={clearFilters} className="btn-primary">
              View All Articles
            </button>
          </div>
        ) : (
          <>
            <div className="blog-grid-4">
              {posts.map((post) => (
                <BlogCard key={post.id || post._id} post={post} />
              ))}
            </div>

            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
