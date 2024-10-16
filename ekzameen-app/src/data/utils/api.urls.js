export const API_BASE = 'http://apis.ekzameen.com';
// export const API_BASE = 'http://localhost:7890';

const STATIC_IMAGES = `${API_BASE}/static/`;
const FEATURES_IMAGES = `${API_BASE}/uploads/feature/`;
const HEADER_IMAGES = `${API_BASE}/uploads/header/`;
const FLOOR_PLAN_IMAGES = `${API_BASE}/uploads/floor_plan/`;
const AGENTS_IMAGES = `${API_BASE}/uploads/agent/`;

export const API_URLS = {
  base_url: API_BASE,
  static_img: STATIC_IMAGES,
  feature_img: FEATURES_IMAGES,
  header_img: HEADER_IMAGES,
  floor_plan: FLOOR_PLAN_IMAGES,
  agent_img: AGENTS_IMAGES,
  auth: `${API_BASE}/v1/auth`,
  propertyTypes: `${API_BASE}/v1/property-type`,
  cities: `${API_BASE}/v1/city`,
  feature: `${API_BASE}/v1/feature`,
  properties: `${API_BASE}/v1/property`,
  users: `${API_BASE}/v1/user`,
  agents: `${API_BASE}/v1/agent`,
  storageFile: `${API_BASE}/v1/storage-file`,
  projects: `${API_BASE}/v1/projects`,
  companies: `${API_BASE}/v1/company`, 
};
