const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Dynamic Categories Database Seeder
const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('Seeding initial dynamic categories in MongoDB...');
      const defaultCategories = [
        {
          name: 'Veg',
          description: 'Delicious and healthy vegetarian & vegan preparations.',
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600'
        },
        {
          name: 'Non-Veg',
          description: 'Premium meat, poultry, and seafood delicacies.',
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'
        },
        {
          name: 'Desserts',
          description: 'Sweet treats, cakes, and delectable desserts.',
          imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600'
        },
        {
          name: 'Drinks',
          description: 'Refreshing beverages, shakes, and mocktails.',
          imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600'
        }
      ];
      await Category.insertMany(defaultCategories);
      console.log('Seeded 4 dynamic categories successfully!');
    }
  } catch (error) {
    console.error('Error seeding categories:', error.message);
  }
};

// Execute seeding
seedCategories();

// Define Route Mappings
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/streaks', require('./routes/streakRoutes'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RecipeHub API server is active and healthy.' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server error stack:', err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong on our server. Please try again.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RecipeHub backend server running on port: ${PORT}`);
});
