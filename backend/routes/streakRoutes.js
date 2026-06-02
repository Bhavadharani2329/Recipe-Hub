const express = require('express');
const router = express.Router();
const { completeRecipe, getStreakHistory } = require('../controllers/streakController');
const { protect } = require('../middleware/authMiddleware');

router.post('/complete', protect, completeRecipe);
router.get('/history', protect, getStreakHistory);

module.exports = router;
