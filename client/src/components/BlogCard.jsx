import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

export default function BlogCard({ post }) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

  const authorName = post.author?.name || 'Staff Writer';

  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-card-thumb-wrap">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="blog-card-thumb"
          loading="lazy"
        />
      </Link>

      <div className="blog-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="category-tag">{post.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
            <Clock size={12} />
            <span>{post.readingTime || '5 min read'}</span>
          </div>
        </div>

        <div className="blog-card-meta">
          <div className="blog-card-meta-item">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h3 className="blog-card-title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="blog-card-excerpt">
          {post.excerpt}
        </p>

        <div className="blog-card-footer">
          <div className="author-pill">
            <span style={{ fontWeight: 600, color: '#5a554f', fontSize: '13px' }}>
              By {authorName}
            </span>
          </div>

          <Link to={`/blog/${post.slug}`} className="read-more-btn">
            Read More
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
