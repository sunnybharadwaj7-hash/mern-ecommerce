// context/AuthContext.jsx
// Provides global authentication state to the entire app

import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

// Create the actual context object
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // user holds the logged-in user's info (or null if not logged in)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // tracks whether we're still checking localStorage on first load

  // Runs once when the app first loads — checks if a token already exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Called after successful login or register
  const loginUser = (userData) => {
    setUser(userData); // update React state
    localStorage.setItem('user', JSON.stringify(userData)); // persist across page refreshes
  };

  // Called on logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};