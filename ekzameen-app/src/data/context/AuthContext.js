import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state

  // Function to log in the user
  const loginUser = async (userData) => {
    setUser(userData);
    // Save user to async storage for persistence
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to log out the user
  const logoutUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  // Load user data from AsyncStorage on app load to persist login
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
