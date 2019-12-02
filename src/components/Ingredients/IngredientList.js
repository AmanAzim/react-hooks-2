import React from 'react';

import './IngredientList.css';

const IngredientList = ({ ingredients, onRemoveItem, isLoading }) => {

  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
        {isLoading && <p>Loading ...</p>}
      <ul>
        {!isLoading && ingredients.map(ig => (
          <li key={ig.id} onClick={onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default React.memo(IngredientList);
