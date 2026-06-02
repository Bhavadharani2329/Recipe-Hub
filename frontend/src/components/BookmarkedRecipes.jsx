import React from 'react';
import { Bookmark, ChefHat } from 'lucide-react';
import RecipeCard from './RecipeCard';

export default function BookmarkedRecipes({
  bookmarkedRecipes,
  onBookmarkToggle,
  onRecipeClick,
  onNavigateToDiscover,
}) {
  if (bookmarkedRecipes.length === 0) {
    return (
      <div
        className="animate-fade-in flex-center"
        style={{
          flexDirection: 'column',
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: 'hsl(var(--bg-secondary))',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid hsl(var(--border))',
          maxWidth: '500px',
          margin: '40px auto 0 auto',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bookmark size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            No Bookmarked Recipes
          </h3>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem' }}>
            Bookmarked recipes are saved here so you can easily access them later. 
            Start searching for delicious recipes to build your list!
          </p>
        </div>
        <button
          onClick={onNavigateToDiscover}
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Discover Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <Bookmark size={24} style={{ color: 'hsl(var(--primary))' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Your Saved Bookmarks</h2>
        <span className="badge badge-primary">{bookmarkedRecipes.length} recipes</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {bookmarkedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            isBookmarked={true}
            onBookmarkToggle={onBookmarkToggle}
            onClick={() => onRecipeClick(recipe)}
          />
        ))}
      </div>
    </div>
  );
}
