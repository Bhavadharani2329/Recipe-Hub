import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Flame, Clock } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import useFetchRecipes from '../hooks/useFetchRecipes';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Home({ favorites, onBookmarkToggle }) {
  const { isAuthenticated, user } = useAuth();
  const { data: categories, loading: loadingCats, fetchRecipes: fetchCats } = useFetchRecipes();
  const { data: trendingRecipes, loading: loadingTrending, fetchRecipes: fetchTrending } = useFetchRecipes();
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recipe_hub_recently_viewed');
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse recently viewed recipes:', e.message);
      setRecentlyViewed([]);
    }
  }, []);

  // Fetch initial Home Page data (Categories and Trending/Featured recipes)
  useEffect(() => {
    fetchCats('categories');
    fetchTrending('search', 'chicken'); // Standard default is chicken recipes for trending
  }, [fetchCats, fetchTrending]);

  const fallbackCategories = [
    { strCategory: 'Beef', strCategoryThumb: 'https://www.themealdb.com/images/category/beef.png' },
    { strCategory: 'Chicken', strCategoryThumb: 'https://www.themealdb.com/images/category/chicken.png' },
    { strCategory: 'Dessert', strCategoryThumb: 'https://www.themealdb.com/images/category/dessert.png' },
    { strCategory: 'Lamb', strCategoryThumb: 'https://www.themealdb.com/images/category/lamb.png' },
    { strCategory: 'Pasta', strCategoryThumb: 'https://www.themealdb.com/images/category/pasta.png' },
    { strCategory: 'Seafood', strCategoryThumb: 'https://www.themealdb.com/images/category/seafood.png' },
    { strCategory: 'Vegetarian', strCategoryThumb: 'https://www.themealdb.com/images/category/vegetarian.png' },
    { strCategory: 'Breakfast', strCategoryThumb: 'https://www.themealdb.com/images/category/breakfast.png' },
  ];

  const displayedCats = categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <div style={{ paddingBottom: '60px' }} className="animate-fade-in">
      {/* Hero Banner Section */}
      <section style={{
        padding: '80px 24px 60px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, hsl(var(--primary) / 0.08) 0%, transparent 100%)',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} /> Cook Like a Pro
          </div>
          
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 850,
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            lineHeight: '1.15',
            color: 'hsl(var(--text-primary))'
          }}>
            What would you like to <span style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>cook today?</span>
          </h1>
          
          <p style={{
            color: 'hsl(var(--text-secondary))',
            fontSize: '1.15rem',
            maxWidth: '580px',
            margin: '0 auto 12px auto',
            lineHeight: '1.6'
          }}>
            Discover delicious food recipes, customize portion sizes, generate shopping lists, and track your kitchen timing seamlessly.
          </p>

          <SearchBar />
        </div>
      </section>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
        
        {/* Logged In User Streak & Achievement Widget */}
        {isAuthenticated && user && (
          <section className="glass animate-slide-up" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid hsl(var(--border))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: 'var(--shadow-sm), var(--shadow-glow)',
            background: 'linear-gradient(90deg, hsl(var(--bg-secondary)), hsl(var(--primary) / 0.02))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                🔥
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Welcome back, Chef {user.username}!</h3>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.88rem' }}>
                  You have kept your daily cooking streak active! Keep exploring new dishes.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</p>
                <span style={{ fontSize: '1.45rem', fontWeight: 850, color: 'hsl(var(--primary))' }}>
                  {user.currentStreak} Days
                </span>
              </div>
              
              <div style={{ borderLeft: '1px solid hsl(var(--border))', height: '36px' }} />

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Longest Streak</p>
                <span style={{ fontSize: '1.45rem', fontWeight: 850, color: 'hsl(var(--accent))' }}>
                  {user.longestStreak} Days
                </span>
              </div>

              {/* Achievement Badges showcase */}
              {user.currentStreak > 0 && (
                <>
                  <div style={{ borderLeft: '1px solid hsl(var(--border))', height: '36px' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {user.currentStreak >= 1 && <span style={{ fontSize: '1.6rem' }} title="1 Day Streak - Getting Started">🔥</span>}
                    {user.currentStreak >= 3 && <span style={{ fontSize: '1.6rem' }} title="3 Day Streak - Consistent Cook">🍳</span>}
                    {user.currentStreak >= 7 && <span style={{ fontSize: '1.6rem' }} title="7 Day Streak - Dedicated Chef">👨‍🍳</span>}
                    {user.currentStreak >= 15 && <span style={{ fontSize: '1.6rem' }} title="15 Day Streak - Kitchen Expert">🏆</span>}
                    {user.currentStreak >= 30 && <span style={{ fontSize: '1.6rem' }} title="30 Day Streak - Cooking Champion">👑</span>}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Clock size={20} style={{ color: 'hsl(var(--primary))' }} />
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Recently Viewed Recipes</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {recentlyViewed.slice(0, 4).map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  isBookmarked={favorites.some(f => String(f.idMeal) === String(recipe.idMeal))}
                  onBookmarkToggle={onBookmarkToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Explore Categories Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Browse by Category</h2>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Fresh and high quality cooking genres</p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '16px'
          }}>
            {displayedCats.slice(0, 12).map((cat) => (
              <Link
                key={cat.strCategory}
                to={`/category/${cat.strCategory}`}
                className="card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'hsl(var(--bg-secondary))',
                  border: '1px solid hsl(var(--border))',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'hsl(var(--bg-tertiary))',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={cat.strCategoryThumb}
                    alt={cat.strCategory}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://www.themealdb.com/images/category/chicken.png';
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  {cat.strCategory}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured / Trending Recipes Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} style={{ color: 'hsl(var(--primary))' }} /> Trending Recipes
              </h2>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Highly searched and recommended dishes</p>
            </div>
            
            <Link 
              to="/search?q=chicken" 
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'hsl(var(--primary))',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              See All <ArrowRight size={16} />
            </Link>
          </div>

          {loadingTrending ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer" style={{ height: '350px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {trendingRecipes.slice(0, 8).map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  isBookmarked={favorites.some(f => String(f.idMeal) === String(recipe.idMeal))}
                  onBookmarkToggle={onBookmarkToggle}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
