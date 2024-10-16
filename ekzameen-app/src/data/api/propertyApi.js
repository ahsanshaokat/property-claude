import { $axios } from "./axios-base";
import qs from "qs";
import { API_URLS } from "../utils/api.urls";

// Define the base URL for property endpoints
const PROPERTY_URL = API_URLS.properties;
const STORAGE_FILE_URL = API_URLS.storageFile;

// Function to fetch all properties with optional filters
export const getProperties = (filters = "") => {
  const propertyUrl = filters.length > 0 ? `${PROPERTY_URL}${filters}` : PROPERTY_URL;
  return $axios.get(propertyUrl);
};

// Helper function to create query string from filter object
const createFilterUrl = (filterObject) => {
  const query = qs.stringify(
    {
      ...filterObject.basic,
      order: {
        ...filterObject.order,
      },
      filters: {
        ...filterObject.filters,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return query;
};

// Function to get property details by ID
export const getPropertyDetails = async (id) => {
  return $axios.get(`${PROPERTY_URL}/${id}`);
};

// Function to get properties using filters
export const getPropertiesByFilter = async (filterObject) => {
  const query = createFilterUrl(filterObject);  // Generate query string from filter object
  return $axios.get(`${PROPERTY_URL}?${query}`);
};

// Function to create a new property
export const createProperty = (propertyPayload, accessToken) => {
  return $axios.post(`${PROPERTY_URL}`, propertyPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // Pass the accessToken in the Authorization header
      },
    });
};

// Function to edit an existing property by ID
export const editProperty = (propertyId, propertyPayload) => {
  return $axios.patch(`${PROPERTY_URL}/property/${propertyId}`, propertyPayload);
};

// Function to get all property types
export const getPropertyTypes = () => {
  return $axios.get(API_URLS.propertyTypes);
};

// Function to get all cities
export const getCities = () => {
  return $axios.get(API_URLS.cities);
};

export const getFeatures = () => {
  return $axios.get(API_URLS.feature);
};


export const uploadImage = (formData) => {
  return $axios.post(STORAGE_FILE_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteImage = async (id) => {
  return $axios.delete(`${STORAGE_FILE_URL}/${id}`);
};
