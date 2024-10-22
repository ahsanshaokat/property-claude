/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getPropertyTypes, getCities, getFeatures, createProperty, uploadImage } from '../data/api/propertyApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


const PostAdScreen = ({ navigation }) => {
  const [purpose, setPurpose] = useState('SALE');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [yearBuild, setYearBuild] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageType, setImageType] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch property types, cities, and features on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const propertyTypeResponse = await getPropertyTypes();
        const citiesResponse = await getCities();
        const featuresResponse = await getFeatures();
        
        if (propertyTypeResponse.data) {
          setPropertyTypes(propertyTypeResponse.data);
        }
        
        if (citiesResponse.data) {
          setCities(citiesResponse.data);
        }

        if (featuresResponse.data) {
          setFeatures(featuresResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle feature selection
  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const target = event.target;
    const files = target.files instanceof FileList ? target.files : null;

    if (!files || files.length === 0) {
      Alert.alert('No file selected');
      return;
    }

    if (!imageType) {
      Alert.alert("Please select an image type (Feature or Header)");
      return;
    }

    const selectedFile = files[0];
    const fileName = selectedFile.name;

    let formData = new FormData();
    formData.append('type', imageType);
    formData.append('size', 'md');
    formData.append('fileName', fileName);
    formData.append('file', selectedFile);

    setLoading(true);

    uploadImage(formData)
      .then((res) => {
        setLoading(false);
        setImageFiles([...imageFiles, res.data]);
        Alert.alert('Image uploaded successfully');
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error during upload:', error.message);
        Alert.alert('Image upload failed');
      });

    target.value = '';
  };
  
  const handlePostAd = async () => {
    const adData = {
      purpose,
      propertyType: parseInt(propertyType),
      city: parseInt(city),
      propertySize: parseInt(propertySize),
      price: parseInt(price),
      noOfBathRoom: parseInt(bathrooms),
      noOfBedRoom: parseInt(bedrooms),
      name: title,
      descriptions: description,
      additionalSpec: contactNumber,
      address,
      totalFloors: parseInt(totalFloors),
      yearBuild: parseInt(yearBuild),
      features: selectedFeatures,
      propertyImages: imageFiles.map(file => file.id),
      lat: null,
      long: null,
    };
    
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      await createProperty(adData, accessToken);
      Alert.alert('Ad posted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting ad:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post an Ad</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#006b3c" />
      ) : (
        <>
          {/* Purpose */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Purpose</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity 
                style={[styles.toggleButton, purpose === 'SALE' && styles.activeButton]} 
                onPress={() => setPurpose('SALE')}
                accessibilityLabel="Select Sell Purpose"
                accessibilityHint="Tap to select selling as the purpose">
                <Text style={purpose === 'SALE' ? styles.activeButtonText : styles.inactiveButtonText}>Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, purpose === 'RENT' && styles.activeButton]} 
                onPress={() => setPurpose('RENT')}
                accessibilityLabel="Select Rent Purpose"
                accessibilityHint="Tap to select renting out as the purpose">
                <Text style={purpose === 'RENT' ? styles.activeButtonText : styles.inactiveButtonText}>Rent Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Property Type */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Select Property Type</Text>
            <Picker
              selectedValue={propertyType}
              onValueChange={(itemValue) => setPropertyType(itemValue)}
              style={styles.picker}
              accessibilityLabel="Property Type Selector"
              accessibilityHint="Select the type of property">
              {propertyTypes.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id} />
              ))}
            </Picker>
          </View>

          {/* City */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>City</Text>
            <Picker
              selectedValue={city}
              onValueChange={(itemValue) => setCity(itemValue)}
              style={styles.picker}
              accessibilityLabel="City Selector"
              accessibilityHint="Select the city of the property">
              {cities.map((city) => (
                <Picker.Item key={city.id} label={city.name} value={city.id} />
              ))}
            </Picker>
          </View>

          {/* Title and Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Property Title</Text>
            <TextInput 
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter property title" 
              accessibilityLabel="Property Title Input"
              accessibilityHint="Enter the title for your property listing"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Property Description</Text>
            <TextInput 
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter property description" 
              multiline
              accessibilityLabel="Property Description Input"
              accessibilityHint="Enter a detailed description for your property listing"/>
          </View>

          {/* Other Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Area Size (Sq. Ft.)</Text>
            <TextInput 
              style={styles.input}
              value={propertySize}
              onChangeText={setPropertySize}
              placeholder="Enter area size" 
              keyboardType="numeric"
              accessibilityLabel="Area Size Input"
              accessibilityHint="Enter the size of the property in square feet"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Total Price (PKR)</Text>
            <TextInput 
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price" 
              keyboardType="numeric"
              accessibilityLabel="Price Input"
              accessibilityHint="Enter the total price for the property"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Bedrooms</Text>
            <TextInput 
              style={styles.input}
              value={bedrooms.toString()}
              onChangeText={(val) => setBedrooms(parseInt(val))}
              placeholder="Enter number of bedrooms" 
              keyboardType="numeric"
              accessibilityLabel="Bedrooms Input"
              accessibilityHint="Enter the number of bedrooms"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Bathrooms</Text>
            <TextInput 
              style={styles.input}
              value={bathrooms.toString()}
              onChangeText={(val) => setBathrooms(parseInt(val))}
              placeholder="Enter number of bathrooms" 
              keyboardType="numeric"
              accessibilityLabel="Bathrooms Input"
              accessibilityHint="Enter the number of bathrooms"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Address</Text>
            <TextInput 
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address" 
              accessibilityLabel="Address Input"
              accessibilityHint="Enter the address of the property"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Year Built</Text>
            <TextInput 
              style={styles.input}
              value={yearBuild.toString()}
              onChangeText={setYearBuild}
              placeholder="Enter year built" 
              keyboardType="numeric"
              accessibilityLabel="Year Built Input"
              accessibilityHint="Enter the year the property was built"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Total Floors</Text>
            <TextInput 
              style={styles.input}
              value={totalFloors}
              onChangeText={setTotalFloors}
              placeholder="Enter total floors" 
              keyboardType="numeric"
              accessibilityLabel="Total Floors Input"
              accessibilityHint="Enter the total number of floors"/>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Contact Number</Text>
            <TextInput 
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter contact number" 
              keyboardType="phone-pad"
              accessibilityLabel="Contact Number Input"
              accessibilityHint="Enter the contact number for inquiries"/>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Features</Text>
            <View style={styles.featureButtonContainer}>
              {features.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[
                    styles.featureButton,
                    selectedFeatures.includes(feature.id) && styles.selectedFeatureButton
                  ]}
                  onPress={() => toggleFeature(feature.id)}
                  accessibilityLabel={`Toggle ${feature.name}`}
                  accessibilityHint={`Select or unselect ${feature.name}`}>
                  <Text
                    style={[
                      styles.featureText,
                      selectedFeatures.includes(feature.id) && styles.selectedFeatureText
                    ]}
                  >
                    {feature.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Upload Images</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, imageType === 'feature' && styles.activeButton]}
                onPress={() => setImageType('feature')}
                accessibilityLabel="Feature Image Upload"
                accessibilityHint="Select to upload a feature image">
                <Text style={imageType === 'feature' ? styles.activeButtonText : styles.inactiveButtonText}>
                  Feature Image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, imageType === 'header' && styles.activeButton]}
                onPress={() => setImageType('header')}
                accessibilityLabel="Header Image Upload"
                accessibilityHint="Select to upload a header image">
                <Text style={imageType === 'header' ? styles.activeButtonText : styles.inactiveButtonText}>
                  Header Image
                </Text>
              </TouchableOpacity>
            </View>

            <input type="file" onChange={handleFileUpload} style={{ marginTop: 20 }} />
            
            {/* Display uploaded images */}
            <View style={styles.uploadedImages}>
              {imageFiles.map((file, index) => (
                <Text key={index} accessibilityLabel={`Uploaded image ${index + 1}`}>{file.fileName}</Text>
              ))}
            </View>
          </View>

          {/* Post Ad Button */}
          <TouchableOpacity
              style={styles.postAdButton}
              onPress={handlePostAd}
              accessibilityLabel="Post Ad Button"
              accessibilityHint="Tap to post your ad"
            >
              <Text style={styles.buttonText}>POST AD</Text>
            </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f8f8f8' 
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    minHeight: 48,
  },
  activeButton: {
    backgroundColor: '#006b3c',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveButtonText: {
    color: '#000',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    minHeight: 48,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 48,
  },
  featureButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureButton: {
    padding: 12,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
  },
  selectedFeatureButton: {
    backgroundColor: '#006b3c',
  },
  featureText: {
    color: '#000',
  },
  selectedFeatureText: {
    color: '#fff',
  },
  uploadedImages: {
    marginTop: 20,
  },
  postAdButton: {
    backgroundColor: '#006b3c', // Your preferred background color
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default PostAdScreen;
