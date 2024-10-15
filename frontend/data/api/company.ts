import { $axios } from "./axios-base";
import qs from "qs";
import { API_PROXY_BASE, API_URLS } from "../utils/api.urls";
import { removeFalsy } from "../utils/lib";

const COMPANY_URL = API_URLS.companies;

export const getCompanies = (filters: string = "") => {
  const companyUrl = filters.length > 0 ? `${COMPANY_URL}${filters}` : COMPANY_URL;
  return $axios.get(companyUrl);
};

// Type Definitions
export type BasicType = {
  page: number;
  perPage: number;
};

export type KeyValueObject = {
  [key: string]: string | number | boolean;
};

export type CompanyQueryFilters = {
  name?: string;
  address?: string;
  website?: string;
  userId?: number | string;
  isActive?: boolean;
};

export type FilterType = {
  basic: BasicType;
  order?: KeyValueObject;
  filters?: CompanyQueryFilters;
};

export type CompaniesFilter = FilterType;

// Create Filter URL
const createFilterUrl = (filterObject: CompaniesFilter) => {
  const query = qs.stringify(
    {
      ...filterObject.basic,
      order: {
        ...filterObject.order,
      },
      filters: {
        ...removeFalsy(filterObject.filters as KeyValueObject),
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return query;
};

// Get Company Details by ID
export const getCompanyDetails = async (id: number) => {
  return $axios.get(`${COMPANY_URL}/${id}`);
};

// Get Companies by Filter
export const getCompaniesByFilter = async (filterObject: CompaniesFilter) => {
  const query = createFilterUrl(filterObject);
  return $axios.get(`${COMPANY_URL}?${query}`);
};

// Create a New Company
export const createCompany = (companyPayload: any) => {
  return $axios.post(`${API_PROXY_BASE}/company`, companyPayload);
};

// Edit an Existing Company
export const editCompany = (companyId: number, companyPayload: any) => {
  return $axios.patch(`${API_PROXY_BASE}/company/${companyId}`, companyPayload);
};

// Delete a Company by ID
export const deleteCompany = async (id: number) => {
  return $axios.delete(`${COMPANY_URL}/${id}`);
};
