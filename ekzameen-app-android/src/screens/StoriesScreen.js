import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const mockStories = [
  { id: 1, image: 'https://example.com/image1.jpg', price: 'PKR 1.5 Crore', location: 'Lahore' },
  { id: 2, image: 'https://example.com/image2.jpg', price: 'PKR 2.5 Crore', location: 'Karachi' },
];

const StoriesScreen = ({ navigation }) => {
  const renderStory = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })}>
      <View style={styles.story}>
        <Image source={{ uri: item.image }} style={styles.storyImage} />
        <Text>{item.price}</Text>
        <Text>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={mockStories}
      renderItem={renderStory}
      keyExtractor={(item) => item.id.toString()}
      horizontal
    />
  );
};

const styles = StyleSheet.create({
  story: { margin: 10, alignItems: 'center' },
  storyImage: { width: 100, height: 100, borderRadius: 50 },
});

export default StoriesScreen;
