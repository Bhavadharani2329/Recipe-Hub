import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, ChevronRight, CheckCircle, Video, ListTodo, Plus, Check } from 'lucide-react';
import { getRecipeStats } from './RecipeCard';

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

export default function RecipeDetail({ recipe, onClose, onAddIngredientsToShoppingList }) {
  const [activeSubTab, setActiveSubTab] = useState('ingredients');
  const [servings, setServings] = useState(4);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [stepsCompleted, setStepsCompleted] = useState({});

  const { cookTime, difficulty } = getRecipeStats(recipe);

  // Extract instructions into steps
  const steps = recipe.strInstructions
    ? recipe.strInstructions
        .split(/(?:\r?\n)+/)
        .map((step) => step.trim())
        .filter((step) => step.length > 8 && !step.startsWith('STEP') && !step.match(/^\d+\.?$/))
    : [];

  // Parse ingredients and measures
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

  // Pre-select all ingredients by default
  useEffect(() => {
    const initial = {};
    ingredientsList.forEach((ing) => {
      initial[ing.id] = true;
    });
    setSelectedIngredients(initial);
  }, [recipe]);

  const toggleIngredientSelect = (id) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleStepCompleted = (index) => {
    setStepsCompleted((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Extract YouTube ID
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

  const multiplier = servings / 4;

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
      // Brief visual indication or simple reset is fine, let's keep all ticked
      alert(`Added ${itemsToAdd.length} items to your shopping list!`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass animate-slide-up"
        style={{
          backgroundColor: 'hsl(var(--bg-secondary))',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid hsl(var(--border))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Area */}
        <div style={{ position: 'relative', height: '240px', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={recipe.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'}
            alt={recipe.strMeal}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0.2) 80%)',
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Category badges and Title */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '24px',
            right: '24px',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {recipe.strCategory && (
                <span className="badge badge-primary" style={{ backgroundColor: 'hsl(var(--primary))', color: '#fff' }}>
                  {recipe.strCategory}
                </span>
              )}
              {recipe.strArea && (
                <span className="badge badge-secondary" style={{ backgroundColor: 'hsl(var(--secondary))', color: '#fff' }}>
                  {recipe.strArea} Cuisine
                </span>
              )}
            </div>
            <h2 style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              {recipe.strMeal}
            </h2>
          </div>
        </div>

        {/* Info bar (Servings, Time, Difficulty) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--bg-tertiary))',
          flexShrink: 0,
        }}>
          {/* Servings Modifier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
              Servings:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="portion-btn"
                disabled={servings <= 1}
              >
                -
              </button>
              <span style={{ fontSize: '1rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
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

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: 'hsl(var(--primary))' }} />
              <span style={{ fontWeight: 600 }}>{cookTime} Mins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} style={{ color: 'hsl(var(--accent))' }} />
              <span style={{ fontWeight: 600 }}>{difficulty}</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid hsl(var(--border))',
          padding: '0 24px',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setActiveSubTab('ingredients')}
            className={`tab-btn ${activeSubTab === 'ingredients' ? 'active' : ''}`}
            style={{
              padding: '16px 20px',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Ingredients ({ingredientsList.length})
          </button>
          
          <button
            onClick={() => setActiveSubTab('instructions')}
            className={`tab-btn ${activeSubTab === 'instructions' ? 'active' : ''}`}
            style={{
              padding: '16px 20px',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Instructions ({steps.length || 1} Steps)
          </button>

          {youtubeUrl && (
            <button
              onClick={() => setActiveSubTab('video')}
              className={`tab-btn ${activeSubTab === 'video' ? 'active' : ''}`}
              style={{
                padding: '16px 20px',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Video size={16} />
              Video Tutorial
            </button>
          )}
        </div>

        {/* Modal Scroll Content */}
        <div 
          className="custom-scroll" 
          style={{
            padding: '24px',
            flexGrow: 1,
            overflowY: 'auto',
            backgroundColor: 'hsl(var(--bg-secondary))',
          }}
        >
          {/* Tab 1: Ingredients */}
          {activeSubTab === 'ingredients' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                  Tick the ingredients you want, then export them to your shopping list.
                </p>
                <button
                  onClick={handleAddSelectedToShopping}
                  style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Plus size={16} /> Add to Shopping List
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginTop: '8px' }}>
                {ingredientsList.map((ing) => {
                  const isChecked = !!selectedIngredients[ing.id];
                  const scaledMeasurement = scaleMeasure(ing.measure, multiplier);
                  
                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleIngredientSelect(ing.id)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: isChecked ? 'hsl(var(--bg-tertiary))' : 'hsl(var(--bg-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = 'hsl(var(--primary) / 0.4)'}
                      onMouseLeave={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `2px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--text-tertiary))'}`,
                        backgroundColor: isChecked ? 'hsl(var(--primary))' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        transition: 'all var(--transition-fast)',
                      }}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                          {ing.name}
                        </span>
                        {scaledMeasurement && (
                          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
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

          {/* Tab 2: Instructions */}
          {activeSubTab === 'instructions' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                Follow step-by-step instructions. Check them off as you complete them to track your progress!
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
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid hsl(var(--border))',
                          backgroundColor: isCompleted ? 'hsl(var(--bg-tertiary))' : 'hsl(var(--bg-secondary))',
                          display: 'flex',
                          gap: '16px',
                          cursor: 'pointer',
                          opacity: isCompleted ? 0.65 : 1,
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        {/* Step Number Circle */}
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isCompleted ? 'hsl(var(--secondary))' : 'hsl(var(--primary) / 0.1)',
                          color: isCompleted ? '#fff' : 'hsl(var(--primary))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                          transition: 'all var(--transition-fast)',
                        }}>
                          {isCompleted ? <Check size={16} strokeWidth={3} /> : index + 1}
                        </div>

                        {/* Step Description */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{
                            fontSize: '0.95rem',
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
                  // Fallback if formatting instructions fails
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid hsl(var(--border))',
                    fontSize: '0.95rem',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-line',
                  }}>
                    {recipe.strInstructions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Video */}
          {activeSubTab === 'video' && youtubeUrl && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                height: 0,
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#000',
                border: '1px solid hsl(var(--border))',
              }}>
                <iframe
                  src={youtubeUrl}
                  title="YouTube video player"
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
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', textAlign: 'center' }}>
                Follow along with a live video chef guide!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
