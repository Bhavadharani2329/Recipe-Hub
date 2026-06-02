import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Save, X, ChefHat, Image, List, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import useAuth, { api } from '../hooks/useAuth';

export default function AddRecipe() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // State for form
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('Veg');
  const [imageUrl, setImageUrl] = useState('');
  const [cookingTime, setCookingTime] = useState(20);
  
  // State for list and editing
  const [myRecipes, setMyRecipes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // UX states
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Categories list
  const categoriesList = ['Veg', 'Non-Veg', 'Desserts', 'Drinks'];

  // Load custom recipes on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyRecipes();
    }
  }, [isAuthenticated]);

  const fetchMyRecipes = async () => {
    try {
      setFetching(true);
      const response = await api.get('/recipes/mine');
      setMyRecipes(response.data);
    } catch (err) {
      console.error('Error loading custom recipes:', err);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setIngredients('');
    setInstructions('');
    setCategory('Veg');
    setImageUrl('');
    setCookingTime(20);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isAuthenticated) {
      setError('You must be signed in to add recipes.');
      return;
    }

    if (!title || !ingredients || !instructions || !category) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const recipeData = { title, ingredients, instructions, category, imageUrl, cookingTime: Number(cookingTime) };

      if (editingId) {
        // Update Action
        const response = await api.put(`/recipes/${editingId}`, recipeData);
        setMessage(response.data.message || 'Recipe updated successfully!');
      } else {
        // Create Action
        const response = await api.post('/recipes', recipeData);
        setMessage(response.data.message || 'Recipe created successfully!');
      }

      resetForm();
      fetchMyRecipes();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || 'Failed to save recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipe) => {
    setEditingId(recipe._id);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setCategory(recipe.category);
    setImageUrl(recipe.imageUrl || '');
    setCookingTime(recipe.cookingTime || 20);
    
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    setError('');
    setMessage('');
    try {
      const response = await api.delete(`/recipes/${id}`);
      setMessage(response.data.message || 'Recipe deleted successfully.');
      fetchMyRecipes();
      if (editingId === id) resetForm();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete recipe.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }} className="animate-fade-in">
        <div className="glass" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          <AlertCircle size={40} style={{ color: 'hsl(var(--primary))', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Authentication Required</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '24px', lineHeight: '1.6' }}>
            Please sign in or register to add and manage your custom culinary creations!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: 'hsl(var(--primary))', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
              Log In
            </button>
            <button onClick={() => navigate('/signup')} style={{ padding: '10px 20px', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }} className="animate-fade-in">
      <div className="container add-recipe-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
        
        {/* Title Header */}
        <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChefHat style={{ color: 'hsl(var(--primary))' }} /> 
            {editingId ? 'Edit Your Recipe' : 'Add Custom Recipe'}
          </h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem', marginTop: '4px' }}>
            Create and save your personalized home recipes directly in MongoDB.
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div style={{ backgroundColor: 'rgba(21, 128, 61, 0.1)', border: '1px solid rgba(21, 128, 61, 0.2)', color: 'hsl(var(--secondary))', padding: '14px 18px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '14px 18px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* LEFT: FORM BLOCK */}
          <section className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border))', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 750, marginBottom: '20px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '10px' }}>
              Recipe Details
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Recipe Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Recipe Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Saffron Garlic Spaghetti"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                  required
                />
              </div>

              {/* Category selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--bg-secondary))', outline: 'none', cursor: 'pointer' }}
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Cooking Time (in minutes) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Cooking Time (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                  required
                />
              </div>

              {/* Image URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Image size={14} /> Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                />
              </div>

              {/* Ingredients */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Ingredients * (comma-separated or one per line)</label>
                <textarea
                  rows={4}
                  placeholder="e.g. 200g Spaghetti, 2 tbsp Garlic, 1 tsp Chilli flakes"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                  required
                />
              </div>

              {/* Instructions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Preparation Instructions * (separate steps with newlines)</label>
                <textarea
                  rows={6}
                  placeholder="1. Boil salted water and cook spaghetti.&#10;2. Saute garlic in hot olive oil.&#10;3. Toss spaghetti in garlic oil and serve warm."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                  required
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flexGrow: 1,
                    padding: '12px',
                    backgroundColor: 'hsl(var(--primary))',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-md)',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : editingId ? (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Save Recipe
                    </>
                  )}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'hsl(var(--bg-tertiary))',
                      color: 'hsl(var(--text-primary))',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* RIGHT: LIST BLOCK */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '10px' }}>
              <List size={18} style={{ color: 'hsl(var(--primary))' }} /> Your Saved Custom Recipes
            </h3>

            {fetching ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
              </div>
            ) : myRecipes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
                {myRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="glass"
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid hsl(var(--border))',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0, fontSize: '1.1rem', fontWeight: 800, justifyContent: 'center' }}>
                          {recipe.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {recipe.title}
                        </h4>
                        <span className="badge badge-primary" style={{ fontSize: '0.62rem', padding: '1px 6px', marginTop: '2px' }}>
                          {recipe.category}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleEdit(recipe)}
                        style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border))', color: 'hsl(var(--text-secondary))', display: 'flex', backgroundColor: 'hsl(var(--bg-secondary))' }}
                        title="Edit recipe"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                        title="Delete recipe"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--radius-md)', border: '1px dashed hsl(var(--border))', color: 'hsl(var(--text-secondary))' }}>
                <p style={{ fontWeight: 500 }}>No custom recipes found.</p>
                <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Fill out the details on the left to register your first recipe!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}