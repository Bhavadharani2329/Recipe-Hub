import { useState, useEffect, useCallback } from 'react';
import useAuth, { api } from './useAuth';

const LOCAL_STORAGE_KEY = 'recipe_hub_bookmarks';

export default function useFavorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Backend fetch helper
  const fetchBackendFavorites = useCallback(async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites from backend:', err);
    }
  }, []);

  // Sync / Load favorites on authentication state shifts
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendFavorites();
    } else {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.warn('Failed to parse favorites from local storage:', e.message);
        setFavorites([]);
      }
    }
  }, [isAuthenticated, fetchBackendFavorites]);

  const isFavorite = useCallback((idMeal) => {
    return favorites.some((fav) => String(fav.idMeal) === String(idMeal));
  }, [favorites]);

  const toggleFavorite = useCallback(async (recipe) => {
    const idMeal = String(recipe.idMeal);
    
    if (isAuthenticated) {
      try {
        // Post bookmark toggling to MongoDB
        await api.post('/favorites/toggle', {
          recipeId: idMeal,
          recipeData: recipe
        });
        
        // Refresh memories
        await fetchBackendFavorites();
      } catch (err) {
        console.error('Error toggling favorite on backend:', err);
      }
    } else {
      // LocalStorage toggle fallback
      setFavorites((prev) => {
        const exists = prev.some((fav) => String(fav.idMeal) === idMeal);
        let updated;
        if (exists) {
          updated = prev.filter((fav) => String(fav.idMeal) !== idMeal);
        } else {
          updated = [...prev, recipe];
        }
        
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to set favorites in local storage:', e.message);
        }
        return updated;
      });
    }
  }, [isAuthenticated, favorites, fetchBackendFavorites]);

  // Backward compatibility hooks
  const addFavorite = useCallback((recipe) => {
    if (!isFavorite(recipe.idMeal)) {
      toggleFavorite(recipe);
    }
  }, [isFavorite, toggleFavorite]);

  const removeFavorite = useCallback((idMeal) => {
    const matched = favorites.find((fav) => String(fav.idMeal) === String(idMeal));
    if (matched) {
      toggleFavorite(matched);
    }
  }, [favorites, toggleFavorite]);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}
