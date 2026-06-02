import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, ChevronRight, CheckCircle, Video, Plus, Check, Heart, HelpCircle, Bell, Award, Sparkles } from 'lucide-react';
import useFetchRecipes from '../hooks/useFetchRecipes';
import { getRecipeStats } from '../components/RecipeCard';
import Loader from '../components/Loader';
import Timer from '../components/Timer';
import useAuth, { api } from '../hooks/useAuth';

// Scaling helper
function scaleMeasure(measureStr, multiplier) {
  if (!measureStr) return '';
  const trimmed = measureStr.trim();
  if (!trimmed) return '';

  // Matches fractions "1 1/2", "1/2", decimals "0.5", and integers "2"
  const numberRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)/g;
  const match = trimmed.match(numberRegex);

  if (!match) return trimmed; // e.g. "pinch", "to taste"

  const numStr = match[0];
  const unitStr = trimmed.slice(numStr.length);

  let val = 0;
  if (numStr.includes('/')) {
    const parts = numStr.trim().split(/\s+/);
    if (parts.length === 2) {
      const whole = parseFloat(parts[0]);
      const fracParts = parts[1].split('/');
      const frac = parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
      val = whole + frac;
    } else {
      const fracParts = parts[0].split('/');
      val = parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    }
  } else {
    val = parseFloat(numStr);
  }

  if (isNaN(val)) return trimmed;

  const scaledVal = val * multiplier;
  let formattedVal = '';
  const whole = Math.floor(scaledVal);
  const frac = scaledVal - whole;

  if (frac === 0) {
    formattedVal = whole.toString();
  } else {
    // round to nearest common fractions
    const diffs = [
      { f: '1/8', v: 0.125 },
      { f: '1/4', v: 0.25 },
      { f: '1/3', v: 0.333 },
      { f: '1/2', v: 0.5 },
      { f: '2/3', v: 0.667 },
      { f: '3/4', v: 0.75 },
    ];

    let minDiff = 0.06; // tolerance
    let closest = null;

    for (const d of diffs) {
      const diff = Math.abs(frac - d.v);
      if (diff < minDiff) {
        minDiff = diff;
        closest = d.f;
      }
    }

    if (closest) {
      formattedVal = whole > 0 ? `${whole} ${closest}` : closest;
    } else {
      formattedVal = scaledVal.toFixed(1).replace(/\.0$/, '');
    }
  }

  return `${formattedVal}${unitStr}`;
}

export default function RecipeDetails({ favorites, onBookmarkToggle, onAddIngredientsToShoppingList }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipe, loading, error, fetchRecipes } = useFetchRecipes();

  const [activeSubTab, setActiveSubTab] = useState('ingredients');
  const [servings, setServings] = useState(4);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [stepsCompleted, setStepsCompleted] = useState({});
  const [showTimer, setShowTimer] = useState(false);

  // Authentication & Cooking Completion states
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [loggingCompletion, setLoggingCompletion] = useState(false);

  const handleTimerComplete = async () => {
    setShowTimer(false);

    if (isAuthenticated) {
      try {
        setLoggingCompletion(true);
        const response = await api.post('/streaks/complete', {
          recipeId: String(recipe.idMeal),
          recipeTitle: recipe.strMeal
        });
        
        setCompletionData(response.data);
        setShowCompletionModal(true);
        
        // Refresh profile stats (streak & badges) so Navbar updates in real time
        refreshProfile();
      } catch (err) {
        console.error('Error logging completion streak:', err);
        setCompletionData({
          appreciationMessage: '🎉 Great job! You successfully completed this recipe.',
          stats: { currentStreak: 1, longestStreak: 1 },
          badges: [{ name: 'Getting Started', icon: '🔥', desc: '1 Day Streak' }]
        });
        setShowCompletionModal(true);
      } finally {
        setLoggingCompletion(false);
      }
    } else {
      setCompletionData({
        appreciationMessage: '🎉 Great job! You successfully completed this recipe.',
        isGuest: true
      });
      setShowCompletionModal(true);
    }
  };

  // Fetch recipe by ID on mount/id change
  useEffect(() => {
    fetchRecipes('id', id).then((data) => {
      if (data) {
        // Track recently viewed
        saveRecentlyViewed(data);
      }
    });
    // Reset page states
    setActiveSubTab('ingredients');
    setServings(4);
    setStepsCompleted({});
    setSelectedIngredients({});
  }, [id, fetchRecipes]);

  // Helper to persist Recently Viewed recipes in LocalStorage
  const saveRecentlyViewed = (currentRecipe) => {
    try {
      const saved = localStorage.getItem('recipe_hub_recently_viewed');
      let list = saved ? JSON.parse(saved) : [];
      
      // Filter out duplicate
      list = list.filter((r) => String(r.idMeal) !== String(currentRecipe.idMeal));
      
      // Prepend and limit size to 4
      list.unshift({
        idMeal: currentRecipe.idMeal,
        strMeal: currentRecipe.strMeal,
        strCategory: currentRecipe.strCategory,
        strArea: currentRecipe.strArea,
        strMealThumb: currentRecipe.strMealThumb
      });
      
      localStorage.setItem('recipe_hub_recently_viewed', JSON.stringify(list.slice(0, 4)));
    } catch (e) {
      console.warn('Recently Viewed storage error:', e);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px 0' }}><Loader variant="spinner" message="Preparing recipe cards..." /></div>;
  }

  if (error || !recipe) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Details Not Found</h2>
        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '24px' }}>
          {error || "We couldn't retrieve the cooking details for this recipe."}
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 20px',
            backgroundColor: 'hsl(var(--primary))',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const { cookTime, difficulty } = getRecipeStats(recipe);
  const isBookmarked = favorites.some((r) => String(r.idMeal) === String(recipe.idMeal));

  const difficultyColor = {
    'Easy': 'badge-secondary',
    'Medium': 'badge-accent',
    'Hard': 'badge-primary',
  }[difficulty];

  // Parse ingredients
  const ingredientsList = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredientsList.push({
        id: i,
        name: ing.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  // Pre-select ingredients
  if (Object.keys(selectedIngredients).length === 0 && ingredientsList.length > 0) {
    const initial = {};
    ingredientsList.forEach((ing) => {
      initial[ing.id] = true;
    });
    setSelectedIngredients(initial);
  }

  // Parse steps
  const steps = recipe.strInstructions
    ? recipe.strInstructions
        .split(/(?:\r?\n)+/)
        .map((step) => step.trim())
        .filter((step) => step.length > 8 && !step.startsWith('STEP') && !step.match(/^\d+\.?$/))
    : [];

  const multiplier = servings / 4;

  const toggleIngredientSelect = (itemId) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleStepCompleted = (idx) => {
    setStepsCompleted((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleAddSelectedToShopping = () => {
    const itemsToAdd = ingredientsList
      .filter((ing) => selectedIngredients[ing.id])
      .map((ing) => ({
        name: ing.name,
        measure: scaleMeasure(ing.measure, multiplier),
        recipeTitle: recipe.strMeal,
      }));
    
    if (itemsToAdd.length > 0) {
      onAddIngredientsToShoppingList(itemsToAdd);
      alert(`Added ${itemsToAdd.length} ingredients to your Shopping Checklist!`);
    }
  };

  // YouTube embed parser
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const youtubeUrl = getYoutubeEmbedUrl(recipe.strYoutube);

  return (
    <div style={{ padding: '32px 0 80px 0' }} className="animate-fade-in">
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Back and Bookmark Nav Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              color: 'hsl(var(--text-secondary))',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} /> Back to recipes
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Quick Timer Launcher */}
            <button
              onClick={() => setShowTimer(!showTimer)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid hsl(var(--border))',
                backgroundColor: showTimer ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--bg-secondary))',
                color: showTimer ? 'hsl(var(--primary))' : 'hsl(var(--text-primary))',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Clock size={16} /> {showTimer ? 'Close Timer' : 'Cooking Timer'}
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onBookmarkToggle(recipe)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isBookmarked ? 'hsl(var(--primary))' : 'hsl(var(--bg-secondary))',
                color: isBookmarked ? '#fff' : 'hsl(var(--text-primary))',
                border: `1px solid ${isBookmarked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Heart size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'Saved to E-Cookbook' : 'Add to Favorites'}
            </button>
          </div>
        </div>

        {/* Floating Timer Portal */}
        {showTimer && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            width: '300px'
          }}>
            <Timer
              defaultSeconds={cookTime * 60}
              onClose={() => setShowTimer(false)}
              onComplete={handleTimerComplete}
            />
          </div>
        )}

        {/* Cooking Session Completion Modal */}
        {showCompletionModal && completionData && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '24px'
          }} className="animate-fade-in">
            
            {/* Pure-CSS Confetti Particles celebration */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
              {Array.from({ length: 40 }).map((_, idx) => {
                const left = Math.random() * 100;
                const delay = Math.random() * 3;
                const duration = 2 + Math.random() * 2;
                const colors = ['#f97316', '#15803d', '#d97706', '#3b82f6', '#ec4899', '#a855f7'];
                const color = colors[idx % colors.length];
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: `${left}%`,
                      width: '10px',
                      height: '10px',
                      backgroundColor: color,
                      opacity: 0.8,
                      transform: `rotate(${Math.random() * 360}deg)`,
                      animation: `fall ${duration}s linear ${delay}s infinite`,
                      borderRadius: idx % 2 === 0 ? '50%' : '2px'
                    }}
                  />
                );
              })}
              <style>{`
                @keyframes fall {
                  0% { top: -10px; transform: translateY(0) rotate(0deg); }
                  100% { top: 100%; transform: translateY(100vh) rotate(720deg); }
                }
              `}</style>
            </div>

            <div 
              className="glass"
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'hsl(var(--bg-secondary))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 32px',
                boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                position: 'relative',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                textAlign: 'center',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              {/* Award Medal Icon */}
              <div style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: 'var(--shadow-md)',
                animation: 'pulse 2s infinite'
              }}>
                <Award size={36} />
              </div>

              <div>
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                  Recipe Completed!
                </span>
                <h2 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 850,
                  fontSize: '1.8rem',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}>
                  Delicious Masterpiece!
                </h2>
              </div>

              {/* Appreciation Message */}
              <p style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'hsl(var(--text-primary))',
                lineHeight: '1.5',
                padding: '16px 20px',
                backgroundColor: 'hsl(var(--bg-tertiary) / 0.5)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid hsl(var(--border))',
                width: '100%'
              }}>
                {completionData.appreciationMessage}
              </p>

              {/* Streak Widget & Stats (for Auth Users) */}
              {!completionData.isGuest ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Current Streak</p>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        🔥 {completionData.stats.currentStreak} Days
                      </span>
                    </div>
                    <div style={{ borderLeft: '1px solid hsl(var(--border))', height: '36px' }} />
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase' }}>Longest Streak</p>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--accent))', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        🏆 {completionData.stats.longestStreak} Days
                      </span>
                    </div>
                  </div>

                  {/* Badges Display */}
                  {completionData.badges && completionData.badges.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={14} style={{ color: 'hsl(var(--primary))' }} /> Badges Achieved
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {completionData.badges.map(badge => (
                          <div 
                            key={badge.id}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid hsl(var(--border))',
                              backgroundColor: 'hsl(var(--bg-secondary))',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                            title={badge.desc}
                          >
                            <span>{badge.icon}</span>
                            <span>{badge.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest warning to register */
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(217, 119, 6, 0.08)',
                  border: '1px dashed rgba(217, 119, 6, 0.3)',
                  color: 'hsl(var(--accent))',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  width: '100%',
                  lineHeight: '1.5'
                }}>
                  Sign in or create an account to start tracking daily cooking streaks and earning achievement badges!
                </div>
              )}

              {/* Close Action */}
              <button
                onClick={() => setShowCompletionModal(false)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                Continue Exploring
              </button>

            </div>
          </div>
        )}

        {/* Recipe Main Banner Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
          backgroundColor: 'hsl(var(--bg-secondary))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '40px'
        }} className="recipe-detail-grid">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {/* Left Portion: Massive image */}
            <div style={{ position: 'relative', minHeight: '320px', backgroundColor: 'hsl(var(--bg-tertiary))' }}>
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Right Portion: Title info, portion scale, stats */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {recipe.strCategory && (
                    <Link to={`/category/${recipe.strCategory}`} className="badge badge-primary" style={{ textDecoration: 'none' }}>
                      {recipe.strCategory}
                    </Link>
                  )}
                  {recipe.strArea && (
                    <span className="badge badge-secondary">
                      {recipe.strArea} Cuisine
                    </span>
                  )}
                </div>

                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 850,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                  color: 'hsl(var(--text-primary))'
                }}>
                  {recipe.strMeal}
                </h1>
              </div>

              {/* Cook Stats */}
              <div style={{
                display: 'flex',
                gap: '24px',
                borderTop: '1px solid hsl(var(--border))',
                borderBottom: '1px solid hsl(var(--border))',
                padding: '16px 0',
                fontSize: '0.95rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} style={{ color: 'hsl(var(--primary))' }} />
                  <div>
                    <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.75rem', fontWeight: 600, uppercase: true }}>Preparation</p>
                    <span style={{ fontWeight: 700 }}>{cookTime} Mins</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={18} style={{ color: 'hsl(var(--accent))' }} />
                  <div>
                    <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.75rem', fontWeight: 600, uppercase: true }}>Difficulty</p>
                    <span className={`badge ${difficultyColor}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Portion Control Modifier */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(var(--bg-tertiary))', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
                  Servings Portions
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="portion-btn"
                    disabled={servings <= 1}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="portion-btn"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tab Controls (Ingredients / Instructions / Walkthrough Video) */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid hsl(var(--border))',
          marginBottom: '24px',
          gap: '12px'
        }}>
          <button
            onClick={() => setActiveSubTab('ingredients')}
            className={`tab-btn ${activeSubTab === 'ingredients' ? 'active' : ''}`}
            style={{
              padding: '16px 24px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Ingredients ({ingredientsList.length})
          </button>
          
          <button
            onClick={() => setActiveSubTab('instructions')}
            className={`tab-btn ${activeSubTab === 'instructions' ? 'active' : ''}`}
            style={{
              padding: '16px 24px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cooking Steps ({steps.length || 1})
          </button>

          {youtubeUrl && (
            <button
              onClick={() => setActiveSubTab('video')}
              className={`tab-btn ${activeSubTab === 'video' ? 'active' : ''}`}
              style={{
                padding: '16px 24px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Video size={18} />
              Chef Video Guide
            </button>
          )}
        </div>

        {/* Content Tabs */}
        <div style={{
          backgroundColor: 'hsl(var(--bg-secondary))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Subtab 1: Ingredients scaling and checklist */}
          {activeSubTab === 'ingredients' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
                  Select the ingredients you need and add them directly to your globally active Shopping Checklist.
                </p>
                <button
                  onClick={handleAddSelectedToShopping}
                  className="btn-primary"
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Plus size={16} /> Add to Shopping List
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px',
                marginTop: '12px'
              }}>
                {ingredientsList.map((ing) => {
                  const isChecked = !!selectedIngredients[ing.id];
                  const scaledMeasurement = scaleMeasure(ing.measure, multiplier);
                  
                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleIngredientSelect(ing.id)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isChecked ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))'}`,
                        backgroundColor: isChecked ? 'hsl(var(--bg-tertiary))' : 'hsl(var(--bg-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        border: `2px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--text-tertiary))'}`,
                        backgroundColor: isChecked ? 'hsl(var(--primary))' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        transition: 'all var(--transition-fast)',
                        flexShrink: 0
                      }}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                          {ing.name}
                        </span>
                        {scaledMeasurement && (
                          <span style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                            {scaledMeasurement}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtab 2: Cooking Checklist Steps */}
          {activeSubTab === 'instructions' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
                Follow the kitchen directions step by step. Tick off finished steps to keep track of your cooking flow!
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                {steps.length > 0 ? (
                  steps.map((step, index) => {
                    const isCompleted = !!stepsCompleted[index];
                    return (
                      <div
                        key={index}
                        onClick={() => toggleStepCompleted(index)}
                        style={{
                          padding: '20px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${isCompleted ? 'hsl(var(--secondary) / 0.2)' : 'hsl(var(--border))'}`,
                          backgroundColor: isCompleted ? 'hsl(var(--bg-tertiary) / 0.4)' : 'hsl(var(--bg-secondary))',
                          display: 'flex',
                          gap: '20px',
                          cursor: 'pointer',
                          opacity: isCompleted ? 0.6 : 1,
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        {/* Step Circle */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isCompleted ? 'hsl(var(--secondary))' : 'hsl(var(--primary) / 0.1)',
                          color: isCompleted ? '#fff' : 'hsl(var(--primary))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                          transition: 'all var(--transition-fast)',
                        }}>
                          {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
                        </div>

                        {/* Step Description */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{
                            fontSize: '1.02rem',
                            lineHeight: '1.6',
                            color: 'hsl(var(--text-primary))',
                            textDecoration: isCompleted ? 'line-through' : 'none',
                          }}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback
                  <div style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid hsl(var(--border))',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-line',
                  }}>
                    {recipe.strInstructions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtab 3: YouTube Walkthrough Guide */}
          {activeSubTab === 'video' && youtubeUrl && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                height: 0,
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#000',
                border: '1px solid hsl(var(--border))',
                boxShadow: 'var(--shadow-md)'
              }}>
                <iframe
                  src={youtubeUrl}
                  title="YouTube Chef Guide Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))', textAlign: 'center', fontWeight: 500 }}>
                Check out the live cooking guide to perfect your flavors!
              </p>
            </div>
          )}
        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .recipe-detail-grid {
            border-radius: var(--radius-md) !important;
          }
        }
      `}</style>
    </div>
  );
}
