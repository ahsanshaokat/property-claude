import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // For icons
import moment from 'moment';  // For time formatting
import { getPropertiesByFilter } from '../data/api/propertyApi';  // Updated API function to get properties by filter
import Communications from 'react-native-communications';  // To handle SMS, Call, etc.

const SearchResultsScreen = ({ navigation, route }) => {
  const { propertyType, cityId, purpose } = route.params;  // Directly extract propertyType and cityId from route.params
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const filterObject = {
          basic: {
            page: 1,
            perPage: 12,
          },
          filters: {
            propertyType,  // Pass propertyType dynamically
            cityId,        // Pass cityId dynamically
            purpose,       // Pass purpose dynamically
          },
        };

        const response = await getPropertiesByFilter(filterObject);
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyType, cityId, purpose]);  // Re-fetch when propertyType, cityId, or purpose changes

  // Handle Call
  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => Alert.alert('Error', 'Failed to make a call.'));
  };

  // Handle SMS
  const handleSMS = (phoneNumber) => {
    Communications.text(phoneNumber, 'Hello, I am interested in this property.');
  };

  // Handle WhatsApp
  const handleWhatsApp = (phoneNumber) => {
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=Hello, I am interested in this property.`;
    Linking.openURL(whatsappURL).catch(() => Alert.alert('Error', 'WhatsApp is not installed on your device.'));
  };

  const renderProperty = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })}>
      <View style={styles.propertyCard}>
        {/* Image with count */}
        <Image source={{ uri: item.propertyImages.length > 0 ? item.propertyImages[0].image_url : 'https://via.placeholder.com/150' }} style={styles.propertyImage} />
        <Text style={styles.imageCount}>{item.propertyImages.length}</Text>

        {/* Property Details */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{item.name}</Text>
          <Text style={styles.propertyPrice}>PKR {item.price.toLocaleString()}</Text>
          <Text style={styles.propertyLocation}>{item.address}</Text>
          
          {/* Bed, Bath, Size Icons */}
          <View style={styles.propertyDetails}>
            <Icon name="king-bed" size={18} color="#555" />
            <Text style={styles.detailText}>{item.noOfBedRoom} Beds</Text>
            <Icon name="bathtub" size={18} color="#555" />
            <Text style={styles.detailText}>{item.noOfBathRoom} Baths</Text>
            <Icon name="straighten" size={18} color="#555" />
            <Text style={styles.detailText}>{item.propertySize} sq ft</Text>
          </View>

          {/* Time of post */}
          <Text style={styles.postedTime}>{moment(item.created_at).fromNow()}</Text>

          {/* Action Buttons (SMS, Call, WhatsApp) */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.button} onPress={() => handleSMS(item.additionalSpec)}>
              <Text style={styles.buttonText}>SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCall(item.additionalSpec)}>
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleWhatsApp(item.additionalSpec)}>
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Options */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Price Range</Text>
        </TouchableOpacity>
      </View>

      {/* Properties List */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  propertyList: {
    paddingBottom: 20,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  propertyImage: {
    width: 120,
    height: 100,
    borderRadius: 10,
  },
  imageCount: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  propertyInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008a43',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  detailText: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 14,
  },
  postedTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#008a43',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default SearchResultsScreen;
