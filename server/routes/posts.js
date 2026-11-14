const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', postController.getPosts);
router.get('/featured', postController.getFeaturedPosts);
router.get('/trending', postController.getTrendingPosts);
router.get('/slug/:slug', postController.getPostBySlug);
router.get('/:id', postController.getPostById);

router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.patch('/:id/toggle-publish', authMiddleware, postController.togglePublish);

router.post('/upload', authMiddleware, upload.single('image'), postController.uploadImage);

module.exports = router;
