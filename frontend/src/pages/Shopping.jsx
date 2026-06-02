import React from 'react';
import IngredientShoppingList from '../components/IngredientShoppingList';

export default function Shopping({
  shoppingList,
  onToggleComplete,
  onRemoveItem,
  onClearCompleted,
  onClearAll
}) {
  return (
    <div style={{ padding: '40px 0 80px 0' }} className="animate-fade-in">
      <div className="container">
        <IngredientShoppingList
          shoppingList={shoppingList}
          onToggleComplete={onToggleComplete}
          onRemoveItem={onRemoveItem}
          onClearCompleted={onClearCompleted}
          onClearAll={onClearAll}
        />
      </div>
    </div>
  );
}
