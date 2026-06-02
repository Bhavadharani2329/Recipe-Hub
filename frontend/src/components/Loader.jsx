import React from 'react';
import { RefreshCw } from 'lucide-react';

// Spinner Component
export function Spinner({ message = 'Loading delicious recipes...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))',
        width: '64px',
        height: '64px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid hsl(var(--border))',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
      </div>
      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'hsl(var(--text-secondary))' }}>
        {message}
      </span>
    </div>
  );
}

// Skeleton Grid Component
export function SkeletonGrid({ count = 8 }) {
  const cards = Array.from({ length: count });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
      marginTop: '24px',
    }}>
      {cards.map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'hsl(var(--bg-secondary))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '350px',
            position: 'relative',
          }}
        >
          {/* Image Skeleton */}
          <div 
            className="skeleton-shimmer" 
            style={{
              width: '100%',
              paddingTop: '65%',
            }}
          />

          {/* Body Skeleton */}
          <div style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
            <div>
              {/* Category tag skeleton */}
              <div 
                className="skeleton-shimmer" 
                style={{
                  width: '30%',
                  height: '12px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                }}
              />
              
              {/* Title line 1 */}
              <div 
                className="skeleton-shimmer" 
                style={{
                  width: '90%',
                  height: '18px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              
              {/* Title line 2 */}
              <div 
                className="skeleton-shimmer" 
                style={{
                  width: '60%',
                  height: '18px',
                  borderRadius: '4px',
                }}
              />
            </div>

            {/* Footer Skeleton */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid hsl(var(--border))',
            }}>
              {/* Stat 1 */}
              <div 
                className="skeleton-shimmer" 
                style={{
                  width: '35%',
                  height: '12px',
                  borderRadius: '4px',
                }}
              />
              {/* Stat 2 */}
              <div 
                className="skeleton-shimmer" 
                style={{
                  width: '25%',
                  height: '12px',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loader({ variant = 'grid', count = 8, message }) {
  if (variant === 'spinner') {
    return <Spinner message={message} />;
  }
  return <SkeletonGrid count={count} />;
}
