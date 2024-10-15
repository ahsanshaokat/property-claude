import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { GetServerSideProps } from "next";
import { API_URLS } from "@/data/utils/api.urls";
import { Project, ProjectResponse } from "@/data/model/project"; // Assuming you have a similar structure for Project model
import { NextPageWithLayout } from "../_app";
import BaseContainer from "@/components/common/container/BaseContainer";

type ProjectProps = {
  project: ProjectResponse;
};

const ProjectPage: NextPageWithLayout<ProjectProps> = ({ project }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Fallback if no project images are available
  const imagePath = project?.images?.find(
    (image: { type: string; size: string }) =>
      image.type === "header" && image.size === "md"
  );

  // Ensure this component only renders client-side specific content after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!project) {
    console.log("Project data not found or fetch failed.");
    return <p>No project data available.</p>;
  }

  const { name, description, projectType, totalArea, totalUnits, budget, estimatedRevenue, startDate, completionDate } = project;

  return (
    <>
      {/* Display Project Information */}
      <section className="mb-5">
        <BaseContainer>
          <Row>
            <Col
              className="py-0"
              style={{
                backgroundImage: `url(${isMounted && imagePath ? imagePath.image_url : "/default-placeholder.png"})`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                minHeight: "450px",
              }}
            />
          </Row>
          <Row className="py-4 px-2 mt-4">
            <Col md={6} className="d-flex flex-column align-items-start">
              <h2 className="fw-bold text-primary">{name}</h2>
              <p className="mt-2"><strong>Description:</strong> {description}</p>
              <p><strong>Project Type:</strong> {projectType}</p>
              <p><strong>Total Area:</strong> {totalArea} sq ft</p>
              <p><strong>Total Units:</strong> {totalUnits}</p>
              <p><strong>Budget:</strong> Rs. {budget}</p>
              <p><strong>Estimated Revenue:</strong> Rs. {estimatedRevenue}</p>
              <p><strong>Start Date:</strong> {isMounted ? new Date(startDate).toLocaleDateString() : ""}</p>
              <p><strong>Completion Date:</strong> {isMounted ? new Date(completionDate).toLocaleDateString() : ""}</p>

              {/* Action Buttons */}
              <div className="mt-3">
                <Button variant="warning" className="me-2">Contact Us</Button>
                <Button variant="warning">Learn More</Button>
              </div>
            </Col>
          </Row>
        </BaseContainer>
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
