import { useState, useCallback } from 'react';
import { recipeService } from '../services/recipeService';

export default function useFetchRecipes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (type, param = '') => {
    setLoading(true);
    setError(null);
    try {
      let result = [];
      switch (type) {
        case 'search':
          result = await recipeService.searchRecipes(param);
          break;
        case 'category':
          result = await recipeService.getRecipesByCategory(param);
          break;
        case 'area':
          result = await recipeService.getRecipesByArea(param);
          break;
        case 'id':
          result = await recipeService.getRecipeById(param);
          break;
        case 'random':
          result = await recipeService.getRandomRecipe();
          break;
        case 'categories':
          result = await recipeService.getCategories();
          break;
        default:
          throw new Error(`Unsupported fetch type: ${type}`);
      }
      setData(result);
      return result;
    } catch (err) {
      console.error(`useFetchRecipes error for type: ${type}:`, err);
      setError(err.message || 'Something went wrong fetching recipes.');
      setData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchRecipes,
    setData
  };
}
