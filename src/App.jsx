import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page Imports
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import RecipeDetails from './pages/RecipeDetails';
import Favorites from './pages/Favorites';
import Category from './pages/Category';
import NotFound from './pages/NotFound';
import Shopping from './pages/Shopping';

// Hooks Imports
import useFavorites from './hooks/useFavorites';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('recipe_hub_theme') || 'light';
  });

  // Favorites E-Cookbook Hook
  const { favorites, toggleFavorite } = useFavorites();

  // Shopping Grocery Checklist State
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('recipe_hub_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply data-theme attribute on load / change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('recipe_hub_theme', theme);
  }, [theme]);

  // Sync shopping list to localStorage
  useEffect(() => {
    localStorage.setItem('recipe_hub_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Shopping List Actions
  const handleAddIngredientsToShoppingList = (items) => {
    setShoppingList((prev) => {
      const filteredNewItems = items.map((item, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random()}`,
        name: item.name,
        measure: item.measure,
        recipeTitle: item.recipeTitle,
        completed: false,
      }));
      return [...prev, ...filteredNewItems];
    });
  };

  const handleToggleShoppingItem = (id) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleRemoveShoppingItem = (id) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompletedShopping = () => {
    setShoppingList((prev) => prev.filter((item) => !item.completed));
  };

  const handleClearAllShopping = () => {
    if (window.confirm('Are you sure you want to clear your shopping list?')) {
      setShoppingList([]);
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Responsive Brand Header Navbar */}
        <Navbar
          bookmarkCount={favorites.length}
          shoppingListCount={shoppingList.filter((i) => !i.completed).length}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Global Router Pages Entrypoint */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            {/* 1. Discover / Dashboard Home Page */}
            <Route
              path="/"
              element={
                <Home
                  favorites={favorites}
                  onBookmarkToggle={toggleFavorite}
                />
              }
            />

            {/* 2. Search / Filter Results Page */}
            <Route
              path="/search"
              element={
                <SearchResults
                  favorites={favorites}
                  onBookmarkToggle={toggleFavorite}
                />
              }
            />

            {/* 3. Detailed Recipe Information Page */}
            <Route
              path="/recipe/:id"
              element={
                <RecipeDetails
                  favorites={favorites}
                  onBookmarkToggle={toggleFavorite}
                  onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
                />
              }
            />

            {/* 4. Bookmarks E-Cookbook Page */}
            <Route
              path="/favorites"
              element={
                <Favorites
                  favorites={favorites}
                  onBookmarkToggle={toggleFavorite}
                />
              }
            />

            {/* 5. Category-Specific Browse Page */}
            <Route
              path="/category/:name"
              element={
                <Category
                  favorites={favorites}
                  onBookmarkToggle={toggleFavorite}
                />
              }
            />

            {/* 6. Grocery Ingredient Shopping List Page */}
            <Route
              path="/shopping"
              element={
                <Shopping
                  shoppingList={shoppingList}
                  onToggleComplete={handleToggleShoppingItem}
                  onRemoveItem={handleRemoveShoppingItem}
                  onClearCompleted={handleClearCompletedShopping}
                  onClearAll={handleClearAllShopping}
                />
              }
            />

            {/* 7. Culinary 404 Fallback Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Semantic Brand Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
