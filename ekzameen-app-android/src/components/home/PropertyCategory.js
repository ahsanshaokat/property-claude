import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getPropertyTypes } from '../../data/api/propertyApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PropertyCategory = ({ onCategoryClick }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Homes');

  useEffect(() => {
    fetchPropertyTypes();
  }, [activeTab]);

  const fetchPropertyTypes = async () => {
    setLoading(true);
    try {
      const typesResponse = await getPropertyTypes();
      if (typesResponse.data) {
        const filteredTypes = typesResponse.data.filter(
          (type) => type.parentCategory === activeTab
        );
        setPropertyTypes(filteredTypes);
      }
    } catch (error) {
      console.error('Error fetching property types:', error);
      Alert.alert('Error', 'Failed to load property types. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: 'Homes', icon: 'home-outline' },
    { label: 'Plots', icon: 'map-marker-outline' },
    { label: 'Commercial', icon: 'office-building-outline' },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onCategoryClick(item.alias)}
      style={styles.subCategoryItem}
      accessibilityLabel={`${item.name} category`}
      accessibilityHint={`Tap to view properties under ${item.name}`}
    >
      <Text style={styles.subCategoryText}>{item.name}</Text>
      <Text style={styles.propertyCount}>({item.propertyCount || 0})</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#006b3c" />;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Browse Properties</Text>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tab, activeTab === tab.label && styles.activeTab]}
              onPress={() => setActiveTab(tab.label)}
              accessibilityLabel={`${tab.label} tab`}
              accessibilityHint={`Tap to view ${tab.label} properties`}
              activeOpacity={0.8}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.label ? '#006b3c' : '#888'}
              />
              <Text style={[styles.tabText, activeTab === tab.label && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.categoryGrid}>
          <FlatList
            data={propertyTypes}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.categoryRow}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: -1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  container: {
    width: '97%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: 48, // Ensuring minimum touch area
  },
  activeTab: {
    borderBottomColor: '#006b3c',
  },
  tabText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#006b3c',
    fontWeight: 'bold',
  },
  categoryGrid: {
    paddingHorizontal: 1,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  subCategoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    minHeight: 48,
    accessibilityRole: 'button',
  },
  subCategoryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  propertyCount: {
    fontSize: 12,
    color: '#888',
  },
});

export default PropertyCategory;
