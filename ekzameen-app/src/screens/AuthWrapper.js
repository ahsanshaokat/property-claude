import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAuthenticated, logout } from '../data/api/authApi';

const AuthWrapper = ({ navigation, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        // Redirect to login if not authenticated
        navigation.navigate('Login');
      } else {
        setLoading(false);  // Authenticated, load the protected component
      }
    };
    checkAuthentication();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#008a43" />;
  }

  return <>{children}</>;  // Render protected components
};

export default AuthWrapper;
