import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const addIngredientHandler = ingredient => {
      setIsLoading(true);
      fetch('https://vue-axios-practise-2.firebaseio.com/ingredients.json', {
          method: 'POST',
          body: JSON.stringify(ingredient),
          headers: { 'Content-Type': 'application/json' }
      })
      .then( res => {
          return res.json();
      })
      .then( resData => {
           setIngredients((prevIngredients) => [
              ...prevIngredients,
              { id: resData.name, ...ingredient }
            ]
          );
          setIsLoading(false);
      }).catch(err => setError(err.message));
  };

  const removeIngredientHandler = ingredientId => {
      setIsLoading(true);
      fetch(`https://vue-axios-practise-2.firebaseio.com/ingredients/${ingredientId}.json`, { method: 'DELETE' })
      .then( res => {
          return res.json();
      })
      .then( resData => {
          setIngredients((prevIngredients) => prevIngredients.filter( ing => ing.id !== ingredientId ));
          setIsLoading(false);
      }).catch(err => setError(err.message));
  };

  const onLoadIngredients = useCallback(loadedIngredients => {
      setIngredients(loadedIngredients);
  }, []);

  return (
    <div className="App">
        {error && <ErrorModal onClose={() => setError(undefined)}>{error}</ErrorModal>}
      <IngredientForm onAddIngredients={addIngredientHandler} isLoading={isLoading}/>

      <section>
        <Search onLoadIngredients={onLoadIngredients}/>
        <IngredientList isLoading={isLoading} ingredients={ingredients} onRemoveItem={(id) => removeIngredientHandler(id)}/>
      </section>
    </div>
  );
}

export default Ingredients;
