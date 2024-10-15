import { City } from "@/data/model/city";
import { Feature } from "@/data/model/feature";
import { ProjectType } from "@/data/enums/project-type"; // Enum for project types

export type ProjectFormHelpers = {
  companies(companies: any): [any];
  projectTypes: ProjectType[]; // Include ProjectType in the helpers
  cities: City[];
  features: Feature[];
};

// Define Project Types using the updated enum
export const PROJECT_TYPES = [
  {
    id: ProjectType.HOUSING_SOCIETY,
    name: "Housing Society",
  },
  {
    id: ProjectType.APARTMENT_BUILDING,
    name: "Apartment Building",
  },
  {
    id: ProjectType.COMMERCIAL_CENTER,
    name: "Commercial Center",
  },
  {
    id: ProjectType.INDUSTRIAL_PARK,
    name: "Industrial Park",
  },
  {
    id: ProjectType.PHASE_OF_HOUSING_SOCIETY,
    name: "Phase of Housing Society", // New type added here
  },
];
