import React from 'react';

import './IngredientList.css';

const IngredientList = props => {
    console.log(props.isLoading)
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
        {props.isLoading && <p>Loading ...</p>}
      <ul>
        {!props.isLoading && props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
