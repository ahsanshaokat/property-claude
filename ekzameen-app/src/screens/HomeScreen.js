import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons
import { getProperties } from '../data/api/propertyApi'; // Import the function

// Mock property categories (as before)
const categories = {
  Residential: [
    { id: 1, name: 'Houses', icon: 'house', count: 8, color: '#2E7D32' },
    { id: 2, name: 'Flats', icon: 'hotel', count: 0, color: '#388E3C' },
    { id: 3, name: 'Pent House', icon: 'apartment', count: 0, color: '#43A047' },
    { id: 4, name: 'Farm House', icon: 'agriculture', count: 0, color: '#66BB6A' },
    { id: 5, name: 'Apartments', icon: 'apartment', count: 0, color: '#81C784' },
  ],
  Commercial: [
    { id: 6, name: 'Shops', icon: 'storefront', count: 0, color: '#2E7D32' },
    { id: 7, name: 'Offices', icon: 'business', count: 0, color: '#388E3C' },
    { id: 8, name: 'Warehouses', icon: 'store', count: 1, color: '#43A047' },
    { id: 9, name: 'Factories', icon: 'factory', count: 0, color: '#66BB6A' },
    { id: 10, name: 'Industrial Land', icon: 'domain', count: 0, color: '#81C784' },
  ],
  Plots: [
    { id: 11, name: 'Residential Plot', icon: 'map', count: 1, color: '#2E7D32' },
    { id: 12, name: 'Commercial Plot', icon: 'map', count: 0, color: '#388E3C' },
    { id: 13, name: 'Plot Files', icon: 'insert-drive-file', count: 0, color: '#43A047' },
    { id: 14, name: 'Plot Forms', icon: 'description', count: 0, color: '#66BB6A' },
  ],
};

// Render category item
const renderCategoryItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.categoryItem}>
    <Icon name={item.icon} size={40} color={item.color} />
    <Text style={styles.categoryName}>{item.name}</Text>
    <Text style={styles.categoryCount}>({item.count})</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Residential');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('Buy');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API using the getProperties function
    const fetchProperties = async () => {
      try {
        const response = await getProperties("?page=1&perPage=12&order[updated_at]=DESC"); // Call the API function
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching properties: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Function to handle search action
  const handleSearch = () => {
    if (searchTerm) {
      navigation.navigate('SearchResults', { searchTerm });
    }
  };

  // Function to handle category click
  const handleCategoryClick = (category) => {
    navigation.navigate('SearchResults', { category });
  };

  const renderProperty = ({ item }) => (
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
              <Text style={styles.detailText}>{item.noOfBedRoom} Rooms</Text>
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
          <Text style={styles.propertyPrice}>Rs. {item.price.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
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
            <TouchableOpacity style={styles.locationButton} onPress={handleSearch}>
              <Text style={styles.locationText}>Search</Text>
              <Icon name="search" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsContainer}>
          {Object.keys(categories).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subcategory Grid */}
        <FlatList
          data={categories[selectedTab]}
          renderItem={({ item }) => renderCategoryItem({ item, onPress: () => handleCategoryClick(item.name) })}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.categoryRow}
          contentContainerStyle={styles.categoryGrid}
        />

        {/* Property Listings */}
        {loading ? (
          <ActivityIndicator size="large" color="#008a43" />
        ) : (
          <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.propertyList}
          />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
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
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  locationText: {
    marginRight: 5,
    color: '#008a43',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#f9f9f9',
  },
  activeTab: {
    borderColor: '#008a43',
  },
  tabText: {
    color: '#008a43',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#008a43',
    fontWeight: 'bold',
  },
  categoryGrid: {
    paddingHorizontal: 15,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 15, // Rounded corners for category items
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  propertyList: { padding: 10 },
  propertyCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    position: 'relative', // For fixed tag position
  },
  propertyTag: {
    backgroundColor: '#008a43',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    left: -15, // Position to the left outside the card
    top: 10,
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
});

export default HomeScreen;
