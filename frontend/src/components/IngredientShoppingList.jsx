import React from 'react';
import { ShoppingBag, Trash2, CheckCircle2, Copy, Check, Info } from 'lucide-react';

export default function IngredientShoppingList({
  shoppingList,
  onToggleComplete,
  onRemoveItem,
  onClearCompleted,
  onClearAll,
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (shoppingList.length === 0) return;
    
    const text = shoppingList
      .map((item) => {
        const checkbox = item.completed ? '[x]' : '[ ]';
        return `${checkbox} ${item.name} (${item.measure || 'as needed'}) [Recipe: ${item.recipeTitle}]`;
      })
      .join('\n');
      
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const completedCount = shoppingList.filter((item) => item.completed).length;

  if (shoppingList.length === 0) {
    return (
      <div
        className="animate-fade-in flex-center"
        style={{
          flexDirection: 'column',
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: 'hsl(var(--bg-secondary))',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid hsl(var(--border))',
          maxWidth: '500px',
          margin: '40px auto 0 auto',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'hsl(var(--secondary) / 0.1)',
            color: 'hsl(var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            Shopping List is Empty
          </h3>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem' }}>
            Open any recipe detail view, tick the ingredients you need, and add them to this grocery list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ marginTop: '24px', maxWidth: '800px', margin: '24px auto 0 auto' }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={24} style={{ color: 'hsl(var(--secondary))' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Your Ingredient List</h2>
          <span className="badge badge-secondary">{shoppingList.length} items</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--bg-secondary))',
              color: 'hsl(var(--text-primary))',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            {copied ? <Check size={16} style={{ color: 'green' }} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--bg-secondary))',
                color: 'hsl(var(--text-secondary))',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all var(--transition-fast)',
              }}
            >
              Clear Checked
            </button>
          )}

          <button
            onClick={onClearAll}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(239, 68, 68)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all var(--transition-fast)',
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Checklist Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'hsl(var(--bg-secondary))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        padding: '8px 0',
      }}>
        {shoppingList.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderBottom: '1px solid hsl(var(--border) / 0.5)',
              backgroundColor: item.completed ? 'hsl(var(--bg-tertiary) / 0.5)' : 'transparent',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <div
              onClick={() => onToggleComplete(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                flexGrow: 1,
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: 'var(--radius-full)',
                border: `2px solid ${item.completed ? 'hsl(var(--secondary))' : 'hsl(var(--text-tertiary))'}`,
                backgroundColor: item.completed ? 'hsl(var(--secondary))' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all var(--transition-fast)',
              }}>
                {item.completed && <Check size={14} strokeWidth={3} />}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'hsl(var(--text-primary))',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    opacity: item.completed ? 0.6 : 1,
                  }}
                >
                  {item.name}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                  {item.measure} <span style={{ opacity: 0.5 }}>•</span> from {item.recipeTitle}
                </span>
              </div>
            </div>

            <button
              onClick={() => onRemoveItem(item.id)}
              style={{
                color: 'hsl(var(--text-tertiary))',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgb(239, 68, 68)';
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--text-tertiary))';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Tiny Tip Footer */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'hsl(var(--text-secondary))',
        fontSize: '0.85rem',
        padding: '0 8px',
      }}>
        <Info size={16} style={{ color: 'hsl(var(--secondary))', flexShrink: 0 }} />
        <span>You can export this checklist and paste it directly into your notes or share it with family.</span>
      </div>
    </div>
  );
}
