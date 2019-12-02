import React, { useState } from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {},
});

const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginHandler = () => {
        setIsAuthenticated(true);
    };

    const value = {
      login: loginHandler,
      isAuth: isAuthenticated,
    };

    return (
        <AuthContext.Provider value={{...value}}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;