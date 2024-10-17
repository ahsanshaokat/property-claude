import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getPropertyDetails } from '../data/api/propertyApi'; // Import your API function
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons
import { useNavigation } from '@react-navigation/native'; // To use navigation for the back button
import Carousel from 'react-native-snap-carousel'; // Import a carousel library
import moment from 'moment'; // For time formatting

const PropertyDetailsScreen = ({ route }) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // To handle back navigation

  useEffect(() => {
    // Fetch property details using the getPropertyDetails function
    const fetchPropertyDetails = async () => {
      try {
        const response = await getPropertyDetails(propertyId);
        setProperty(response.data.data); // Updated to match the structure of the API response
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

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel with Back Button and Image Count */}
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

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Property Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.propertyTitle}>{property.name}</Text>
        <Text style={styles.propertyPrice}>PKR {property.price}</Text>
        <Text style={styles.propertyLocation}>{property.address}</Text>
        <Text style={styles.postedTime}>Posted {moment(property.created_at).fromNow()}</Text>

        {/* Property Details like size, beds, baths */}
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
            <Text style={styles.detailText}>{property.propertySize} sq ft</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.propertyDescription}>{property.descriptions}</Text>

        {/* Features and Amenities */}
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

      {/* Bottom Buttons (Call, Message, WhatsApp) */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => alert(`Calling ${property.additionalSpec}`)}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert(`Sending message to ${property.additionalSpec}`)}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert(`Opening WhatsApp to ${property.additionalSpec}`)}>
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },

  imageContainer: {
    position: 'relative', // For positioning the back button on top of the image
  },
  carouselImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  propertyImage: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slight transparency
    padding: 8,
    borderRadius: 20,
  },
  carouselContainer: {
    position: 'relative',
  },
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
  infoContainer: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008a43',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  postedTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#008a43',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PropertyDetailsScreen;
