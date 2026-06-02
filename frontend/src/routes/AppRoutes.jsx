import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Page Imports
import Home from '../pages/Home';
import SearchResults from '../pages/SearchResults';
import RecipeDetails from '../pages/RecipeDetails';
import Favorites from '../pages/Favorites';
import Category from '../pages/Category';
import Shopping from '../pages/Shopping';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AddRecipe from '../pages/AddRecipe';
import NotFound from '../pages/NotFound';

export default function AppRoutes({
  favorites,
  toggleFavorite,
  shoppingList,
  handleAddIngredientsToShoppingList,
  handleToggleShoppingItem,
  handleRemoveShoppingItem,
  handleClearCompletedShopping,
  handleClearAllShopping,
  theme,
  toggleTheme
}) {
  return (
    <Routes>
      <Route element={
        <MainLayout
          bookmarkCount={favorites.length}
          shoppingListCount={shoppingList.filter((i) => !i.completed).length}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      }>
        <Route path="/" element={<Home favorites={favorites} onBookmarkToggle={toggleFavorite} />} />
        <Route path="/search" element={<SearchResults favorites={favorites} onBookmarkToggle={toggleFavorite} />} />
        <Route path="/recipe/:id" element={
          <RecipeDetails
            favorites={favorites}
            onBookmarkToggle={toggleFavorite}
            onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
          />
        } />
        <Route path="/favorites" element={<Favorites favorites={favorites} onBookmarkToggle={toggleFavorite} />} />
        <Route path="/category/:name" element={<Category favorites={favorites} onBookmarkToggle={toggleFavorite} />} />
        <Route path="/shopping" element={
          <Shopping
            shoppingList={shoppingList}
            onToggleComplete={handleToggleShoppingItem}
            onRemoveItem={handleRemoveShoppingItem}
            onClearCompleted={handleClearCompletedShopping}
            onClearAll={handleClearAllShopping}
          />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
