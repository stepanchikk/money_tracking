const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getCategories)
    .post(protect, createCategory);

module.exports = router;