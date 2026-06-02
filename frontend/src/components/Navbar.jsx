import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChefHat, Bookmark, ShoppingBag, Sun, Moon, Menu, X, Flame } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Navbar({ bookmarkCount, shoppingListCount, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // NavLink active style helper
  const getLinkStyle = ({ isActive }) => ({
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '0.95rem',
    borderRadius: 'var(--radius-sm)',
    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
    backgroundColor: isActive ? 'hsl(var(--primary) / 0.05)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all var(--transition-fast)'
  });

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid hsl(var(--border))',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      transition: 'background-color var(--transition-normal), border-color var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={closeMobileMenu}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-md)',
          }}>
            <ChefHat size={22} />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 850,
            fontSize: '1.4rem',
            background: 'linear-gradient(to right, hsl(var(--text-primary)), hsl(var(--primary)))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            RecipeHub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-nav-menu">
          <NavLink to="/" end style={getLinkStyle}>
            Discover
          </NavLink>
          
          <NavLink to="/favorites" style={getLinkStyle}>
            <Bookmark size={16} />
            Bookmarks
            {bookmarkCount > 0 && (
              <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                {bookmarkCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/shopping" style={getLinkStyle}>
            <ShoppingBag size={16} />
            Shopping List
            {shoppingListCount > 0 && (
              <span className="badge badge-secondary" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                {shoppingListCount}
              </span>
            )}
          </NavLink>

          {/* Add Recipe (Secure) */}
          {isAuthenticated && (
            <NavLink to="/add-recipe" style={getLinkStyle}>
              <ChefHat size={16} />
              Add Recipe
            </NavLink>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--text-primary))',
              marginLeft: '8px',
              transition: 'all var(--transition-fast)',
              backgroundColor: 'hsl(var(--bg-secondary))',
              cursor: 'pointer'
            }}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Authentication desktop buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '16px' }}>
              <span 
                style={{ fontSize: '0.9rem', fontWeight: 700, color: 'hsl(var(--text-primary))', display: 'flex', alignItems: 'center', gap: '4px' }} 
                title={`Streak: ${user.currentStreak} days`}
              >
                🔥 {user.currentStreak}
              </span>
              <button 
                onClick={logout} 
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: 'hsl(var(--bg-tertiary) / 0.5)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--bg-tertiary))'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--bg-tertiary) / 0.5)'}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '16px' }}>
              <Link 
                to="/login" 
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'hsl(var(--text-secondary))',
                  textDecoration: 'none'
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'hsl(var(--primary))',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Buttons Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-nav-toggle">
          {/* Theme Switcher Mobile */}
          <button
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--text-primary))',
              backgroundColor: 'hsl(var(--bg-secondary))',
              cursor: 'pointer'
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Hamburger Icon */}
          <button
            onClick={toggleMobileMenu}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--text-primary))',
              backgroundColor: 'hsl(var(--bg-secondary))',
              cursor: 'pointer'
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel Drawer */}
      {mobileMenuOpen && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            backgroundColor: 'hsl(var(--bg-secondary))',
            borderBottom: '1px solid hsl(var(--border))',
            padding: '16px 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 99
          }}
        >
          <NavLink 
            to="/" 
            end 
            style={({ isActive }) => ({
              ...getLinkStyle({ isActive }),
              width: '100%',
              justifyContent: 'flex-start'
            })}
            onClick={closeMobileMenu}
          >
            Discover
          </NavLink>
          
          <NavLink 
            to="/favorites" 
            style={({ isActive }) => ({
              ...getLinkStyle({ isActive }),
              width: '100%',
              justifyContent: 'flex-start'
            })}
            onClick={closeMobileMenu}
          >
            <Bookmark size={16} />
            Bookmarks
            {bookmarkCount > 0 && (
              <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>
                {bookmarkCount}
              </span>
            )}
          </NavLink>

          <NavLink 
            to="/shopping" 
            style={({ isActive }) => ({
              ...getLinkStyle({ isActive }),
              width: '100%',
              justifyContent: 'flex-start'
            })}
            onClick={closeMobileMenu}
          >
            <ShoppingBag size={16} />
            Shopping List
            {shoppingListCount > 0 && (
              <span className="badge badge-secondary" style={{ marginLeft: 'auto' }}>
                {shoppingListCount}
              </span>
            )}
          </NavLink>

          {/* Add Recipe Mobile */}
          {isAuthenticated && (
            <NavLink 
              to="/add-recipe" 
              style={({ isActive }) => ({
                ...getLinkStyle({ isActive }),
                width: '100%',
                justifyContent: 'flex-start'
              })}
              onClick={closeMobileMenu}
            >
              <ChefHat size={16} />
              Add Recipe
            </NavLink>
          )}

          {/* Auth controls mobile */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid hsl(var(--border))', paddingTop: '16px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'hsl(var(--text-primary))' }}>
                  Hi, {user.username}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={16} /> {user.currentStreak} Day Streak
                </span>
              </div>
              <button 
                onClick={() => { logout(); closeMobileMenu(); }} 
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--bg-tertiary) / 0.5)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid hsl(var(--border))', paddingTop: '16px', marginTop: '4px' }}>
              <Link 
                to="/login" 
                onClick={closeMobileMenu}
                style={{
                  flexGrow: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  backgroundColor: 'hsl(var(--bg-secondary))'
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                onClick={closeMobileMenu}
                style={{
                  flexGrow: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'hsl(var(--primary))',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Inline styles for hiding/showing menu based on media query */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav-menu {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
