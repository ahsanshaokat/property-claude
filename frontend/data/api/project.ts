import { $axios } from "./axios-base";
import qs from "qs";
import { API_PROXY_BASE, API_URLS } from "../utils/api.urls";
import { removeFalsy } from "../utils/lib";

const PROJECT_URL = API_URLS.projects;

export const getProjects = (filters: string = "") => {
  const projectUrl = filters.length > 0 ? `${PROJECT_URL}${filters}` : PROJECT_URL;
  return $axios.get(projectUrl);
};

// Type Definitions
export type BasicType = {
  page: number;
  perPage: number;
};

export type KeyValueObject = {
  [key: string]: string | number | boolean;
};

export type ProjectQueryFilters = {
  name?: string;
  description?: string;
  projectType?: string;
  companyId?: number | string;
  budget?: number;
  startDate?: string;
  completionDate?: string;
  userId?: number | string;
  isActive?: boolean;
};

export type FilterType = {
  basic: BasicType;
  order?: KeyValueObject;
  filters?: ProjectQueryFilters;
};

export type ProjectsFilter = FilterType;

// Create Filter URL
const createFilterUrl = (filterObject: ProjectsFilter) => {
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

// Get Project Details by ID
export const getProjectDetails = async (id: number) => {
  return $axios.get(`${PROJECT_URL}/${id}`);
};

// Get Projects by Filter
export const getProjectsByFilter = async (filterObject: ProjectsFilter) => {
  const query = createFilterUrl(filterObject);
  return $axios.get(`${PROJECT_URL}?${query}`);
};

// Create a New Project
export const createProject = (projectPayload: any) => {
  return $axios.post(`${PROJECT_URL}`, projectPayload);
};

// Edit an Existing Project
export const editProject = (projectId: number, projectPayload: any) => {
  return $axios.patch(`${API_PROXY_BASE}/projects/${projectId}`, projectPayload);
};

// Delete a Project by ID
export const deleteProject = async (id: number) => {
  return $axios.delete(`${PROJECT_URL}/${id}`);
};
