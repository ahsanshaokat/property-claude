import { $axios } from './axios-base';
import { API_URLS } from '../utils/api.urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_URL = API_URLS.auth;
const USER_URL = API_URLS.users;

// Login API call
export const login = async (formData) => {
  const response = await $axios.post(`${AUTH_URL}/login`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Save tokens in AsyncStorage (or secure storage if required)
  const { access_token, refresh_token, user } = response.data;
  await AsyncStorage.setItem('access_token', access_token);
  await AsyncStorage.setItem('refresh_token', refresh_token);
  await AsyncStorage.setItem('user', JSON.stringify(user));

  return response;
};


export const signUp = async (formData) => {

    const response = await $axios.post(`${USER_URL}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
  };

// Function to log out (clears tokens)
export const logout = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
  await AsyncStorage.removeItem('user');
};

// Check if the user is authenticated (middleware)
export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return !!token;  // returns true if token exists
};

export const saveAuthData = async (loginData) => {
    try {
      await AsyncStorage.setItem('accessToken', loginData.access_token);
      await AsyncStorage.setItem('refreshToken', loginData.refresh_token);
      await AsyncStorage.setItem('userProfile', JSON.stringify(loginData.user));
      console.log('Auth data saved successfully');
    } catch (e) {
      console.log('Failed to save auth data', e);
    }
  };