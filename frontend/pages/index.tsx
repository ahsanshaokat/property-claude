import React, { useState, useEffect } from "react";
import PropertyAddBanner from "@/components/common/property-item/PropertyAddBanner";
import PropertyHeader from "@/components/header/PropertyHeader";
import Agents from "@/components/home/Agents";
import HowTo from "@/components/home/HowTo";
import PropertyFeatured from "@/components/home/PropertyFeatured";
import PropertyTypes from "@/components/home/PropertyTypes";
import Meta from "@/components/meta/Meta";
import { getAgents } from "@/data/api/agent";
import { getCities } from "@/data/api/city";
import { getFeatures } from "@/data/api/feature";
import { getProperties } from "@/data/api/property";
import { getPropertyTypes } from "@/data/api/property-types";
import { getProjects } from "@/data/api/project";
import { Agent } from "@/data/model/agent";
import { City } from "@/data/model/city";
import { Feature } from "@/data/model/feature";
import { PropertyList } from "@/data/model/property-list";
import { PropertyType } from "@/data/model/property-type";
import { ProjectList } from "@/data/model/project-list";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { Col, Row, Card, Container } from "react-bootstrap";

type HomeProps = {
  homeData: {
    properties: PropertyList;
    propertyTypes: PropertyType[];
    cities: City[];
    features: Feature[];
    agents: Agent[];
    projects: ProjectList;
  };
};

const Home: NextPageWithLayout<HomeProps> = ({
  homeData: { properties, propertyTypes, cities, features, agents, projects },
}) => {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // This ensures that the component is only rendered after hydration on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Meta
        title="ekzameen.com - Buy, Sell, or Rent Your Dream Property"
        content="Ekzameen.com is your go-to platform for buying, selling, or renting real estate properties. Discover your dream home or perfect investment today!"
      />
      <Container>
        <PropertyHeader
          propertyTypes={propertyTypes}
          cities={cities}
          features={features}
        />
        <PropertyTypes propertyTypes={propertyTypes} />
        <PropertyFeatured properties={properties} />
        <Agents agents={agents} />
        <HowTo />
        <PropertyAddBanner />

        {/* New section for Featured Projects */}
        {isMounted && projects && projects.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-4 text-center">Featured Projects</h2>
            <Row>
              {projects.map((project) => {
                const imageUrl = project.imageUrl;

                return (
                  <Col key={project.id} md={4} className="mb-4">
                    <a
                      className="text-decoration-none"
                      href={`/projects/${project.id}`}
                    >
                      <Card className="h-100 shadow-sm">
                        {/* If imageUrl exists, show the actual image, otherwise show the placeholder with project name */}
                        {imageUrl ? (
                          <Card.Img
                            variant="top"
                            src={imageUrl}
                            alt={project.name}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              height: "200px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#f0f0f0",
                            }}
                          >
                            <h5 className="text-muted">{project.name}</h5>
                          </div>
                        )}
                        <Card.Body>
                          <Card.Title>{project.name}</Card.Title>
                          <Card.Text>{project.description}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                          <a
                            href={`/projects/${project.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </a>
                        </Card.Footer>
                      </Card>
                    </a>
                  </Col>
                );
              })}
            </Row>
          </section>
        )}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const property_url = `?page=1&perPage=6&order[updated_at]=DESC`;

  const [properties, propertyTypes, cities, features, agents, projects] =
    await Promise.all([
      getProperties(property_url),
      getPropertyTypes(),
      getCities(),
      getFeatures(),
      getAgents(),
      getProjects(),
    ]);

  const data = {
    properties: properties.data as PropertyList,
    propertyTypes: propertyTypes.data as PropertyType[],
    cities: cities.data as City[],
    features: features.data as Feature[],
    agents: agents.data as Agent[],
    projects: projects.data as ProjectList,
  };

  return { props: { homeData: data } };
};

export default Home;
