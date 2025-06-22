const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  checkPost
} = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', createPost);
router.put('/:id/check', checkPost);

module.exports = router;
