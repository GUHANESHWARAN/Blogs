import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ArrowLeft, ArrowRight, Tag, Bookmark } from 'lucide-react';
import { api } from '../api';
import TableOfContents from '../components/TableOfContents';
import ShareButtons from '../components/ShareButtons';
import BlogCard from '../components/BlogCard';

export default function BlogDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        setError('');
        const res = await api.getPostBySlug(slug);
        setData(res);

        if (res.post) {
          document.title = `${res.post.seoTitle || res.post.title} | papercup`;

          const schemaScript = document.getElementById('article-jsonld');
          const schemaData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": res.post.title,
            "description": res.post.excerpt,
            "image": [res.post.featuredImage],
            "datePublished": res.post.publishedAt || res.post.createdAt,
            "dateModified": res.post.updatedAt || res.post.createdAt,
            "author": [{
              "@type": "Person",
              "name": res.post.author?.name || "Editorial Team"
            }]
          };

          if (schemaScript) {
            schemaScript.textContent = JSON.stringify(schemaData);
          } else {
            const script = document.createElement('script');
            script.id = 'article-jsonld';
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schemaData);
            document.head.appendChild(script);
          }
        }
      } catch (err) {
        setError(err.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();

    return () => {
      const script = document.getElementById('article-jsonld');
      if (script) {
        script.remove();
      }
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
        Loading article content...
      </div>
    );
  }

  if (error || !data || !data.post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Article Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>The requested article does not exist or has been removed.</p>
        <Link to="/blog" className="btn-primary">
          Back to Articles
        </Link>
      </div>
    );
  }

  const { post, prevPost, nextPost, relatedPosts } = data;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  return (
    <div>
      <div className="article-hero">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="article-header-meta">
            <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="category-tag">
              {post.category}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} />
              <span>{post.readingTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} />
              <span>{post.views || 0} views</span>
            </div>
          </div>

          <h1 className="article-main-title">{post.title}</h1>

          <div className="article-author-card">
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1918' }}>
                By {post.author?.name || 'Staff Writer'}
                {post.author?.role && (
                  <span style={{ fontWeight: 400, color: '#736d66', marginLeft: '8px', fontSize: '14px' }}>
                    · {post.author.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          <img
            src={post.featuredImage}
            alt={post.title}
            className="article-featured-img"
          />
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1100px', marginTop: '36px' }}>
        <div className="article-page-body">
          <aside>
            <TableOfContents content={post.content} />
          </aside>

          <main>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags && post.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: '36px 0 24px' }}>
                <Tag size={16} color="#64748b" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Tags:</span>
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.author && (
              <div className="author-bio-box">
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1918', marginBottom: '4px' }}>
                    Written by {post.author.name}
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                    {post.author.role}
                  </div>
                  <p style={{ fontSize: '14px', color: '#5a554f', lineHeight: 1.6 }}>
                    {post.author.bio || 'Technology writer and researcher covering modern enterprise systems.'}
                  </p>
                </div>
              </div>
            )}

            <div className="post-nav-row">
              <div>
                {prevPost && (
                  <div className="post-nav-box">
                    <span className="post-nav-label">&larr; Previous Article</span>
                    <Link to={`/blog/${prevPost.slug}`} className="post-nav-title">
                      {prevPost.title}
                    </Link>
                  </div>
                )}
              </div>

              <div>
                {nextPost && (
                  <div className="post-nav-box next">
                    <span className="post-nav-label">Next Article &rarr;</span>
                    <Link to={`/blog/${nextPost.slug}`} className="post-nav-title">
                      {nextPost.title}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside>
            <ShareButtons title={post.title} />
          </aside>
        </div>

        {relatedPosts && relatedPosts.length > 0 && (
          <div style={{ marginTop: '48px', marginBottom: '60px' }}>
            <div className="section-head">
              <div className="section-title">Related Articles in {post.category}</div>
            </div>
            <div className="blog-grid">
              {relatedPosts.map((rel) => (
                <BlogCard key={rel.id || rel._id} post={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
