import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';

// Mock property data with random images
const mockProperties = [
  { id: 1, name: 'Luxury House', price: 'PKR 1.5 Crore', location: 'DHA Phase 6, Lahore', size: '10 Marla', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Modern Apartment', price: 'PKR 90 Lakh', location: 'Bahria Town, Lahore', size: '5 Marla', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Farm House', price: 'PKR 4 Crore', location: 'Bedian Road, Lahore', size: '2 Kanal', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Commercial Plaza', price: 'PKR 5 Crore', location: 'Gulberg, Lahore', size: '15 Marla', image: 'https://via.placeholder.com/150' },
];

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter properties based on the search term
  const filteredProperties = mockProperties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProperty = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })}>
      <View style={styles.propertyCard}>
        <Image source={{ uri: item.image }} style={styles.propertyImage} />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{item.name}</Text>
          <Text>{item.price} - {item.location}</Text>
          <Text>Size: {item.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search properties..."
        style={styles.searchBar}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: { borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 },
  propertyCard: { flexDirection: 'row', padding: 20, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8 },
  propertyImage: { width: 100, height: 100, marginRight: 16, borderRadius: 8 },
  propertyInfo: { flex: 1 },
  propertyTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;
