import React from 'react';
import { ChefHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div 
      className="animate-fade-in flex-center"
      style={{
        flexDirection: 'column',
        textAlign: 'center',
        padding: '120px 24px',
        maxWidth: '550px',
        margin: '0 auto',
        gap: '24px',
      }}
    >
      {/* Visual icon badge */}
      <div style={{
        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))',
        width: '100px',
        height: '100px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid hsl(var(--border))',
        color: 'hsl(var(--primary))',
        boxShadow: 'var(--shadow-md)',
        animation: 'pulse 2s infinite'
      }}>
        <ChefHat size={48} />
      </div>

      <div>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 900,
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.04em',
          marginBottom: '8px',
          color: 'hsl(var(--primary))'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          marginBottom: '12px',
          color: 'hsl(var(--text-primary))'
        }}>
          Oops! The Kitchen is Closed
        </h2>
        <p style={{
          color: 'hsl(var(--text-secondary))',
          fontSize: '1rem',
          lineHeight: '1.6'
        }}>
          It looks like the cooking page or delicious recipe you are looking for has been taken off the menu or moved to a different pantry. Let's get you back to safety!
        </p>
      </div>

      <Link
        to="/"
        style={{
          backgroundColor: 'hsl(var(--primary))',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '0.92rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-md)',
          transition: 'all var(--transition-fast)'
        }}
        className="card-hover"
      >
        Go back to Kitchen Home <ArrowRight size={16} />
      </Link>
    </div>
  );
}
