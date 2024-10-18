import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProperties, getCities } from '../data/api/propertyApi';
import { useFocusEffect } from '@react-navigation/native';
import PropertyCategory from '../components/home/PropertyCategory';
import PropertyListing from '../components/home/PropertyListing';

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('Buy');
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ id: 14, name: 'Lahore' });
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Homes');

  useFocusEffect(
    useCallback(() => {
      fetchData(true);
    }, [activeCategory, selectedOption])
  );

  const fetchData = async (resetPage = false) => {
    if (resetPage) {
      setLoading(true);
      setPage(1);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const propertyResponse = await getProperties(`?page=${resetPage ? 1 : page}&perPage=12&order[updated_at]=DESC`);
      const citiesResponse = await getCities();

      if (propertyResponse.data.success && citiesResponse) {
        setProperties(resetPage ? propertyResponse.data.data : [...properties, ...propertyResponse.data.data]);
        setCities(citiesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true).then(() => setRefreshing(false));
  };

  const handleSearch = () => {
    if (searchTerm) {
      navigation.navigate('SearchResults', { searchTerm, purpose: selectedOption, cityId: selectedCity.id });
    }
  };

  const closeCityDropdown = () => {
    if (cityDropdownOpen) {
      setCityDropdownOpen(false);
    }
  };

  const loadMoreData = () => {
    if (!isFetchingMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData();
        return nextPage;
      });
    }
  };

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

  return (
    <TouchableWithoutFeedback onPress={closeCityDropdown}>
      <View style={styles.container}>
        <FlatList
          data={properties}
          ListHeaderComponent={
            <>
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
                    <Text style={[styles.toggleText, selectedOption === 'Buy' && styles.activeToggleText]}>Buy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleButton, selectedOption === 'Rent' && styles.activeButton]}
                    onPress={() => setSelectedOption('Rent')}
                  >
                    <Text style={[styles.toggleText, selectedOption === 'Rent' && styles.activeToggleText]}>Rent</Text>
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

              <PropertyCategory 
                setActiveCategory={setActiveCategory} 
                onCategoryClick={(alias) => navigation.navigate('SearchResults', { propertyType: alias })} 
              />
              <Text style={styles.sectionLabel}>Property Listings</Text>
            </>
          }
          renderItem={({ item }) => (
            <PropertyListing
              property={item}
              onPropertyClick={(id) => navigation.navigate('PropertyDetails', { propertyId: id })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ flexGrow: 1 }}
        />

        {/* Floating Add Post Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('PostAd')}
        >
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 15,
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
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 3,
    width: '50%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#008a43',
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 10,
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
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#008a43',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
});

export default HomeScreen;
