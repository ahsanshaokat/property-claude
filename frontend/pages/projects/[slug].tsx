import React from "react";
import BaseContainer from "@/components/common/container/BaseContainer";
import { Row, Col, Card } from "react-bootstrap";
import { GetServerSideProps } from "next";
import { API_URLS } from "@/data/utils/api.urls";
import { Project, ProjectResponse } from "@/data/model/project"; // Assuming you have a similar structure for Project model
import { NextPageWithLayout } from "../_app";

type ProjectProps = {
  project: ProjectResponse;
};

const ProjectPage: NextPageWithLayout<ProjectProps> = ({ project }) => {

  if (!project) {
    console.log("Project data not found or fetch failed.");
    return <p>No project data available.</p>;
  }

  const { name, description, projectType, totalArea, totalUnits, budget, estimatedRevenue, startDate, completionDate } = project;

  // Fallback if no project images are available
  const imagePath = project?.images?.find(
    (image: { type: string; size: string }) => image.type === "header" && image.size === "md"
  );

  return (
    <>
      {/* Display Project Information */}
      <section>
        <Row>
          <Col
            className="py-0"
            style={{
              backgroundImage: `url(${imagePath ? imagePath.image_url : ""})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              minHeight: "450px",
              height: "100%",
            }}
          />
        </Row>
        <Row className="p-4">
          <Col md={6}>
            <h2>{name}</h2>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Project Type:</strong> {projectType}</p>
            <p><strong>Total Area:</strong> {totalArea} sq ft</p>
            <p><strong>Total Units:</strong> {totalUnits}</p>
            <p><strong>Budget:</strong> Rs. {budget}</p>
            <p><strong>Estimated Revenue:</strong> Rs. {estimatedRevenue}</p>
            <p><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>
            <p><strong>Completion Date:</strong> {new Date(completionDate).toLocaleDateString()}</p>
          </Col>
        </Row>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { slug } = query;
    console.log(`Fetching project data for slug: ${slug}`);

    const project_url = `${API_URLS.projects}/${slug}`; // Adjust the API URL accordingly
    const res = await fetch(project_url);

    if (!res.ok) {
      console.error("Failed to fetch project data. Status:", res.status);
      return { notFound: true };
    }

    const project = (await res.json()) as ProjectResponse;

    if (!project) {
      console.log("Project data fetch was not successful:", project);
      return { notFound: true };
    }

    console.log("Fetched project data:", project);
    return { props: { project } };
  } catch (error) {
    console.error("Error fetching project data:", error);
    return { notFound: true };
  }
};

export default ProjectPage;
