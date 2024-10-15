import { Company } from "@/data/model/company";
import { CompanyFormHelpers } from "@/data/types/company/company";
import * as yup from "yup";
import _ from "lodash";

// Define validation schema for the Company form
export const companySchema = yup.object({
  name: yup.string().required("Company name is required"),
  address: yup.string().nullable().typeError("Please add a valid address"),
  website: yup
    .string()
    .nullable()
    .typeError("Please add a valid website"),
  isActive: yup.boolean().optional(),
}).required();

export type CompanyFormData = {
  data: CompanyFormHelpers;
};

export type CompanyFormFields = {
  name: string;
  address?: string;
  website?: string;
  userId?: number;
  isActive?: boolean;
};

// Pre-fill the form for editing a company
export const setCompanyEditForm = (
  company: Company | null, // Allow company to be null
  setValue: CallableFunction
) => {
  if (!company) {
    console.error("No company data provided to populate the form.");
    return;
  }

  if (!company.name) {
    console.error("Company name is missing.");
  }

  console.log(company)
  setValue("name", company.name ?? ""); // Provide a fallback value if name is missing
  setValue("address", company.address ?? ""); // Ensure empty string if null or undefined
  setValue("website", company.website ?? ""); // Ensure empty string if null or undefined
  // setValue("userId", company.user?.id || null); // Add safeguard for null user
  setValue("isActive", company.isActive ?? true); // Default to true if not provided
};

// Function to merge and determine which features (if any) need to be added or deleted
export const companyFeatureMerge = (
  company: Company,
  features: string[]
): {
  itemToBeAdded: number[];
  itemToBeDeleted: number[];
} => {
  const existingFeatures = company.companyFeatures?.map((ft) => ft.featureId) || [];
  const featuresAdded = features.map((ft) => +ft);
  const itemToBeDeleted = _.difference(existingFeatures, featuresAdded);
  const itemToBeAdded = _.difference(featuresAdded, existingFeatures);

  return {
    itemToBeAdded,
    itemToBeDeleted,
  };
};
