import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';  // For sidebar navigation
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotUsernameScreen from './src/screens/ForgotUsernameScreen';
import HomeScreen from './src/screens/HomeScreen';
import PropertyDetailsScreen from './src/screens/PropertyDetailsScreen';
import PostAdScreen from './src/screens/PostAdScreen';
import { enableScreens } from 'react-native-screens';

// Enable react-native-screens for better performance
enableScreens();

// Create Stack Navigator for individual screens
const Stack = createStackNavigator();

// Stack Navigator containing Home, PropertyDetails, and PostAd screens
const MainStack = () => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
    <Stack.Screen name="PostAd" component={PostAdScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotUsername" component={ForgotUsernameScreen} />
  </Stack.Navigator>
);

// Create Drawer Navigator (Sidebar)
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Dashboard">
        {/* Main stack with Home, Property Details, Post Ad */}
        <Drawer.Screen name="Dashboard" component={MainStack} />

        {/* You can add more screens accessible via the sidebar if needed */}
        <Drawer.Screen name="Post Ad" component={PostAdScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
