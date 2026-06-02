import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { recipeService } from '../services/recipeService';

const POPULAR_CATEGORIES = [
  'All',
  'Beef',
  'Chicken',
  'Dessert',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
];

const POPULAR_AREAS = [
  'All Cuisines',
  'American',
  'British',
  'Canadian',
  'Chinese',
  'French',
  'Indian',
  'Italian',
  'Jamaican',
  'Japanese',
  'Mexican',
  'Spanish',
  'Thai',
];

export default function SearchBar({
  initialSearchQuery = '',
  initialCategory = '',
  initialArea = '',
  onSearchChange, // optional callback
  placeholder = "Search recipes, ingredients or keywords...",
  hideSurpriseMe = false
}) {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [inputVal, setInputVal] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedArea, setSelectedArea] = useState(initialArea);

  // Sync state if changed externally
  useEffect(() => {
    setInputVal(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedArea(initialArea);
  }, [initialArea]);

  const triggerSearch = (query, cat, area) => {
    if (onSearchChange) {
      onSearchChange({ query, category: cat, area });
    } else {
      // Build route params
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (cat) params.set('c', cat);
      if (area) params.set('a', area);
      
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSearch(inputVal, selectedCategory, selectedArea);
  };

  const handleClear = () => {
    setInputVal('');
    triggerSearch('', selectedCategory, selectedArea);
  };

  const handleCategorySelect = (cat) => {
    const nextCat = cat === 'All' ? '' : cat;
    setSelectedCategory(nextCat);
    triggerSearch(inputVal, nextCat, selectedArea);
  };

  const handleAreaSelect = (area) => {
    const nextArea = area === 'All Cuisines' ? '' : area;
    setSelectedArea(nextArea);
    triggerSearch(inputVal, selectedCategory, nextArea);
  };

  const handleSurpriseMe = async () => {
    try {
      const randomRecipe = await recipeService.getRandomRecipe();
      if (randomRecipe && randomRecipe.idMeal) {
        navigate(`/recipe/${randomRecipe.idMeal}`);
      }
    } catch (error) {
      console.error('Surprise Me failed:', error);
    }
  };

  return (
    <div style={{ margin: '32px 0 24px 0' }}>
      <form onSubmit={handleSubmit} style={{
        position: 'relative',
        maxWidth: '700px',
        margin: '0 auto',
        display: 'flex',
        gap: '12px',
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'hsl(var(--text-tertiary))',
          }} size={20} />
          
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '16px 48px 16px 48px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--bg-secondary))',
              color: 'hsl(var(--text-primary))',
              outline: 'none',
              fontSize: '1rem',
              transition: 'all var(--transition-fast)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
            onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
          />

          {inputVal && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-tertiary))',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '0 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid hsl(var(--border))',
            backgroundColor: showFilters ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--bg-secondary))',
            color: showFilters ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer'
          }}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

        {!hideSurpriseMe && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            style={{
              padding: '0 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
            className="card-hover"
          >
            <Sparkles size={16} />
            Surprise Me
          </button>
        )}
      </form>

      {/* Expanded Filters Panel */}
      <div style={{
        maxHeight: showFilters ? '300px' : '0',
        overflow: 'hidden',
        transition: 'max-height var(--transition-normal) ease-in-out',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <div className="glass" style={{
          marginTop: '16px',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--text-secondary))', marginBottom: '8px' }}>
              Categories
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto', 
              paddingBottom: '8px',
              scrollbarWidth: 'thin'
            }}>
              {POPULAR_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === (cat === 'All' ? '' : cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      backgroundColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--bg-tertiary))',
                      color: isSelected ? '#fff' : 'hsl(var(--text-primary))',
                      transition: 'all var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuisines */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--text-secondary))', marginBottom: '8px' }}>
              Cuisines
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto', 
              paddingBottom: '8px',
              scrollbarWidth: 'thin'
            }}>
              {POPULAR_AREAS.map((area) => {
                const isSelected = selectedArea === (area === 'All Cuisines' ? '' : area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleAreaSelect(area)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      backgroundColor: isSelected ? 'hsl(var(--secondary))' : 'hsl(var(--bg-tertiary))',
                      color: isSelected ? '#fff' : 'hsl(var(--text-primary))',
                      transition: 'all var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
