import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const PostAdScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Submit property ad to the API
    axios.post('https://api.example.com/properties', formData)
      .then(response => {
        alert('Ad posted successfully');
        navigation.goBack();
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={formData.title}
        onChangeText={(value) => handleChange('title', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={formData.price}
        onChangeText={(value) => handleChange('price', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={formData.location}
        onChangeText={(value) => handleChange('location', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={formData.description}
        onChangeText={(value) => handleChange('description', value)}
        style={styles.input}
      />
      <Button title="Post Ad" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 },
});

export default PostAdScreen;
