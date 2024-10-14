import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const clearError = () => setErrorMessage('');
    
    const userInput = userNameRef.current;
    const passwordInput = passwordRef.current;
    
    userInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    
    return () => {
      userInput.removeEventListener('input', clearError);
      passwordInput.removeEventListener('input', clearError);
    };
  }, []);

 

  const handleSubmit = async (event) => {
     event.preventDefault();
     const userName = userNameRef.current.value;
     const password = passwordRef.current.value;

    try {
 
      const response = await axios.post('http://localhost:8000/api/login', {
        username: userName,
        password: password,
      });

      if (response.status === 200) {
        
        navigate('/chats');
      }
    } catch (error) {

      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='loginContainer'>
      <div className='loginbox' style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>

        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Username:</label>
            <input
              type="text"
              ref={userNameRef}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              ref={passwordRef}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
