import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing and retrieving user tokens
import Icon from 'react-native-vector-icons/MaterialIcons';  // Icon library

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotUsernameScreen from './src/screens/ForgotUsernameScreen';
import HomeScreen from './src/screens/HomeScreen';
import PropertyDetailsScreen from './src/screens/PropertyDetailsScreen';
import PostAdScreen from './src/screens/PostAdScreen';
import PropertyTypesScreen from './src/screens/PropertyTypesScreen';
import MyListingsScreen from './src/screens/MyListingsScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import { AuthProvider } from './src/data/context/AuthContext'; // Import AuthContext
import { AuthContext } from './src/data/context/AuthContext'; // Import the AuthContext


// Enable react-native-screens for better performance
import { enableScreens } from 'react-native-screens';
enableScreens();

// Create Stack Navigator for individual screens
const Stack = createStackNavigator();

// Stack Navigator containing Home, PropertyDetails, and PostAd screens
const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}  // This removes the "Home" header from the stack
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
    <Stack.Screen name="PostAd" component={PostAdScreen} />
    <Stack.Screen name="PropertyTypes" component={PropertyTypesScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="MyListings" component={MyListingsScreen} />
    <Stack.Screen name="ForgotUsername" component={ForgotUsernameScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// Custom Drawer Content with Sign Out button and user check
const CustomDrawerContent = (props) => {
  const { logoutUser } = useContext(AuthContext); // Get user and logout from context
  const [user, setUser] = useState(null); // User state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if user information is stored in AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      // Clear the user session or token from AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('accessToken');

      // Perform any additional cleanup if needed
      logoutUser(); // Clear any auth context-related states

      // Navigate to the login screen
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
    <View style={styles.drawerContent}>
      {/* Header with Logo */}
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: 'https://ekzameen.com/images/vertical_full_white.png' }}
          style={styles.drawerLogo}
        />
      </View>

      {/* User Info or Login Button */}
      {!user ? (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => props.navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login or Create Account</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>
      )}

      {/* Drawer Items */}
      <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('Home')}>
        <Icon name="home" size={24} color="#fff" />
        <Text style={styles.drawerText}>Home</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('PostAd')}>
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.drawerText}>Add Property</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('MyListings')}>
          <Icon name="list" size={24} color="#fff" />
          <Text style={styles.drawerText}>My Listings</Text>
        </TouchableOpacity>
        {/* 

        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="new-releases" size={24} color="#fff" />
          <Text style={styles.drawerText}>New Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="favorite" size={24} color="#fff" />
          <Text style={styles.drawerText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="bookmark" size={24} color="#fff" />
          <Text style={styles.drawerText}>Saved Searches</Text>
        </TouchableOpacity> */}

        {/* Language & About Us Section */}
        <View style={styles.appControls}>
          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="language" size={24} color="#fff" />
            <Text style={styles.drawerText}>اردو</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="info" size={24} color="#fff" />
            <Text style={styles.drawerText}>About Us</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button at the bottom */}
        {user && (
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#fff" />
            <Text style={styles.drawerText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </DrawerContentScrollView>
  );
};

// Create Drawer Navigator (Sidebar)
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer  style={styles.outterContainer}>
        <Drawer.Navigator
          initialRouteName="Dashboard"
          style={styles.outterContainer}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: '#008a43' },  // Green theme color for header
            headerTitle: () => (
              <Image
                source={{ uri: 'https://ekzameen.com/images/vertical_full_white.png' }}  // Green theme logo URL
                style={styles.logo}
              />
            ),
            headerTintColor: '#fff',  // Text and icons color set to white
          }}
        >
          <Drawer.Screen name="Dashboard" style={styles.outterContainer} component={MainStack} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

// Styles for the drawer and header
const styles = StyleSheet.create({
  outterContainer: {overflow: 'scroll'},
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#008a43',  // Green theme for drawer background
    overflow: 'scroll'
  },
  drawerHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  drawerLogo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  userInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userPhone: {
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderColor: '#008a43',
    borderWidth: 1,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#008a43',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#fff',  // White text color for drawer items
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 'auto', // Align to bottom
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  appControls: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    overflow: 'scroll'
  },
  logo: {
    width: 130,
    alignContent: 'center',
    height: 30,
    resizeMode: 'contain',
  },
});
