import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {

  const [inputIngredients, setInputIngredients] = useState({ title: '', amount: '' });

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredients(inputIngredients);
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text"
                   id="title"
                   value={inputIngredients.title}
                   onChange={(e) => {
                       const newTitle = e.target.value;
                       setInputIngredients( (prevInputState) =>
                           ({ title: newTitle, amount: prevInputState.amount })
                       )}
                   }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
                type="number"
                id="amount"
                value={inputIngredients.amount}
                onChange={(e) => {
                    const newAmount = e.target.value;
                    setInputIngredients( (prevInputState) =>
                      ({ amount: newAmount, title: prevInputState.title })
                    )}
                }/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.isLoading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
