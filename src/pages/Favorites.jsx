import React from 'react';
import { Heart, ChefHat, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

export default function Favorites({ favorites, onBookmarkToggle }) {
  return (
    <div style={{ padding: '40px 0 80px 0' }} className="animate-fade-in">
      <div className="container">
        
        {/* Title Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid hsl(var(--border))',
          paddingBottom: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 850 }}>Your E-Cookbook Favorites</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
              Your curated collection of {favorites.length} saved recipes, persisted offline.
            </p>
          </div>
        </div>

        {/* Content list or empty state */}
        {favorites.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isBookmarked={true}
                onBookmarkToggle={onBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty Favorites list */
          <div
            className="flex-center"
            style={{
              flexDirection: 'column',
              textAlign: 'center',
              padding: '80px 24px',
              backgroundColor: 'hsl(var(--bg-secondary))',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid hsl(var(--border))',
              maxWidth: '520px',
              margin: '40px auto 0 auto',
              gap: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={36} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px' }}>
                Your E-Cookbook is Empty
              </h3>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Explore trending dishes, search by ingredient, or filter by cuisine and bookmark them by clicking the heart button to save them here!
              </p>
            </div>
            
            <Link
              to="/"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="card-hover"
            >
              <Search size={16} /> Browse Cooking Recipes
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
