const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFavorites);
router.post('/toggle', protect, toggleFavorite);

module.exports = router;
