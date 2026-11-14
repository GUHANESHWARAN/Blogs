const slugify = require('slugify');
const db = require('../data/store');

exports.getCategories = (req, res) => {
  try {
    const categories = db.find('categories');
    const posts = db.find('posts', { status: 'published' });

    const categoriesWithCount = categories.map(cat => {
      const count = posts.filter(p => p.category === cat.name).length;
      return {
        ...cat,
        postCount: count
      };
    });

    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = db.findOne('categories', { slug });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = db.create('categories', {
      name: name.trim(),
      slug,
      description: description ? description.trim() : ''
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updates = {};

    if (name) {
      updates.name = name.trim();
      updates.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) {
      updates.description = description.trim();
    }

    const updated = db.findByIdAndUpdate('categories', id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.findByIdAndDelete('categories', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
