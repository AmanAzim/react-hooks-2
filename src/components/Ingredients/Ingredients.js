import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../customHooks/http';

                            //Current State
const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter( ing => ing.id !== action.id );
        default:
            throw new Error('Should not get there !');
    }
};

function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, extraData, reqIdentifier, clear } = useHttp();

  useEffect(() => {
      if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
          dispatch({ type: 'DELETE', id: extraData });
      } else if (!isLoading && !error && reqIdentifier === 'ADD_INGEDIENT') {
          console.log(data)
          dispatch({ type: 'ADD', ingredient: { id: data.name, ...extraData } });
      }

  }, [data, extraData, reqIdentifier, error]);


  const addIngredientHandler = useCallback(ingredient => {
      sendRequest(
          'https://vue-axios-practise-2.firebaseio.com/ingredients.json',
          'POST',
          JSON.stringify(ingredient),
          ingredient,
          'ADD_INGEDIENT',
      );
  }, []);


  const removeIngredientHandler = useCallback(ingredientId => {
        sendRequest(
            `https://vue-axios-practise-2.firebaseio.com/ingredients/${ingredientId}.json`,
            'DELETE',
            null,
            ingredientId,
            'REMOVE_INGREDIENT',
        );
  }, [sendRequest]);


  const onLoadIngredients = useCallback(loadedIngredients => {
      dispatch({type:'SET', ingredients: loadedIngredients});
  }, []);


  const IngredientListFunc = useMemo(() => {
      return (
          <IngredientList
              isLoading={isLoading}
              ingredients={ingredients}
              onRemoveItem={(id) => removeIngredientHandler(id)}
          />
      );
  }, [ingredients, removeIngredientHandler]);


  return (
    <div className="App">
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredients={addIngredientHandler} isLoading={isLoading}/>

      <section>
        <Search onLoadIngredients={onLoadIngredients}/>
        { IngredientListFunc }
      </section>
    </div>
  );
}

export default Ingredients;
