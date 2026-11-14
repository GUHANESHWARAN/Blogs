const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_DIR || __dirname;

function getFilePath(collection) {
  return path.join(dataDir, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

const db = {
  find: (collection, filter = {}) => {
    const items = readCollection(collection);
    return items.filter(item => {
      for (const key of Object.keys(filter)) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  },

  findOne: (collection, filter = {}) => {
    const items = db.find(collection, filter);
    return items.length > 0 ? items[0] : null;
  },

  findById: (collection, id) => {
    const items = readCollection(collection);
    return items.find(item => item.id === id || item._id === id) || null;
  },

  create: (collection, doc) => {
    const items = readCollection(collection);
    const newDoc = {
      _id: generateId(),
      id: generateId(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.unshift(newDoc);
    writeCollection(collection, items);
    return newDoc;
  },

  findByIdAndUpdate: (collection, id, updates) => {
    const items = readCollection(collection);
    const index = items.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeCollection(collection, items);
    return items[index];
  },

  findByIdAndDelete: (collection, id) => {
    const items = readCollection(collection);
    const index = items.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    const removed = items.splice(index, 1)[0];
    writeCollection(collection, items);
    return removed;
  },

  countDocuments: (collection, filter = {}) => {
    return db.find(collection, filter).length;
  }
};

module.exports = db;
