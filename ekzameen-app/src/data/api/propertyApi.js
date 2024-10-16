import { $axios } from "./axios-base";
import _ from "lodash";
import qs from "qs";
import { API_URLS } from "../utils/api.urls";
// Define the base URL for property endpoints
const PROPERTY_URL = API_URLS.properties;

// Function to fetch all properties with optional filters
export const getProperties = (filters = "") => {
  const propertyUrl = filters.length > 0 ? `${PROPERTY_URL}${filters}` : PROPERTY_URL;
  return $axios.get(propertyUrl);
};

// Function to get property details by ID
export const getPropertyDetails = async (id) => {
  return $axios.get(`${PROPERTY_URL}/${id}`);
};

// Function to get properties using filters
export const getPropertiesByFilter = async (query) => {
  return $axios.get(`${PROPERTY_URL}?${query}`);
};

// Function to create a new property
export const createProperty = (propertyPayload) => {
  return $axios.post(`${PROPERTY_URL}/property`, propertyPayload);
};

// Function to edit an existing property by ID
export const editProperty = (propertyId, propertyPayload) => {
  return $axios.patch(`${PROPERTY_URL}/property/${propertyId}`, propertyPayload);
};
