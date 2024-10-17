import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadImage } from '../data/api/propertyApi'; // Assuming this API is in propertyApi.js

const ImageUploadComponent = () => {
  const [imageFiles, setImageFiles] = useState([]); // Array to hold uploaded image details
  const [imageType, setImageType] = useState(''); // To store selected image type (feature/header)
  const [loading, setLoading] = useState(false);

  // Handle image upload when user selects an image
  const handleFileUpload = () => {
    if (!imageType) {
      Alert.alert("Please select an image type before uploading");
      return;
    }

    // Launch image library for selecting an image
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.errorCode) {
        console.log('User canceled image picker or there was an error');
        return;
      }

      // Prepare the form data for the selected image
      let formData = new FormData();
      formData.append("type", imageType); // Attach image type (feature/header)
      formData.append("size", "md"); // You can modify the size based on your requirement
      formData.append("fileName", {
        uri: response.assets[0].uri,
        name: response.assets[0].fileName,
        type: response.assets[0].type
      });

      setLoading(true);

      // Call the API to upload the image
      try {
        const res = await uploadImage(formData); // Call API to upload image
        setLoading(false);
        setImageFiles([...imageFiles, res.data]); // Store uploaded image data in the state
        console.log('Uploaded image data:', res.data);
        Alert.alert("Image uploaded successfully");
      } catch (error) {
        setLoading(false);
        console.error('Error uploading image:', error.message);
        Alert.alert("Failed to upload image");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Images</Text>

      {/* Image Type Selector */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, imageType === 'feature' && styles.activeButton]}
          onPress={() => setImageType('feature')}
        >
          <Text style={imageType === 'feature' ? styles.activeButtonText : styles.inactiveButtonText}>Feature Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, imageType === 'header' && styles.activeButton]}
          onPress={() => setImageType('header')}
        >
          <Text style={imageType === 'header' ? styles.activeButtonText : styles.inactiveButtonText}>Header Image</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Button */}
      <Button title="Select Image and Upload" onPress={handleFileUpload} disabled={loading} />

      {/* Display uploaded images */}
      <View style={styles.uploadedImages}>
        {imageFiles.map((file, index) => (
          <Text key={index}>{file.fileName}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#008a43',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveButtonText: {
    color: '#000',
  },
  uploadedImages: {
    marginTop: 20,
  },
});

export default ImageUploadComponent;
