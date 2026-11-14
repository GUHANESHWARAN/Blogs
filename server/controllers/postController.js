const slugify = require('slugify');
const db = require('../data/store');

function calculateReadingTime(text) {
  if (!text) return '1 min read';
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

exports.getPosts = (req, res) => {
  try {
    const {
      category,
      tag,
      search,
      status = 'published',
      page = 1,
      limit = 9,
      sort = 'newest'
    } = req.query;

    let posts = db.find('posts');

    if (status !== 'all') {
      const now = new Date();
      posts = posts.filter(post => {
        if (post.status !== status) return false;
        if (status === 'published' && post.publishedAt) {
          return new Date(post.publishedAt) <= now;
        }
        return true;
      });
    }

    if (category && category !== 'All') {
      posts = posts.filter(post => post.category && post.category.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      posts = posts.filter(post => post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (search) {
      const query = search.toLowerCase().trim();
      posts = posts.filter(post => {
        const titleMatch = post.title && post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(query);
        const contentMatch = post.content && post.content.toLowerCase().includes(query);
        const tagMatch = post.tags && post.tags.some(t => t.toLowerCase().includes(query));
        return titleMatch || excerptMatch || contentMatch || tagMatch;
      });
    }

    if (sort === 'newest') {
      posts.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
    } else if (sort === 'popular') {
      posts.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    const total = posts.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedPosts = posts.slice(startIndex, startIndex + limitNum);

    res.json({
      posts: paginatedPosts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasPrev: pageNum > 1,
        hasNext: pageNum < totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedPosts = (req, res) => {
  try {
    const now = new Date();
    const posts = db.find('posts', { status: 'published' })
      .filter(p => p.isFeatured && (!p.publishedAt || new Date(p.publishedAt) <= now))
      .slice(0, 4);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTrendingPosts = (req, res) => {
  try {
    const now = new Date();
    const posts = db.find('posts', { status: 'published' })
      .filter(p => !p.publishedAt || new Date(p.publishedAt) <= now)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const post = db.findOne('posts', { slug });

    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const updatedViews = (post.views || 0) + 1;
    db.findByIdAndUpdate('posts', post.id, { views: updatedViews });
    post.views = updatedViews;

    const publishedPosts = db.find('posts', { status: 'published' })
      .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

    const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIndex > 0 ? {
      slug: publishedPosts[currentIndex - 1].slug,
      title: publishedPosts[currentIndex - 1].title
    } : null;

    const nextPost = currentIndex !== -1 && currentIndex < publishedPosts.length - 1 ? {
      slug: publishedPosts[currentIndex + 1].slug,
      title: publishedPosts[currentIndex + 1].title
    } : null;

    const relatedPosts = publishedPosts
      .filter(p => p.id !== post.id && p.category === post.category)
      .slice(0, 3);

    res.json({
      post,
      prevPost,
      nextPost,
      relatedPosts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.findById('posts', id);
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags = [],
      author,
      featuredImage,
      status = 'draft',
      isFeatured = false,
      isTrending = false,
      publishedAt,
      seoTitle,
      seoDescription
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const baseSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 1;
    while (db.findOne('posts', { slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const readingTime = calculateReadingTime(content);

    let authorObj = author;
    if (typeof author === 'string') {
      const found = db.findById('authors', author);
      authorObj = found || { name: author, role: 'Author' };
    }

    const now = new Date().toISOString();
    const newPost = db.create('posts', {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt ? excerpt.trim() : title.trim(),
      content,
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      author: authorObj || { name: 'Editorial Team', role: 'Staff Writer' },
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      readingTime,
      status,
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      publishedAt: status === 'published' ? (publishedAt || now) : (publishedAt || null),
      seoTitle: seoTitle || title.trim(),
      seoDescription: seoDescription || (excerpt ? excerpt.trim() : title.trim()),
      views: 0
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('posts', id);
    if (!existing) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      author,
      featuredImage,
      status,
      isFeatured,
      isTrending,
      publishedAt,
      seoTitle,
      seoDescription
    } = req.body;

    const updates = {};

    if (title) updates.title = title.trim();
    if (slug) {
      const generated = slugify(slug, { lower: true, strict: true });
      const dup = db.findOne('posts', { slug: generated });
      if (dup && dup.id !== id) {
        updates.slug = `${generated}-${Date.now().toString().slice(-4)}`;
      } else {
        updates.slug = generated;
      }
    }
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (content !== undefined) {
      updates.content = content;
      updates.readingTime = calculateReadingTime(content);
    }
    if (category) updates.category = category.trim();
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (author) {
      if (typeof author === 'string') {
        const found = db.findById('authors', author);
        updates.author = found || { name: author, role: 'Author' };
      } else {
        updates.author = author;
      }
    }
    if (featuredImage !== undefined) updates.featuredImage = featuredImage;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'published' && !existing.publishedAt && !publishedAt) {
        updates.publishedAt = new Date().toISOString();
      }
    }
    if (isFeatured !== undefined) updates.isFeatured = Boolean(isFeatured);
    if (isTrending !== undefined) updates.isTrending = Boolean(isTrending);
    if (publishedAt !== undefined) updates.publishedAt = publishedAt;
    if (seoTitle !== undefined) updates.seoTitle = seoTitle;
    if (seoDescription !== undefined) updates.seoDescription = seoDescription;

    const updated = db.findByIdAndUpdate('posts', id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.findByIdAndDelete('posts', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.togglePublish = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.findById('posts', id);
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const updates = {
      status: newStatus
    };
    if (newStatus === 'published' && !post.publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }

    const updated = db.findByIdAndUpdate('posts', id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
