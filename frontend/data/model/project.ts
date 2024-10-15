import { Company } from "./company";
import { Image } from "./image-file";
import { PropertyType } from "./property-type"; // If projects have types as well

export type Project = {
  projectImages: never[];
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  slug: string;
  projectType: string; // Enum value or similar, adjust as needed
  totalArea?: number;
  totalUnits?: number;
  startDate?: string;
  completionDate?: string;
  budget?: number;
  estimatedRevenue?: number;
  isActive?: boolean;
  images?: Image[]; // Images associated with the project
  company: Company; // Company associated with the project
};

export type ProjectResponse = {
  success: boolean;
  data: Project | null;
};
