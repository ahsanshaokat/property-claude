import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Mock data for property types
const propertyTypes = [
  { id: '1', name: 'House', icon: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Apartment', icon: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Farm House', icon: 'https://via.placeholder.com/50' },
  { id: '4', name: 'Commercial Building', icon: 'https://via.placeholder.com/50' },
  { id: '5', name: 'Plot', icon: 'https://via.placeholder.com/50' },
  { id: '6', name: 'Penthouse', icon: 'https://via.placeholder.com/50' },
];

const PropertyTypesScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.box}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Property Types</Text>
      <FlatList
        data={propertyTypes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}  
        columnWrapperStyle={styles.row} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  box: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    width: '48%',  // Ensure boxes take up half of the row
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PropertyTypesScreen;
