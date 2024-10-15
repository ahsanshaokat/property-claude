import { Project } from "@/data/model/project";
import { ProjectFormHelpers } from "@/data/types/project/project";
import * as yup from "yup";
import _ from "lodash";

// Define validation schema for the Project form
export const projectSchema = yup.object({
  name: yup.string().required("Project name is required"),
  description: yup.string().required("Project description is required"),
  projectType: yup
    .string()
    .oneOf([
      "Housing Society",
      "Apartment Building",
      "Commercial Center",
      "Shopping Mall",
      "Office Building",
      "Industrial Park"
    ], "Please select a valid project type")
    .required("Project type is required"),
  totalArea: yup
    .number()
    .nullable()
    .typeError("Please add a valid total area"),
  budget: yup.number().nullable().typeError("Please add a valid budget"),
  estimatedRevenue: yup
    .number()
    .nullable()
    .typeError("Please add a valid estimated revenue"),
  startDate: yup.date().nullable().typeError("Please select a valid date"),
  completionDate: yup
    .date()
    .nullable()
    .typeError("Please select a valid completion date"),
  isActive: yup.boolean().default(true),
}).required();

// Mock data for project types, this can be replaced with API data
export const projectTypes = [
  { id: 'Housing Society', name: 'Housing Society' },
  { id: 'Apartment Building', name: 'Apartment Building' },
  { id: 'Commercial Center', name: 'Commercial Center' },
  { id: 'Shopping Mall', name: 'Shopping Mall' },
  { id: 'Office Building', name: 'Office Building' },
  { id: 'Industrial Park', name: 'Industrial Park' },
];

export type ProjectFormData = {
  data: ProjectFormHelpers;
};

export type ProjectFormFields = {
  totalUnits(totalUnits: any): string | Blob;
  name: string;
  description: string;
  projectType: number;
  totalArea?: number;
  budget?: number;
  estimatedRevenue?: number;
  startDate?: string;
  completionDate?: string;
  isActive?: boolean;
};

// Pre-fill the form for editing a project
export const setProjectEditForm = (
  project: Project,
  setValue: CallableFunction
) => {
  setValue("name", project.name);
  setValue("description", project.description);
  setValue("projectType", project.projectType.id);
  setValue("totalArea", project.totalArea);
  setValue("budget", project.budget);
  setValue("estimatedRevenue", project.estimatedRevenue);
  setValue("startDate", project.startDate);
  setValue("completionDate", project.completionDate);
  setValue("isActive", project.isActive);
};

// Function to merge and determine which features need to be added or deleted
export const projectFeatureMerge = (
  project: Project,
  features: string[]
): {
  itemToBeAdded: number[];
  itemToBeDeleted: number[];
} => {
  const existingFeatures = project.projectFeatures.map((ft) => ft.featureId);
  const featuresAdded = features.map((ft) => +ft);
  const itemToBeDeleted = _.difference(existingFeatures, featuresAdded);
  const mergedNew = [...featuresAdded, ...itemToBeDeleted];
  const itemToBeAdded = _.difference(mergedNew, existingFeatures);

  return {
    itemToBeAdded,
    itemToBeDeleted,
  };
};
