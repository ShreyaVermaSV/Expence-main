import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyProvider = ({children}) => {

    

    const [userData, setUserData] = useState({ key: 'value' });
    const [spending, setSpending ] = useState({key: 'value'});
    


    return(
        <MyContext.Provider value={{userData, setUserData}}>
            {children}
        </MyContext.Provider>
    )
}

export {MyContext, MyProvider};