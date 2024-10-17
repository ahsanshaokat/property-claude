import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator, TouchableWithoutFeedback, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons
import { getProperties, getPropertyTypes, getCities } from '../data/api/propertyApi'; // Import the functions
import { useFocusEffect } from '@react-navigation/native'; // To refetch data on focus
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome


const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('Buy'); // Buy or Rent (this will set the 'purpose')
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ id: 14, name: 'Lahore' });
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch properties, property types, and cities
  const fetchData = async () => {
    setLoading(true);
    try {
      const propertyResponse = await getProperties("?page=1&perPage=12&order[updated_at]=DESC");
      const typesResponse = await getPropertyTypes();
      const citiesResponse = await getCities();

      if (propertyResponse.data.success && typesResponse && citiesResponse) {
        setProperties(propertyResponse.data.data); // Set properties list
        setPropertyTypes(typesResponse.data); // Set property types
        setCities(citiesResponse.data); // Set cities list
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAddProperty = () => {
    navigation.navigate('PostAd');
  };

  // Function to handle search action
  const handleSearch = () => {
    if (searchTerm) {
      navigation.navigate('SearchResults', { searchTerm, cityId: selectedCity.id });
    }
  };

  // Function to handle category click
  const handleCategoryClick = (alias) => {
    navigation.navigate('SearchResults', { 
      propertyType: alias, 
    });
  };

  // Function to close city dropdown when clicked outside
  const closeCityDropdown = () => {
    if (cityDropdownOpen) {
      setCityDropdownOpen(false);
    }
  };

  // Function to call the property contact number
  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  // Function to send SMS
  const sendSMS = (number) => {
    Linking.openURL(`sms:${number}`);
  };

  // Function to open WhatsApp
  const openWhatsApp = (number) => {
    const url = `whatsapp://send?phone=${number}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "WhatsApp is not installed on this device.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error opening WhatsApp: ", err));
  };

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryClick(item.alias)} style={styles.categoryItem}>
      {item.imageUrl.startsWith('http') ? (
        <Image source={{ uri: item.imageUrl }} style={styles.categoryIcon} />
      ) : (
        <Text style={[styles.textIcon, { color: '#008a43' }]}>{item.imageUrl || '🏠'}</Text> // Theme green color
      )}
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>({item.propertyCount || 0})</Text>
    </TouchableOpacity>
  );

  // Render cities dropdown
  const renderCityDropdown = () => (
    <View style={styles.cityDropdownContainer}>
      <TouchableOpacity style={styles.locationButton} onPress={() => setCityDropdownOpen(!cityDropdownOpen)}>
        <Text style={styles.locationText}>{selectedCity.name}</Text>
        <Icon name="keyboard-arrow-down" size={20} color="#000" />
      </TouchableOpacity>
      {cityDropdownOpen && (
        <View style={styles.cityDropdown}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city.id}
              onPress={() => {
                setSelectedCity(city);
                setCityDropdownOpen(false);
              }}
              style={styles.cityOption}
            >
              <Text>{city.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Render property item
  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })}>
      <View style={styles.propertyCard}>
        <View style={[styles.propertyTag, item.purpose === 'SALE' ? styles.saleTag : styles.rentTag]}>
          <Text style={styles.tagText}>{item.purpose}</Text>
        </View>
        <Image source={{ uri: item.propertyImages.length > 0 ? item.propertyImages[0].image_url : 'https://via.placeholder.com/150' }} style={styles.propertyImage} />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{item.name}</Text>
          <Text style={styles.propertyLocation}>{item.address}</Text>
          <View style={styles.propertyDetails}>
            <View style={styles.propertyDetailItem}>
              <Icon name="king-bed" size={18} color="#008a43" />
              <Text style={styles.detailText}>{item.noOfBedRoom} Beds</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="bathtub" size={18} color="#008a43" />
              <Text style={styles.detailText}>{item.noOfBathRoom} Baths</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="straighten" size={18} color="#008a43" />
              <Text style={styles.detailText}>{item.propertySize} sq ft</Text>
            </View>
          </View>
          <Text style={styles.propertyPrice}>Rs. {item.price}</Text>

          {/* Buttons for Call, SMS, and WhatsApp */}
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={() => alert(`Opening WhatsApp for ${item.additionalSpec}`)}>
              <FontAwesome  name="whatsapp" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => alert(`Sending SMS to ${item.additionalSpec}`)}>
              <Icon name="sms" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => alert(`Calling ${item.additionalSpec}`)}>
              <Icon name="phone" size={20} color="#fff" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
        </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={closeCityDropdown}>
      <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Top section including the logo, Buy/Rent toggle, and search bar */}
            <View style={styles.topSection}>
              <Image
                source={{ uri: 'https://ekzameen.com/_next/static/media/headerbg.42b8ac70.png' }}
                style={styles.backgroundImage}
              />

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, selectedOption === 'Buy' && styles.activeButton]}
                  onPress={() => setSelectedOption('Buy')}
                >
                  <Text style={[styles.toggleText, selectedOption === 'Buy' ? styles.activeToggleText : styles.inactiveToggleText]}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, selectedOption === 'Rent' && styles.activeButton]}
                  onPress={() => setSelectedOption('Rent')}
                >
                  <Text style={[styles.toggleText, selectedOption === 'Rent' ? styles.activeToggleText : styles.inactiveToggleText]}>Rent</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search for properties..."
                  style={styles.searchBar}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {renderCityDropdown()}
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Icon name="search" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Section with Label */}
            <Text style={styles.sectionLabel}>Property Categories</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#008a43" />
            ) : (
              <>
                <View style={styles.categoryContainer}>
                  <FlatList
                    data={propertyTypes}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={styles.categoryRow}
                    contentContainerStyle={styles.categoryGrid}
                  />
                </View>
              </>
            )}

            {/* Property Listings Section with Label */}
            <Text style={styles.sectionLabel}>Property Listings</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#008a43" />
            ) : (
              <>
                <FlatList
                  data={properties}
                  renderItem={renderPropertyItem}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.propertyList}
                />
              </>
            )}
          </ScrollView>

          {/* Floating Add Property Button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('PostAd')}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {zIndex: -1},
  container: { flex: 1, backgroundColor: '#f2f2f2', zIndex: -1 },
  scrollContainer: { paddingBottom: 100 },
  floatingButton: {
    backgroundColor: '#ffc107',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  floatingButtonText: {
    color: '#000',
    fontSize: 36,
    fontWeight: 'bold',
  },
  topSection: {
    backgroundColor: '#008a43',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    opacity: 1.3,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    marginBottom: 15,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#008a43',
  },
  toggleText: {
    fontSize: 16,
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveToggleText: {
    color: '#008a43',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '90%',
    elevation: 2,
    position: 'relative',
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Adjust padding for better spacing
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  locationText: {
    marginRight: 5,
    color: '#008a43',
    fontSize: 16,
  },
  cityDropdownContainer: {
    position: 'relative',
  },
  cityDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 9999,
    elevation: 10,
    maxHeight: 200,
    overflow: 'scroll',
  },
  cityOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryGrid: {
    paddingHorizontal: 15,
    zIndex: -33,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
    zIndex: -4,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#f7f7f7',
    marginBottom: 15,
    zIndex: -1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    zIndex: -1,
    resizeMode: 'contain',
  },
  textIcon: {
    fontSize: 40,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 15,
  },
  propertyList: { padding: 10 },
  propertyCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    position: 'relative',
  },
  propertyTag: {
    backgroundColor: '#008a43',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    left: -15,
    top: -5,
    width: 50,
  },
  saleTag: {
    backgroundColor: '#ffc107',
  },
  rentTag: {
    backgroundColor: '#ff5733',
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  propertyInfo: { flex: 1, justifyContent: 'center' },
  propertyTitle: { fontSize: 18, fontWeight: 'bold' },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  propertyDetails: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#008a43',
    marginLeft: 5,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Aligns icons and text properly
    marginTop: 10,
    paddingHorizontal: 5, 
    width: '100%', 
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008a43',
    paddingVertical: 10, // Increase padding for better button height
    borderRadius: 5,
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5, // Adds space between buttons
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;
