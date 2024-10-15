import ProjectEditForm from "@/components/admin/projects/ProjectEditForm"; // Assuming you have a similar form for project editing
import AdminLayout from "@/components/layouts/AdminLayout";
import { getCities } from "@/data/api/city";
import { getFeatures } from "@/data/api/feature";
import { getProjectDetails } from "@/data/api/project"; // Replace with your actual API path for getting project details
import { Project } from "@/data/model/project"; // Replace with your actual Project model
import { ProjectFormHelpers } from "@/data/types/project/project"; // Replace with your project helper types
import { NextPageWithLayout } from "@/pages/_app";
import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";

type ProjectProps = {
  project: Project; // Adjusted for project data
  formsHelpers: ProjectFormHelpers; // Adjusted for project form helpers
};

export const ProjectEdit: NextPageWithLayout<ProjectProps> = ({
  project,
  formsHelpers,
}) => {
  return <ProjectEditForm data={formsHelpers} projectData={project} />; // Assuming ProjectEditForm is like PropertyEditForm
};

ProjectEdit.getLayout = (page: ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;
  const result = await getProjectDetails(Number(id)); // Adjusted to fetch project details
  const project = result.data;

  // Ensure projectTypes is not undefined, set it to null if missing
  const projectTypes = result.data.projectTypes || null;

  const [cities, features] = await Promise.all([
    getCities(),
    getFeatures(),
  ]);

  const formsHelpers: ProjectFormHelpers = {
    projectTypes, // Use the defined projectTypes or null
    cities: cities.data || [], // Ensure cities and features are always arrays
    features: features.data || [],
  };

  return { props: { formsHelpers, project } };
};

export default ProjectEdit;
