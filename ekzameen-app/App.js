import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotUsernameScreen from './src/screens/ForgotUsernameScreen';
import HomeScreen from './src/screens/HomeScreen';
import PropertyDetailsScreen from './src/screens/PropertyDetailsScreen';
import PostAdScreen from './src/screens/PostAdScreen';
import PropertyTypesScreen from './src/screens/PropertyTypesScreen';
import { enableScreens } from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Icon library
import SearchResultsScreen from './src/screens/SearchResultsScreen'; // Import the new screen

// Enable react-native-screens for better performance
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
    <Stack.Screen name="ForgotUsername" component={ForgotUsernameScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// Custom Drawer Content with back button and updated color scheme
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerContent}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => props.navigation.closeDrawer()} // Close the drawer when pressed
      >
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.drawerText}>Back</Text>
      </TouchableOpacity>

      {/* Buy/Rent Option */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="home" size={24} color="#fff" />
        <Text style={styles.drawerText}>Buy/Rent</Text>
      </TouchableOpacity>

      {/* Property Type */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="apartment" size={24} color="#fff" />
        <Text style={styles.drawerText}>Type</Text>
      </TouchableOpacity>

      {/* City */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="location-city" size={24} color="#fff" />
        <Text style={styles.drawerText}>City</Text>
      </TouchableOpacity>

      {/* Location */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="place" size={24} color="#fff" />
        <Text style={styles.drawerText}>Location</Text>
      </TouchableOpacity>

      {/* Price */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="attach-money" size={24} color="#fff" />
        <Text style={styles.drawerText}>Price</Text>
      </TouchableOpacity>

      {/* Beds */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="bed" size={24} color="#fff" />
        <Text style={styles.drawerText}>Beds</Text>
      </TouchableOpacity>

      {/* Area */}
      <TouchableOpacity style={styles.drawerItem}>
        <Icon name="square-foot" size={24} color="#fff" />
        <Text style={styles.drawerText}>Area</Text>
      </TouchableOpacity>
    </View>

    {/* Bottom Buttons */}
    <View style={styles.bottomButtons}>
      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.resetText}>Reset Fields</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
    </View>
  </DrawerContentScrollView>
);


// Create Drawer Navigator (Sidebar)
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },  // Green color for header background
          headerTitle: () => (
            <Image
              source={{ uri: 'https://ekzameen.com/images/vertical_full.png' }}  // Logo URL
              style={styles.logo}
            />
          ),
        }}
      >
        <Drawer.Screen name="Dashboard" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;

// Styles for the drawer
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#008a43',  // Updated color to #008a43
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#fff',  // Text color white to contrast the green background
  },
  bottomButtons: {
    marginTop: 'auto',
    padding: 20,
    backgroundColor: '#fff',
  },
  resetButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#ffc107',  // Background color updated to #ffc107
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchText: {
    color: '#000',  // Text color updated to #000
    fontSize: 16,
  },
  floatingButton: {
    backgroundColor: '#ffc107',  // Floating button background color updated to #ffc107
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: '#000',  // Floating button text color updated to #000
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 150,  // Adjust width based on the logo size
    height: 40,  // Adjust height based on the logo size
    resizeMode: 'contain',
  },
});


