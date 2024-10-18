import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
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
    >
      <Text style={styles.subCategoryText}>{item.name}</Text>
      <Text style={styles.propertyCount}>({item.propertyCount || 0})</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#008a43" />;
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
            >
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.label ? '#008a43' : '#888'}
              />
              <Text style={[styles.tabText, activeTab === tab.label && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.subTabsContainer}>
          <Text style={styles.subTab}>Popular</Text>
          <Text style={styles.subTab}>Type</Text>
          <Text style={styles.subTab}>Location</Text>
          <Text style={styles.subTab}>Area Size</Text>
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
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#008a43',
  },
  tabText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#008a43',
    fontWeight: 'bold',
  },
  subTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subTab: {
    color: '#888',
    fontSize: 14,
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
    padding: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
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
