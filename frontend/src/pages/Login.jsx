import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'linear-gradient(180deg, hsl(var(--primary) / 0.03) 0%, transparent 100%)'
    }} className="animate-fade-in">
      <div 
        className="glass"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          transition: 'all var(--transition-normal)'
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-md)',
          }}>
            <ChefHat size={26} />
          </div>
          
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 850,
            fontSize: '1.8rem',
            letterSpacing: '-0.02em',
            marginTop: '8px'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
            Log in to sync favorites & track your streaks
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-tertiary))', display: 'flex' }}>
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)',
                  outline: 'none',
                  fontSize: '0.92rem',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-tertiary))', display: 'flex' }}>
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--bg-tertiary) / 0.3)',
                  outline: 'none',
                  fontSize: '0.92rem',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
                onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'hsl(var(--primary))',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              marginTop: '4px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Logging in...
              </>
            ) : (
              <>
                Log In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Redirect block */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.88rem',
          color: 'hsl(var(--text-secondary))',
          borderTop: '1px solid hsl(var(--border))',
          paddingTop: '20px',
          marginTop: '4px'
        }}>
          New to RecipeHub?{' '}
          <Link 
            to="/signup" 
            style={{ color: 'hsl(var(--primary))', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
