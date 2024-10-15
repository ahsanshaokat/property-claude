import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const PropertyDetailsScreen = ({ route }) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // Fetch property details
    axios.get(`https://api.example.com/properties/${propertyId}`)
      .then(response => setProperty(response.data))
      .catch(error => console.error(error));
  }, [propertyId]);

  if (!property) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{property.name}</Text>
      <Text>Price: {property.price}</Text>
      <Text>Location: {property.location}</Text>
      <Text>Size: {property.size}</Text>
      <Text>Description: {property.description}</Text>
      <Button title="Contact" onPress={() => alert('Contact the agent')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default PropertyDetailsScreen;
