import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

                            //Current State
const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.finter( ing => ing.id !== action.id );
        default:
            throw new Error('Should not get there !');
    }
};

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                isLoading: true,
                error: null,
            };
        case 'RESPONSE':
            return {
                ...currentHttpState,
                isLoading: false,
            };
        case 'ERROR':
            return {
                isLoading: false,
                error: action.errorMsg,
            };
        case 'CLR_ERR':
            return {
                ...currentHttpState,
                error: null,
            };
        default:
            throw new Error('Should not be reached !');
    }
};

function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  //const [ingredients, setIngredients] = useState([]);
  const [httpState, dispatchHttp] = useReducer(httpReducer,{isLoading: false, error: null});

  const addIngredientHandler = ingredient => {
      dispatchHttp({ type:'SEND' });

      fetch('https://vue-axios-practise-2.firebaseio.com/ingredients.json', {
          method: 'POST',
          body: JSON.stringify(ingredient),
          headers: { 'Content-Type': 'application/json' }
      })
      .then( res => {
          return res.json();
      })
      .then( resData => {
          /*
           setIngredients((prevIngredients) => [
              ...prevIngredients,
              { id: resData.name, ...ingredient }
            ]
          );*/
          dispatch({type:'ADD', ingredient: { id: resData.name, ...ingredient }});
          dispatchHttp({ type:'RESPONSE' });
      }).catch(err => dispatchHttp({ type:'ERROR', errorMsg: err.message }));
  };

  const removeIngredientHandler = ingredientId => {
      dispatchHttp({ type:'SEND' });

      fetch(`https://vue-axios-practise-2.firebaseio.com/ingredients/${ingredientId}.json`, { method: 'DELETE' })
      .then( res => {
          return res.json();
      })
      .then( resData => {
          //setIngredients((prevIngredients) => prevIngredients.filter( ing => ing.id !== ingredientId ));
          dispatch({type:'ADD', id: ingredientId });
          dispatchHttp({ type:'RESPONSE' });
      })
      .catch(err => dispatchHttp({ type:'ERROR', errorMsg: err.message }) );
  };

  const onLoadIngredients = useCallback(loadedIngredients => {
      //setIngredients(loadedIngredients);
      dispatch({type:'SET', ingredients: loadedIngredients});
  }, []);

  return (
    <div className="App">
        {httpState.error && <ErrorModal onClose={() => dispatchHttp({ type:'CLR_ERR' })}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredients={addIngredientHandler} isLoading={httpState.isLoading}/>

      <section>
        <Search onLoadIngredients={onLoadIngredients}/>
        <IngredientList isLoading={httpState.isLoading} ingredients={ingredients} onRemoveItem={(id) => removeIngredientHandler(id)}/>
      </section>
    </div>
  );
}

export default Ingredients;
