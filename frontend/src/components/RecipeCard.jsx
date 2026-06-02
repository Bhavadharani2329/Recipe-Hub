import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Flame } from 'lucide-react';

// Helpers to generate realistic cooking time & difficulty procedurally
export function getRecipeStats(recipe) {
  if (!recipe) return { cookTime: 20, difficulty: 'Medium', ingredientCount: 0 };

  // Single Source of Truth: if cookingTime is stored in database, use it directly!
  if (recipe.cookingTime) {
    const cookTime = Number(recipe.cookingTime);
    let difficulty = 'Medium';
    if (cookTime <= 15) difficulty = 'Easy';
    else if (cookTime >= 60) difficulty = 'Hard';
    return { cookTime, difficulty, ingredientCount: 0 };
  }

  // Count ingredients (up to 20 in TheMealDB format)
  let ingredientCount = 0;
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`] && recipe[`strIngredient${i}`].trim()) {
      ingredientCount++;
    }
  }

  const instructionLength = recipe.strInstructions ? recipe.strInstructions.length : 300;
  
  // Calculate cook time: base 10m + ingredients*2m + instructions length/30, rounded to nearest 5
  let rawTime = 10 + (ingredientCount * 2) + Math.round(instructionLength / 35);
  let cookTime = Math.max(15, Math.round(rawTime / 5) * 5); // steps of 5 mins, min 15
  if (cookTime > 120) cookTime = 120; // max 2 hours

  // Calculate difficulty
  let difficulty = 'Medium';
  if (ingredientCount <= 6 && instructionLength < 600) {
    difficulty = 'Easy';
  } else if (ingredientCount >= 12 || instructionLength > 1200) {
    difficulty = 'Hard';
  }

  return { cookTime, difficulty, ingredientCount };
}

export default function RecipeCard({ recipe, isBookmarked, onBookmarkToggle }) {
  if (!recipe) return null;
  const { cookTime, difficulty } = getRecipeStats(recipe);

  const difficultyColor = {
    'Easy': 'badge-secondary',
    'Medium': 'badge-accent',
    'Hard': 'badge-primary',
  }[difficulty] || 'badge-accent';

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle(recipe);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600';
  const displayImage = recipe.strMealThumb || fallbackImage;

  return (
    <Link
      to={`/recipe/${recipe.idMeal}`}
      className="card-hover animate-slide-up"
      style={{
        backgroundColor: 'hsl(var(--bg-secondary))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: 'inherit',
        textDecoration: 'none'
      }}
    >
      {/* Floating Bookmark Button */}
      <button
        onClick={handleBookmarkClick}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isBookmarked ? 'hsl(var(--primary))' : 'rgba(15, 15, 14, 0.6)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all var(--transition-fast)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        onMouseEnter={(e) => {
          if (!isBookmarked) e.currentTarget.style.backgroundColor = 'rgba(15, 15, 14, 0.8)';
        }}
        onMouseLeave={(e) => {
          if (!isBookmarked) e.currentTarget.style.backgroundColor = 'rgba(15, 15, 14, 0.6)';
        }}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>

      {/* Image Container with zoom hover */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '65%', // Aspect Ratio 16:10.4
        overflow: 'hidden',
        backgroundColor: 'hsl(var(--bg-tertiary))',
      }}>
        <img
          src={displayImage}
          alt={recipe.strMeal}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)',
          }}
          className="recipe-image"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Category & Cuisines floating labels */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
          zIndex: 2,
        }}>
          {recipe.strCategory && (
            <span className="badge badge-primary" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'hsl(var(--primary) / 0.85)', color: '#fff' }}>
              {recipe.strCategory}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div>
          {/* Cuisine Area */}
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'hsl(var(--text-secondary))',
            letterSpacing: '0.05em',
            marginBottom: '4px'
          }}>
            {recipe.strArea || 'International'} Cuisine
          </p>
          
          {/* Title */}
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'hsl(var(--text-primary))',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.7em',
            lineHeight: '1.35',
          }}>
            {recipe.strMeal}
          </h3>
        </div>

        {/* Stats footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid hsl(var(--border))',
          fontSize: '0.8rem',
          color: 'hsl(var(--text-secondary))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} style={{ color: 'hsl(var(--primary))' }} />
            <span>{cookTime} mins</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} style={{ color: 'hsl(var(--accent))' }} />
            <span className={`badge ${difficultyColor}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
