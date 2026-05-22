import { MOCK_RECIPES } from '../mockData';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Internal helper to handle fetch safely
async function fetchSafe(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`MealDB Fetch warning for ${url}:`, error.message);
    throw error;
  }
}

export const recipeService = {
  // 1. Search by name
  async searchRecipes(query = '') {
    try {
      const data = await fetchSafe(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
      let apiMeals = data.meals || [];
      
      // Merge with offline matching mock data to ensure high-fidelity options
      let matchedMock = [...MOCK_RECIPES];
      if (query) {
        const lowerQuery = query.toLowerCase();
        matchedMock = matchedMock.filter(r => 
          r.strMeal.toLowerCase().includes(lowerQuery) ||
          r.strCategory?.toLowerCase().includes(lowerQuery) ||
          r.strArea?.toLowerCase().includes(lowerQuery) ||
          r.strInstructions?.toLowerCase().includes(lowerQuery)
        );
      }
      
      const combined = [...apiMeals];
      matchedMock.forEach(mock => {
        if (!combined.some(api => api.idMeal === mock.idMeal)) {
          combined.push(mock);
        }
      });
      
      return combined;
    } catch (error) {
      // Offline fallback
      const lowerQuery = query.toLowerCase();
      return MOCK_RECIPES.filter(r => 
        r.strMeal.toLowerCase().includes(lowerQuery) ||
        r.strCategory?.toLowerCase().includes(lowerQuery) ||
        r.strArea?.toLowerCase().includes(lowerQuery) ||
        r.strInstructions?.toLowerCase().includes(lowerQuery)
      );
    }
  },

  // 2. Filter by category
  async getRecipesByCategory(category) {
    try {
      const data = await fetchSafe(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      let apiMeals = data.meals || [];
      
      // Inject matching mock recipes as well
      const matchedMock = MOCK_RECIPES.filter(r => r.strCategory === category);
      
      const combined = [...apiMeals];
      matchedMock.forEach(mock => {
        if (!combined.some(api => api.idMeal === mock.idMeal)) {
          combined.push(mock);
        }
      });
      
      return combined;
    } catch (error) {
      return MOCK_RECIPES.filter(r => r.strCategory === category);
    }
  },

  // 3. Filter by area/cuisine
  async getRecipesByArea(area) {
    try {
      const data = await fetchSafe(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
      let apiMeals = data.meals || [];
      
      const matchedMock = MOCK_RECIPES.filter(r => r.strArea === area);
      
      const combined = [...apiMeals];
      matchedMock.forEach(mock => {
        if (!combined.some(api => api.idMeal === mock.idMeal)) {
          combined.push(mock);
        }
      });
      
      return combined;
    } catch (error) {
      return MOCK_RECIPES.filter(r => r.strArea === area);
    }
  },

  // 4. Fetch details by ID
  async getRecipeById(id) {
    try {
      const data = await fetchSafe(`${BASE_URL}/lookup.php?i=${id}`);
      if (data.meals && data.meals[0]) {
        return data.meals[0];
      }
      throw new Error(`Recipe with ID ${id} not found on MealDB`);
    } catch (error) {
      const mockMatch = MOCK_RECIPES.find(r => r.idMeal === String(id));
      if (mockMatch) return mockMatch;
      throw new Error(`Recipe ID ${id} not found in offline database`);
    }
  },

  // 5. Fetch random recipe
  async getRandomRecipe() {
    try {
      const data = await fetchSafe(`${BASE_URL}/random.php`);
      if (data.meals && data.meals[0]) {
        return data.meals[0];
      }
      throw new Error('Could not retrieve random recipe');
    } catch (error) {
      const randomIndex = Math.floor(Math.random() * MOCK_RECIPES.length);
      return MOCK_RECIPES[randomIndex];
    }
  },

  // 6. Get all categories
  async getCategories() {
    try {
      const data = await fetchSafe(`${BASE_URL}/categories.php`);
      return data.categories || [];
    } catch (error) {
      // Local categories fallback if network issue
      const cats = Array.from(new Set(MOCK_RECIPES.map(r => r.strCategory))).map((c, i) => ({
        idCategory: String(i + 1),
        strCategory: c,
        strCategoryThumb: `https://www.themealdb.com/images/category/${c.toLowerCase()}.png`,
        strCategoryDescription: `Browse yummy ${c} dishes`
      }));
      return cats;
    }
  }
};
