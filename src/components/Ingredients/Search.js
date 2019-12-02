import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {

    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            //Comparing the old value with the current value of after 500 mil sec extracted by useRef. if they matches then it means user have not changed his entered value after 500 ms so we can send a request to db
            if (enteredFilter === inputRef.current.value) {
                console.log('Loading ingredient - Search.js line:15')
                const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

                fetch('https://vue-axios-practise-2.firebaseio.com/ingredients.json' + query)
                  .then( res => {
                      return res.json();
                  })
                  .then( resData => {
                      const loadedIngredients = [];

                      for (const key in resData) {
                          loadedIngredients.push({
                              id: key,
                              title: resData[key].title,
                              amount: resData[key].amount,
                          });
                      }
                      onLoadIngredients(loadedIngredients);
                  }).catch(err => console.log(err));

            }

        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [enteredFilter, onLoadIngredients, inputRef]);

    return (
        <section className="search">
          <Card>
            <div className="search-input">
              <label>Filter by Title</label>
              <input type="text"
                     ref={inputRef}
                     value={enteredFilter}
                     onChange={e => setEnteredFilter(e.target.value)}
              />
            </div>
          </Card>
        </section>
    );
});

export default Search;
