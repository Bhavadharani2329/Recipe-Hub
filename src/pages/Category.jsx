import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import useFetchRecipes from '../hooks/useFetchRecipes';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';

export default function Category({ favorites, onBookmarkToggle }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const { data: recipes, loading, error, fetchRecipes } = useFetchRecipes();

  useEffect(() => {
    fetchRecipes('category', name);
  }, [name, fetchRecipes]);

  return (
    <div style={{ padding: '40px 0 80px 0' }} className="animate-fade-in">
      <div className="container">
        
        {/* Navigation Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          color: 'hsl(var(--text-secondary))',
          marginBottom: '24px'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }} onMouseEnter={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Discover</Link>
          <ChevronRight size={14} />
          <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{name} Category</span>
        </div>

        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid hsl(var(--border))',
          paddingBottom: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 850 }}>{name} Dishes</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem', marginTop: '4px' }}>
              Explore our handpicked curation of delicious {name.toLowerCase()} preparations.
            </p>
          </div>
          
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 16px',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'hsl(var(--bg-secondary))',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Recipes Grid listing */}
        {loading ? (
          <Loader variant="grid" count={8} />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Category Fetch Failed</h2>
            <p style={{ color: 'hsl(var(--text-secondary))' }}>{error}</p>
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
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Recipes Found</h3>
            <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '6px' }}>
              We couldn't find any recipes registered in the "{name}" category.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
