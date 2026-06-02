const Favorite = require('../models/Favorite');

// @desc    Get user's favorites from MongoDB
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // Return only the inner recipeData structures to match frontend expectations
    const recipeList = favorites.map(fav => ({
      ...fav.recipeData,
      idMeal: fav.recipeId, // Ensure high-fidelity consistency
      isDatabaseFavorite: true
    }));
    res.json(recipeList);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error retrieving favorites' });
  }
};

// @desc    Toggle favorite on/off
// @route   POST /api/favorites/toggle
// @access  Private
exports.toggleFavorite = async (req, res) => {
  const { recipeId, recipeData } = req.body;

  try {
    if (!recipeId || !recipeData) {
      return res.status(400).json({ error: 'Please provide recipeId and complete recipeData' });
    }

    // Check if it already exists
    const existingFavorite = await Favorite.findOne({
      userId: req.user.id,
      recipeId: String(recipeId)
    });

    if (existingFavorite) {
      // If it exists, remove it
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.json({
        message: 'Recipe removed from favorites',
        isFavorited: false,
        recipeId
      });
    } else {
      // If it doesn't, create it
      await Favorite.create({
        userId: req.user.id,
        recipeId: String(recipeId),
        recipeData
      });
      return res.status(201).json({
        message: 'Recipe added to favorites!',
        isFavorited: true,
        recipeId
      });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Server error toggling bookmark' });
  }
};
