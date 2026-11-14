import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const cats = await api.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: '36px', fontWeight: 700, color: '#22201e', marginBottom: '12px' }}>
            Browse by Topic & Domain
          </h1>
          <p style={{ color: '#68625d', fontSize: '16px', maxWidth: '600px', margin: '0 auto', fontStyle: 'italic' }}>
            Explore essays, tutorials, and architectural breakdowns grouped by core disciplines.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7a736d' }}>
            Loading categories...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id || cat._id}
                to={`/blog?category=${encodeURIComponent(cat.name)}`}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e8e4dc',
                  borderRadius: '10px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
                className="category-card-hover"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'inline-flex', padding: '8px', background: '#f5efe6', color: '#8c4a2f', borderRadius: '6px' }}>
                      <Folder size={20} />
                    </div>
                    <span style={{ background: '#f5efe6', color: '#6b4f3b', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '12px' }}>
                      {cat.postCount || 0} Articles
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 600, color: '#22201e', marginBottom: '8px', lineHeight: 1.35 }}>
                    {cat.name}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#68625d', lineHeight: 1.6, marginBottom: '20px' }}>
                    {cat.description || 'In-depth articles and tutorials exploring key engineering practices.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#8c4a2f' }}>
                  <span>Explore Articles</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
