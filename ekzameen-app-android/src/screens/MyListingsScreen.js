import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import moment from 'moment';
import { getPropertiesByFilter } from '../data/api/propertyApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MyListingsScreen = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        setUserId(user.id);
        fetchProperties(true, user.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchProperties = async (resetPage = false, id) => {
    if (resetPage) {
      setLoading(true);
      setPage(1);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const filterObject = {
        basic: {
          page: resetPage ? 1 : page,
          perPage: 12,
        },
        filters: {
          userId: id,
        },
      };

      const response = await getPropertiesByFilter(filterObject);
      if (response.data.success) {
        setProperties(resetPage ? response.data.data : [...properties, ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties(true, userId).then(() => setRefreshing(false));
  };

  const onEndReached = () => {
    if (!isFetchingMore) {
      setPage(prevPage => prevPage + 1);
      fetchProperties(false, userId);
    }
  };

  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => Alert.alert('Error', 'Failed to make a call.'));
  };

  const handleSMS = (phoneNumber) => {
    const smsUrl = `sms:${phoneNumber}`;
    Linking.openURL(smsUrl).catch(() => Alert.alert('Error', 'Failed to send SMS.'));
  };

  const handleWhatsApp = (phoneNumber) => {
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=Hello, I am interested in this property.`;
    Linking.openURL(whatsappURL).catch(() => Alert.alert('Error', 'WhatsApp is not installed on your device.'));
  };

  const renderProperty = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })}>
      <View style={styles.propertyCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.propertyImages.length > 0 ? item.propertyImages[0].image_url : 'https://via.placeholder.com/150' }}
            style={styles.propertyImage}
          />
          <View style={[styles.tag, item.purpose === 'SALE' ? styles.saleTag : styles.rentTag]}>
            <Text style={styles.tagText}>{item.purpose}</Text>
          </View>
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>{item.address}</Text>

          <View style={styles.propertyDetails}>
            <View style={styles.propertyDetailItem}>
              <Icon name="king-bed" size={16} color="#008a43" />
              <Text style={styles.detailText}>{item.noOfBedRoom} Beds</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="bathtub" size={16} color="#008a43" />
              <Text style={styles.detailText}>{item.noOfBathRoom} Baths</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Icon name="straighten" size={16} color="#008a43" />
              <Text style={styles.detailText}>{item.propertySize} sq ft</Text>
            </View>
          </View>

          <Text style={styles.propertyPrice}>PKR {item.price.toLocaleString()}</Text>
          <Text style={styles.postedTime}>{moment(item.created_at).fromNow()}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.button} onPress={() => handleWhatsApp(item.additionalSpec)}>
              <FontAwesome name="whatsapp" size={18} color="#fff" />
              <Text style={styles.contactButtonText}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSMS(item.additionalSpec)}>
              <Icon name="sms" size={18} color="#fff" />
              <Text style={styles.contactButtonText}>SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleCall(item.additionalSpec)}>
              <Icon name="phone" size={18} color="#fff" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#008a43" />
      ) : (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.propertyList}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Set background to white
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
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
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: 120,
    height: 100,
    borderRadius: 10,
  },
  tag: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  saleTag: {
    backgroundColor: '#ffc107',
  },
  rentTag: {
    backgroundColor: '#ff5733',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  propertyInfo: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  propertyDetails: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    fontSize: 12,
    color: '#008a43',
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008a43',
    marginVertical: 5,
  },
  postedTime: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#008a43',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
});

export default MyListingsScreen;
