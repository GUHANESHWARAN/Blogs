const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authorController.getAuthors);
router.post('/', authMiddleware, authorController.createAuthor);
router.put('/:id', authMiddleware, authorController.updateAuthor);
router.delete('/:id', authMiddleware, authorController.deleteAuthor);

module.exports = router;
