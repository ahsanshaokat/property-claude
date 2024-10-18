import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { getPropertyDetails } from '../data/api/propertyApi'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import moment from 'moment';

const PropertyDetailsScreen = ({ route }) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await getPropertyDetails(propertyId);
        setProperty(response.data.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!property) {
    return <Text>Property not found</Text>;
  }

  // Render carousel images
  const renderImage = ({ item }) => (
    <Image 
      source={{ uri: item.image_url }} 
      style={styles.carouselImage} 
    />
  );

  // Format price
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      const value = price / 100000;
      return value === 1 ? `${value} Lac` : `${value.toFixed(1)} Lacs`;
    }
    return price.toLocaleString();
  };

  // Convert square footage to Marla, Kanal, or Acres
  const convertSize = (sqft) => {
    if (sqft >= 43560) {
      return `${(sqft / 43560).toFixed(2)} Acres`;
    } else if (sqft >= 5445) {
      return `${(sqft / 5445).toFixed(2)} Kanals`;
    } else if (sqft >= 225) {
      return `${(sqft / 225).toFixed(2)} Marlas`;
    }
    return `${sqft} sq ft`;
  };

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
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {property.propertyImages && property.propertyImages.length > 0 ? (
          <View style={styles.carouselContainer}>
            <Carousel
              data={property.propertyImages}
              renderItem={renderImage}
              sliderWidth={400}
              itemWidth={400}
              autoplay
              loop
            />
            <Text style={styles.imageCount}>{property.propertyImages.length} / {property.propertyImages.length}</Text>
          </View>
        ) : (
          <Image 
            source={{ uri: 'https://via.placeholder.com/600x300' }} 
            style={styles.propertyImage} 
          />
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.propertyTitle}>{property.name}</Text>
        <Text style={styles.propertyPrice}>PKR {formatPrice(property.price)}</Text>
        <Text style={styles.propertyLocation}>{property.address}</Text>
        <Text style={styles.postedTime}>Posted {moment(property.created_at).fromNow()}</Text>

        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Icon name="king-bed" size={18} color="#008a43" />
            <Text style={styles.detailText}>{property.noOfBedRoom} Beds</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="bathtub" size={18} color="#008a43" />
            <Text style={styles.detailText}>{property.noOfBathRoom} Baths</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="straighten" size={18} color="#008a43" />
            <Text style={styles.detailText}>{convertSize(property.propertySize)}</Text>
          </View>
        </View>

        <Text style={styles.propertyDescription}>{property.descriptions}</Text>

        {property.propertyFeatures && property.propertyFeatures.length > 0 && (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features & Amenities:</Text>
            {property.propertyFeatures.map((feature) => (
              <Text key={feature.id} style={styles.featureItem}>
                ✅ {feature.feature.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => handleCall(property.additionalSpec)}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleSMS(property.additionalSpec)}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleWhatsApp(property.additionalSpec)}>
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  imageContainer: { position: 'relative' },
  carouselImage: { width: '100%', height: 300, resizeMode: 'cover' },
  propertyImage: { width: '100%', height: 300 },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  carouselContainer: { position: 'relative' },
  imageCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
  },
  infoContainer: { padding: 16 },
  propertyTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  propertyPrice: { fontSize: 24, fontWeight: 'bold', color: '#008a43', marginBottom: 5 },
  propertyLocation: { fontSize: 16, color: '#666', marginBottom: 15 },
  postedTime: { fontSize: 14, color: '#888', marginBottom: 10 },
  propertyDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  detailText: { fontSize: 16, color: '#333', marginLeft: 5 },
  propertyDescription: { fontSize: 16, color: '#555', marginBottom: 15 },
  featuresContainer: { marginTop: 20 },
  featuresTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  featureItem: { fontSize: 16, color: '#555', marginLeft: 10, marginBottom: 5 },
  bottomButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#008a43', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default PropertyDetailsScreen;
