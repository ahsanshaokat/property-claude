import React from "react";
import BaseContainer from "@/components/common/container/BaseContainer";
import { Row, Col, Card } from "react-bootstrap";
import { GetServerSideProps } from "next";
import { API_URLS } from "@/data/utils/api.urls";
import { Company, CompanyResponse } from "@/data/model/company";
import { NextPageWithLayout } from "../_app";

type CompanyProps = {
  company: CompanyResponse | null; // Allow null if fetch fails
};

const CompanyPage: NextPageWithLayout<CompanyProps> = ({ company }) => {
  if (!company) {
    console.log("Company data not found or failed:", company);
    return <p>No company data available.</p>;
  }

  const { name, address, phoneNumber, website, email, projects } = company;

  // Fallback if no company images are available
  const imagePath = company.companyImages?.find(
    (image: { type: string; size: string; }) => image.type === "header" && image.size === "md"
  );

  return (
    <>
      {/* Display Company Information */}
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
            <p><strong>Address:</strong> {address}</p>
            {phoneNumber && <p><strong>Phone:</strong> {phoneNumber}</p>}
            {website && <p><strong>Website:</strong> <a href={`http://${website}`} target="_blank" rel="noopener noreferrer">{website}</a></p>}
            {email && <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>}
          </Col>
        </Row>
      </section>

      {/* Display Projects */}
      <BaseContainer>
        <h3>Projects</h3>
        <Row>
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Col md={4} key={project.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{project.name}</Card.Title>
                    <Card.Text>
                      <strong>Description:</strong> {project.description}<br />
                      <strong>Type:</strong> {project.projectType}<br />
                      <strong>Total Area:</strong> {project.totalArea} sq ft<br />
                      <strong>Total Units:</strong> {project.totalUnits}<br />
                      <strong>Budget:</strong> Rs. {project.budget}<br />
                      <strong>Estimated Revenue:</strong> Rs. {project.estimatedRevenue}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No projects found for this company.</p>
          )}
        </Row>
      </BaseContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug } = query;
  console.log(`Fetching company data for slug: ${slug}`);

  try {
    const company_url = `${API_URLS.companies}/${slug}`; // Ensure this matches your API endpoint structure
    const res = await fetch(company_url);

    if (!res.ok) {
      console.error("Failed to fetch company data. Status:", res.status);
      return { notFound: true };
    }

    const company = await res.json();

    if (!company) {
      console.log("Company data fetch was not successful:", company);
      return { notFound: true };
    }

    console.log("Fetched company data:", company);
    return { props: { company } };
  } catch (error) {
    console.error("Error fetching company data:", error);
    return { notFound: true };
  }
};

export default CompanyPage;
