const mongoose = require('mongoose');

const completedRecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: String,
    required: true // numerical MealDB ID or custom recipe ObjectID
  },
  recipeTitle: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CompletedRecipe', completedRecipeSchema);
