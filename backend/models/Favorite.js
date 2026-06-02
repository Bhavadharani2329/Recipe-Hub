const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: String,
    required: true // MealDB numerical ID or custom recipe ObjectID
  },
  recipeData: {
    type: Object,
    required: true // JSON representation of the recipe details
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index so a user cannot favorite the same recipe multiple times
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
