import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';

// Create the context
const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token'); 

    if (token) {
      try {
        const userDetailsFromCookie = Cookies.get('userDetails');
        const userDetails = userDetailsFromCookie ? JSON.parse(userDetailsFromCookie) : null;
        
        if (userDetailsFromCookie) {
          setUser(userDetails);
        } 
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    
    <MyContext.Provider value={{ user }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
export { MyContextProvider };
