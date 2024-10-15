import React from "react";
import { Project } from "@/data/model/project"; // Adjust to your actual model path

type ProjectGeneralInfoProps = {
  project: Project;
};

const ProjectGeneralInfo: React.FC<ProjectGeneralInfoProps> = ({ project }) => {
  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p>Type: {project.projectType}</p>
      <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
      <p>Completion Date: {new Date(project.completionDate).toLocaleDateString()}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default ProjectGeneralInfo;
