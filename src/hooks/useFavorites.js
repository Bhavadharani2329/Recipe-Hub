import { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'recipe_hub_bookmarks'; // Keep key consistent with previous App bookmarks

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((idMeal) => {
    return favorites.some((fav) => String(fav.idMeal) === String(idMeal));
  }, [favorites]);

  const addFavorite = useCallback((recipe) => {
    setFavorites((prev) => {
      if (prev.some((fav) => String(fav.idMeal) === String(recipe.idMeal))) {
        return prev;
      }
      return [...prev, recipe];
    });
  }, []);

  const removeFavorite = useCallback((idMeal) => {
    setFavorites((prev) => prev.filter((fav) => String(fav.idMeal) !== String(idMeal)));
  }, []);

  const toggleFavorite = useCallback((recipe) => {
    if (isFavorite(recipe.idMeal)) {
      removeFavorite(recipe.idMeal);
    } else {
      addFavorite(recipe);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}
