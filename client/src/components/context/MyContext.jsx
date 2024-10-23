import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';

// Create the context
const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (token) {
      try {
        // Decode the token to get user details (if needed)
        const decodedToken = jwt_decode(token);

        const userDetailsFromCookie = Cookies.get('userDetails');
        const userDetails = userDetailsFromCookie ? JSON.parse(userDetailsFromCookie) : null;

    
        console.log(userDetailsFromCookie,"userrrrrrrr")
        if (userDetailsFromCookie) {
          setUser(userDetailsFromCookie);
        } else {
        
          setUser({ user_id: userDetails._id });
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
