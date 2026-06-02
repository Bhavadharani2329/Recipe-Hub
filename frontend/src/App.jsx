import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

// Hooks & Context Imports
import useFavorites from './hooks/useFavorites';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('recipe_hub_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Favorites E-Cookbook Hook
  const { favorites, toggleFavorite } = useFavorites();

  // Shopping Grocery Checklist State
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const saved = localStorage.getItem('recipe_hub_shopping');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse shopping list:', e.message);
      return [];
    }
  });

  // Apply data-theme attribute on load / change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('recipe_hub_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Sync shopping list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('recipe_hub_shopping', JSON.stringify(shoppingList));
    } catch (e) {}
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
      <AppRoutes
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        shoppingList={shoppingList}
        handleAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
        handleToggleShoppingItem={handleToggleShoppingItem}
        handleRemoveShoppingItem={handleRemoveShoppingItem}
        handleClearCompletedShopping={handleClearCompletedShopping}
        handleClearAllShopping={handleClearAllShopping}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </BrowserRouter>
  );
}
