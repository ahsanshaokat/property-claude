import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotUsernameScreen from './src/screens/ForgotUsernameScreen';
import HomeScreen from './src/screens/HomeScreen';
import PropertyDetailsScreen from './src/screens/PropertyDetailsScreen';
import PostAdScreen from './src/screens/PostAdScreen';
import PropertyTypesScreen from './src/screens/PropertyTypesScreen';
import MyListingsScreen from './src/screens/MyListingsScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import { AuthProvider } from './src/data/context/AuthContext';
import { AuthContext } from './src/data/context/AuthContext';

import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}
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

const CustomDrawerContent = (props) => {
  const { logoutUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('accessToken');
      logoutUser();
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleOpenAboutUs = () => {
    Linking.openURL('https://ekzameen.com');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.drawerHeader}>
          <Image
            source={{ uri: 'https://ekzameen.com/images/vertical_full_white.png' }}
            style={styles.drawerLogo}
          />
        </View>

        {!user ? (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => props.navigation.navigate('Login')}
            accessibilityLabel="Login or Create Account"
            accessibilityHint="Navigate to login or create a new account"
          >
            <Text style={styles.loginButtonText}>Login or Create Account</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => props.navigation.navigate('Home')}
          accessibilityLabel="Navigate to Home"
          accessibilityHint="Go back to the home screen"
        >
          <Icon name="home" size={24} color="#ffffff" />
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => props.navigation.navigate('PostAd')}
          accessibilityLabel="Add Property"
          accessibilityHint="Navigate to add a new property listing"
        >
          <Icon name="add-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.drawerText}>Add Property</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => props.navigation.navigate('MyListings')}
          accessibilityLabel="My Listings"
          accessibilityHint="View your property listings"
        >
          <Icon name="list" size={24} color="#ffffff" />
          <Text style={styles.drawerText}>My Listings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={handleOpenAboutUs}
          accessibilityLabel="About Us"
          accessibilityHint="Learn more about the application"
        >
          <Icon name="info" size={24} color="#ffffff" />
          <Text style={styles.drawerText}>About Us</Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleLogout}
            accessibilityLabel="Sign Out"
            accessibilityHint="Sign out of your account"
          >
            <Icon name="logout" size={24} color="#ffffff" />
            <Text style={styles.drawerText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const App = () => (
  <AuthProvider>
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#006b3c' },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 16, width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}
            >
              <Icon name="menu" size={28} color="#ffffff" /> {/* Set the icon size to 28px */}
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Image
              source={{ uri: 'https://ekzameen.com/images/vertical_full_white.png' }}
              style={styles.logo}
            />
          ),
          headerTintColor: '#ffffff',
        })}
      >
        <Drawer.Screen name="Dashboard" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  </AuthProvider>
);

export default App;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#006b3c',
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
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userPhone: {
    color: '#ffffff',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
    minHeight: 48,
    paddingHorizontal: 18,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#006b3c',
    borderWidth: 1,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#006b3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    minHeight: 48,
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#ffffff',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    minHeight: 48,
  },
  logo: {
    width: 150,
    height: 48,
    resizeMode: 'contain',
  },
});
