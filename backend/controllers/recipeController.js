const Recipe = require('../models/Recipe');
const Category = require('../models/Category');

// @desc    Get all recipes (or search/filter)
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
  const { title, category } = req.query;
  const filter = {};

  if (title) {
    // Case-insensitive regex title search
    filter.title = { $regex: title, $options: 'i' };
  }

  if (category) {
    // Case-insensitive exact category matching
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }

  try {
    const recipes = await Recipe.find(filter)
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Server error retrieving recipes' });
  }
};

// @desc    Get single custom recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('userId', 'username');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    // If not a valid ObjectId format, it just means not found in MongoDB (falls back to MealDB)
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(500).json({ error: 'Server error fetching recipe details' });
  }
};

// @desc    Get custom recipes created by currently logged-in user
// @route   GET /api/recipes/mine
// @access  Private
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching own recipes:', error);
    res.status(500).json({ error: 'Server error retrieving your recipes' });
  }
};

// @desc    Add a new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
  const { title, ingredients, instructions, category, imageUrl, cookingTime } = req.body;

  try {
    if (!title || !ingredients || !instructions || !category) {
      return res.status(400).json({ error: 'Please provide Title, Ingredients, Instructions, and Category' });
    }

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      category,
      imageUrl: imageUrl || '',
      cookingTime: cookingTime ? Number(cookingTime) : 20,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Recipe created successfully!',
      recipe
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Server error saving recipe. Please try again.' });
  }
};

// @desc    Edit user-added recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res) => {
  const { title, ingredients, instructions, category, imageUrl, cookingTime } = req.body;

  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Verify creator owns the recipe
    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe' });
    }

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.category = category || recipe.category;
    recipe.imageUrl = imageUrl !== undefined ? imageUrl : recipe.imageUrl;
    recipe.cookingTime = cookingTime !== undefined ? Number(cookingTime) : recipe.cookingTime;

    await recipe.save();

    res.json({
      message: 'Recipe updated successfully!',
      recipe
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Server error updating recipe' });
  }
};

// @desc    Delete user-added recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Verify creator owns the recipe
    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
    }

    await Recipe.deleteOne({ _id: req.params.id });

    res.json({ message: 'Recipe deleted successfully!' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Server error deleting recipe' });
  }
};

// @desc    Get dynamic categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error retrieving categories' });
  }
};
