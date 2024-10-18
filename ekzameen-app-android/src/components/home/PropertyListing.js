import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

  return (
    <TouchableOpacity onPress={() => onPropertyClick(property.id)}>
      <View style={styles.propertyCard}>
        <View style={[styles.propertyTag, property.purpose === 'SALE' ? styles.saleTag : styles.rentTag]}>
          <Text style={styles.tagText}>{property.purpose}</Text>
        </View>
        <Image 
          source={{ uri: property.propertyImages.length > 0 ? property.propertyImages[0].image_url : 'https://via.placeholder.com/150' }}
          style={styles.propertyImage}
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={2}>{property.name}</Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>{property.address}</Text>
          <View style={styles.propertyDetails}>
            <View style={styles.propertyDetailItem}>
              <Icon name="king-bed" size={16} color="#008a43" />
              <Text style={styles.detailText}>{property.noOfBedRoom} Beds</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="bathtub" size={16} color="#008a43" />
              <Text style={styles.detailText}>{property.noOfBathRoom} Baths</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="straighten" size={16} color="#008a43" />
              <Text style={styles.detailText}>{property.propertySize} sq ft</Text>
            </View>
          </View>
          <Text style={styles.propertyPrice}>Rs. {property.price}</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleWhatsApp(property.additionalSpec)}>
              <FontAwesome name="whatsapp" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleSMS(property.additionalSpec)}>
              <Icon name="sms" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleCall(property.additionalSpec)}>
              <Icon name="phone" size={18} color="#fff" />
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
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    position: 'relative',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal: 10,
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontSize: 16,
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
    color: '#008a43',
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008a43',
    marginTop: 5,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: '#008a43',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
});

export default PropertyListing;
