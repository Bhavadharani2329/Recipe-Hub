const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  getMyRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getCategories
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public search/filters
router.get('/', getRecipes);
router.get('/categories', getCategories);

// Secure routes (must go before dynamic parameter routes to avoid parameter clashes)
router.get('/mine', protect, getMyRecipes);

// CRUD by ID (Public get details, private update/delete)
router.get('/:id', getRecipeById);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
