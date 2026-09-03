const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../Controllers/blogController');

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;