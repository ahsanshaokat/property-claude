import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const PropertyListing = ({ property, onPropertyClick }) => {

  // Function to make a phone call
  const handleCall = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', `Can't handle phone call`);
        } else {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // Function to send an SMS
  const handleSMS = (phoneNumber) => {
    const smsUrl = `sms:${phoneNumber}`;
    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', `Can't handle SMS`);
        } else {
          return Linking.openURL(smsUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // Function to open WhatsApp
  const handleWhatsApp = (phoneNumber) => {
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', `WhatsApp is not installed on this device`);
        } else {
          return Linking.openURL(whatsappUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // Format price
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      const value = price / 100000;
      return value === 1 ? `${value} Lac` : `${value.toFixed(1)} Lacs`;
    }
    return price;
  };

  // Format timestamp to human-readable format using moment
  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  // Convert square footage to Marla, Kanal, or Acres
  const convertSize = (sqft) => {
    if (sqft >= 43560) {
      return `${(sqft / 43560).toFixed(2)} Acre`;
    } else if (sqft >= 5445) {
      return `${(sqft / 5445).toFixed(2)} Kanal`;
    } else if (sqft >= 225) {
      return `${(sqft / 225).toFixed(2)} Marla`;
    }
    return `${sqft} sq ft`;
  };

  return (
    <TouchableOpacity onPress={() => onPropertyClick(property.id)} accessibilityLabel={`View details for ${property.name}`}>
      <View style={styles.propertyCard}>
        <View style={[styles.propertyTag, property.purpose === 'SALE' ? styles.saleTag : styles.rentTag]}>
          <Text style={styles.tagText}>{property.purpose}</Text>
        </View>
        <Image 
          source={{ uri: property.propertyImages.length > 0 ? property.propertyImages[0].image_url : 'https://via.placeholder.com/150' }}
          style={styles.propertyImage}
          accessibilityLabel={`${property.name} image`}
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={2}>{property.name}</Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>{property.address}</Text>
          <View style={styles.propertyDetails}>
            <View style={styles.propertyDetailItem}>
              <Icon name="king-bed" size={16} color="#006b3c" />
              <Text style={styles.detailText}>{property.noOfBedRoom} Beds</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="bathtub" size={16} color="#006b3c" />
              <Text style={styles.detailText}>{property.noOfBathRoom} Baths</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="straighten" size={16} color="#006b3c" />
              <Text style={styles.detailText}>{convertSize(property.propertySize)}</Text>
            </View>
          </View>
          <Text style={styles.propertyPrice}>Rs. {formatPrice(property.price)}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(property.updated_at)}</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleWhatsApp(property.additionalSpec)} accessibilityLabel="Contact via WhatsApp">
              <FontAwesome name="whatsapp" size={18} color="#fff" />
              <Text style={styles.contactButtonText}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleSMS(property.additionalSpec)} accessibilityLabel="Send SMS">
              <Icon name="sms" size={18} color="#fff" />
              <Text style={styles.contactButtonText}>SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleCall(property.additionalSpec)} accessibilityLabel="Call property owner">
              <Icon name="phone" size={18} color="#fff" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    marginHorizontal: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    accessibilityRole: 'button',
  },
  propertyTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 10,
  },
  saleTag: {
    backgroundColor: '#ffc107',
  },
  rentTag: {
    backgroundColor: '#ff5733',
  },
  tagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  propertyImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#006b3c',
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006b3c',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: '#006b3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    flex: 1,
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default PropertyListing;
