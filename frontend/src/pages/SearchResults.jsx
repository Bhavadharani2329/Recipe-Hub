import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, SlidersHorizontal, RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import useFetchRecipes from '../hooks/useFetchRecipes';

export default function SearchResults({ favorites, onBookmarkToggle }) {
  const [searchParams] = useSearchParams();
  const { data: recipes, loading, error, fetchRecipes } = useFetchRecipes();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('c') || '';
  const area = searchParams.get('a') || '';

  useEffect(() => {
    if (query) {
      fetchRecipes('search', query);
    } else if (category) {
      fetchRecipes('category', category);
    } else if (area) {
      fetchRecipes('area', area);
    } else {
      // If no query parameter, load everything by default
      fetchRecipes('search', '');
    }
  }, [query, category, area, fetchRecipes]);

  // Build appropriate header title
  const getHeaderTitle = () => {
    if (query) return `Results for "${query}"`;
    if (category) return `${category} Recipes`;
    if (area) return `${area} Cuisine`;
    return 'All Recipes';
  };

  return (
    <div style={{ padding: '32px 0 60px 0' }} className="animate-fade-in">
      <div className="container">
        
        {/* Reusable search bar at the top */}
        <div style={{ marginBottom: '40px' }}>
          <SearchBar
            initialSearchQuery={query}
            initialCategory={category}
            initialArea={area}
          />
        </div>

        {/* Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          borderBottom: '1px solid hsl(var(--border))',
          paddingBottom: '12px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{getHeaderTitle()}</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
              Found {recipes ? recipes.length : 0} culinary results
            </p>
          </div>
        </div>

        {/* Loading / Error / Results */}
        {loading ? (
          <Loader variant="grid" count={8} />
        ) : error ? (
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'hsl(var(--accent) / 0.1)',
            border: '1px solid hsl(var(--accent) / 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'hsl(var(--accent))',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <RefreshCw size={18} className="animate-spin" />
            <span>{error}</span>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isBookmarked={favorites.some(f => String(f.idMeal) === String(recipe.idMeal))}
                onBookmarkToggle={onBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              color: 'hsl(var(--text-secondary))',
              maxWidth: '480px',
              margin: '60px auto 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              backgroundColor: 'hsl(var(--bg-secondary))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SearchX size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'hsl(var(--text-primary))', marginBottom: '8px' }}>
                No Recipes Found
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                We couldn't find any recipes matching your criteria. Try adjusting your text search, removing filters, or looking up a different food term!
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
