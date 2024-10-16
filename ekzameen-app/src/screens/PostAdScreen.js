import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Switch, Picker, ActivityIndicator, CheckBox, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // For selecting images
import { getPropertyTypes, getCities, getFeatures, createProperty, uploadImage } from '../data/api/propertyApi'; // Assuming these are defined
import * as mime from 'mime';
import { AuthContext } from '../data/context/AuthContext'; // Assuming you have AuthContext


const PostAdScreen = ({ navigation }) => {
  const { accessToken } = useContext(AuthContext); // Get the accessToken from context
  const [purpose, setPurpose] = useState('SALE'); // Toggle between Sell and Rent
  const [propertyType, setPropertyType] = useState(''); // Property Type
  const [city, setCity] = useState(''); // City
  const [propertySize, setPropertySize] = useState('');
  const [price, setPrice] = useState('');
  const [installments, setInstallments] = useState(false); // Installments
  const [possessionReady, setPossessionReady] = useState(false); // Possession
  const [bedrooms, setBedrooms] = useState(1); // Number of Bedrooms
  const [bathrooms, setBathrooms] = useState(1); // Number of Bathrooms
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [yearBuild, setYearBuild] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]); // Features state
  const [selectedFeatures, setSelectedFeatures] = useState([]); // Selected features
  const [imageFiles, setImageFiles] = useState([]); // Uploaded images
  const [imageType, setImageType] = useState(''); // Image type (Feature/Header)
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

    const selectedFile = files[0]; // Get the selected file
    const fileName = selectedFile.name; // Extract the file name

    // Prepare FormData for upload
    let formData = new FormData();
    formData.append('type', imageType);
    formData.append('size', 'md');
    formData.append('fileName', fileName); // Add the file name to FormData
    formData.append('file', selectedFile); // Add the file as binary data

    console.log('FormData:', formData);

    setLoading(true);

    // API call to upload the image
    uploadImage(formData)
      .then((res) => {
        setLoading(false);
        console.log('Upload successful:', res.data);
        setImageFiles([...imageFiles, res.data]); // Save the uploaded file details
        Alert.alert('Image uploaded successfully');
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error during upload:', error.message);
        Alert.alert('Image upload failed');
      });

    // Reset the file input field
    target.value = '';
  };
  

  const handlePostAd = async () => {
    const adData = {
      purpose,
      propertyType,
      city,
      propertySize,
      price,
      noOfBathRoom: bathrooms,
      noOfBedRoom: bedrooms,
      name: title,
      descriptions: description,
      additionalSpec: contactNumber,
      address,
      totalFloors,
      yearBuild,
      features: selectedFeatures, // Add selected features to the payload
      propertyImages: imageFiles, // Add uploaded images to the payload
      lat: null,
      long: null,
    };
    
    try {
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
        <ActivityIndicator size="large" color="#008a43" />
      ) : (
        <>
          {/* Purpose */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Purpose</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity 
                style={[styles.toggleButton, purpose === 'SALE' && styles.activeButton]} 
                onPress={() => setPurpose('SALE')}>
                <Text style={purpose === 'SALE' ? styles.activeButtonText : styles.inactiveButtonText}>Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, purpose === 'RENT' && styles.activeButton]} 
                onPress={() => setPurpose('RENT')}>
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
            >
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
            >
              {cities.map((city) => (
                <Picker.Item key={city.id} label={city.name} value={city.id} />
              ))}
            </Picker>
          </View>
          
          {/* Area Size */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Area Size (Sq. Ft.)</Text>
            <TextInput 
              style={styles.input}
              value={propertySize}
              onChangeText={setPropertySize}
              placeholder="Enter area size" 
              keyboardType="numeric"
            />
          </View>
          
          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Total Price (PKR)</Text>
            <TextInput 
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price" 
              keyboardType="numeric"
            />
          </View>

          {/* Installments Available */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Installments Available</Text>
            <Switch
              value={installments}
              onValueChange={setInstallments}
            />
          </View>

          {/* Ready for Possession */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Ready for Possession</Text>
            <Switch
              value={possessionReady}
              onValueChange={setPossessionReady}
            />
          </View>

          {/* Bedrooms */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Bedrooms</Text>
            <TextInput 
              style={styles.input}
              value={bedrooms.toString()}
              onChangeText={(val) => setBedrooms(parseInt(val))}
              placeholder="Enter number of bedrooms" 
              keyboardType="numeric"
            />
          </View>

          {/* Bathrooms */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Bathrooms</Text>
            <TextInput 
              style={styles.input}
              value={bathrooms.toString()}
              onChangeText={(val) => setBathrooms(parseInt(val))}
              placeholder="Enter number of bathrooms" 
              keyboardType="numeric"
            />
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Property Title</Text>
            <TextInput 
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter property title" 
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Property Description</Text>
            <TextInput 
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter property description" 
              multiline
            />
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Address</Text>
            <TextInput 
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address" 
            />
          </View>

          {/* Year Build */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Year Build</Text>
            <TextInput 
              style={styles.input}
              value={yearBuild.toString()}
              onChangeText={setYearBuild}
              placeholder="Enter year build" 
              keyboardType="numeric"
            />
          </View>

          {/* Total Floors */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Total Floors</Text>
            <TextInput 
              style={styles.input}
              value={totalFloors.toString()}
              onChangeText={setTotalFloors}
              placeholder="Enter total floors" 
              keyboardType="numeric"
            />
          </View>

          {/* Contact Number */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Contact Number</Text>
            <TextInput 
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter contact number" 
              keyboardType="phone-pad"
            />
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Features</Text>
            {features.map((feature) => (
              <View key={feature.id} style={styles.featureContainer}>
                <CheckBox
                  value={selectedFeatures.includes(feature.id)}
                  onValueChange={() => toggleFeature(feature.id)}
                />
                <Text>{feature.name}</Text>
              </View>
            ))}
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Upload Images</Text>

            {/* Image Type Selector */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, imageType === 'feature' && styles.activeButton]}
                onPress={() => setImageType('feature')}
              >
                <Text style={imageType === 'feature' ? styles.activeButtonText : styles.inactiveButtonText}>
                  Feature Image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, imageType === 'header' && styles.activeButton]}
                onPress={() => setImageType('header')}
              >
                <Text style={imageType === 'header' ? styles.activeButtonText : styles.inactiveButtonText}>
                  Header Image
                </Text>
              </TouchableOpacity>
            </View>

            <input type="file" onChange={handleFileUpload} style={{ marginTop: 20 }} />
            
            {/* Display uploaded images */}
            <View style={styles.uploadedImages}>
              {imageFiles.map((file, index) => (
                <Text key={index}>{file.fileName}</Text>
              ))}
            </View>
          </View>

          {/* Post Ad Button */}
          <Button title="Post Ad" onPress={handlePostAd} />
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
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadedImages: {
    marginTop: 20,
  },
});

export default PostAdScreen;
