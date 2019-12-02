import { useReducer, useState, useEffect, useCallback, useMemo } from 'react';

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                isLoading: true,
                error: null,
                data: null,
                extraData: null,
                identifier: action.identifier,
            };
        case 'RESPONSE':
            return {
                ...currentHttpState,
                isLoading: false,
                data: action.responseData,
                extraData: action.extraData
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
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Should not be reached !');
    }
};

const initialState = {
     isLoading: false,
     error: null,
     data: null,
     extraData: null,
     identifier: null,
};

const useHttp = () => {
     const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

     const clear = useCallback( () => dispatchHttp({ type: 'CLEAR' }), []);

     const sendRequest = useCallback( (url, method = 'GET', body, extraData, reqIdentifier ) => {
          dispatchHttp({ type:'SEND', identifier: reqIdentifier });

          fetch(url, { method, body, headers: { 'Content-Type':'application/json' } })
              .then( res => {
                  return res.json();
              })
              .then( resData => {
                  dispatchHttp({ type:'RESPONSE', responseData: resData, extraData: extraData });
              })
              .catch(err => dispatchHttp({ type:'ERROR', errorMsg: err.message }) );
     }, []);

     return {
         isLoading: httpState.isLoading,
         data: httpState.data,
         error: httpState.error,
         sendRequest: sendRequest,
         extraData: httpState.extraData,
         reqIdentifier: httpState.identifier,
         clear,
     };
};

export default useHttp;