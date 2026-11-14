const db = require('../data/store');

exports.getAuthors = (req, res) => {
  try {
    const authors = db.find('authors');
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAuthor = (req, res) => {
  try {
    const { name, role, email, bio, avatar } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Author name is required' });
    }

    const newAuthor = db.create('authors', {
      name: name.trim(),
      role: role ? role.trim() : 'Content Contributor',
      email: email ? email.trim() : '',
      bio: bio ? bio.trim() : '',
      avatar: avatar ? avatar.trim() : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    });

    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAuthor = (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, bio, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (role !== undefined) updates.role = role.trim();
    if (email !== undefined) updates.email = email.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (avatar !== undefined) updates.avatar = avatar.trim();

    const updated = db.findByIdAndUpdate('authors', id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAuthor = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.findByIdAndDelete('authors', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
