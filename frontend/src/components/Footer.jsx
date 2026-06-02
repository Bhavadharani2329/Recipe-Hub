import React from 'react';
import { ChefHat, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid hsl(var(--border))',
      padding: '48px 0 24px 0',
      backgroundColor: 'hsl(var(--bg-secondary))',
      fontSize: '0.9rem',
      color: 'hsl(var(--text-secondary))',
      transition: 'background-color var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        paddingBottom: '32px',
        borderBottom: '1px solid hsl(var(--border))'
      }}>
        {/* Brand Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <ChefHat size={20} />
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'hsl(var(--text-primary))',
              letterSpacing: '-0.02em',
            }}>
              RecipeHub
            </span>
          </div>
          <p style={{ lineHeight: '1.6', fontSize: '0.88rem' }}>
            Discover and master culinary creations with step-by-step guides, interactive cooking timers, portion scaling, and ingredients shopping checklists. Your personalized culinary dashboard!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            color: 'hsl(var(--text-primary))',
            marginBottom: '16px',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Explore Recipes
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
            <li>
              <Link to="/" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Home / Discover</Link>
            </li>
            <li>
              <Link to="/favorites" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Favorites E-Cookbook</Link>
            </li>
            <li>
              <Link to="/category/Dessert" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Sweet Desserts</Link>
            </li>
            <li>
              <Link to="/category/Seafood" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'hsl(var(--primary))'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Fresh Seafoods</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            color: 'hsl(var(--text-primary))',
            marginBottom: '16px',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Kitchen Office
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
              <span>Hosenagalli, Karnataka, 600096</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
              <span>dhaaru@recipehub.net</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
              <span>+91 (7418582621) COOK-EASY</span>
            </li>
          </ul>
        </div> 
      </div>

      {/* Copyright area */}
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '24px',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>© {new Date().getFullYear()} RecipeHub. Created with</span>
          <Heart size={12} style={{ color: 'hsl(var(--primary))' }} fill="currentColor" />
          <span>for cooking enthusiasts.</span>
        </div>
        <div>
          All recipe data sourced from <a href="https://www.themealdb.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600 }}>TheMealDB</a>.
        </div>
      </div>
    </footer>
  );
}
