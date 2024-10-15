import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PropertyTypesScreen = ({ navigation }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    // Fetch property types from API
    axios.get('https://api.example.com/property-types')
      .then(response => setPropertyTypes(response.data))
      .catch(error => console.error('Error fetching property types', error));
  }, []);

  const renderPropertyType = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('PropertyDetails', { typeId: item.id })}
    >
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={propertyTypes}
        renderItem={renderPropertyType}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 20, marginVertical: 8, backgroundColor: '#f9f9f9' },
  text: { fontSize: 16 },
});

export default PropertyTypesScreen;
