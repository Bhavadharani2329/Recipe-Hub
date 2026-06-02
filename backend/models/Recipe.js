const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe Title is required'],
    trim: true
  },
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required']
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'] // Veg, Non-Veg, Desserts, Drinks
  },
  imageUrl: {
    type: String,
    default: ''
  },
  cookingTime: {
    type: Number,
    required: [true, 'Cooking Time (in minutes) is required'],
    min: [1, 'Cooking Time must be at least 1 minute'],
    default: 20
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
