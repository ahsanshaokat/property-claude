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
import { getProjects } from "@/data/api/project"; // Import projects API
import { Agent } from "@/data/model/agent";
import { City } from "@/data/model/city";
import { Feature } from "@/data/model/feature";
import { PropertyList } from "@/data/model/property-list";
import { PropertyType } from "@/data/model/property-type";
import { ProjectList } from "@/data/model/project-list"; // Import project list model
import { GetServerSideProps } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { NextPageWithLayout } from "./_app";
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";

type HomeProps = {
  homeData: {
    properties: PropertyList;
    propertyTypes: PropertyType[];
    cities: City[];
    features: Feature[];
    agents: Agent[];
    projects: ProjectList; // Add projects to the home data
  };
};

const Home: NextPageWithLayout<HomeProps> = ({
  homeData: { properties, propertyTypes, cities, features, agents, projects }, // Include projects in the props
}) => {
  const { data: session } = useSession();
  if (session) {
    //console.log(session)
  }

  return (
    <>
      <Meta
        title="ekzameen.com - Buy, Sell, or Rent Your Dream Property"
        content="Ekzameen.com is your go-to platform for buying, selling, or renting real estate properties. Discover your dream home or perfect investment today!"
      />
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
      
      {/* New section for Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="mt-5">Featured Projects</h2>
          {projects.map((project: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) => (
            <div key={project.id} className="mt-3">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const property_url = `?page=1&perPage=6&order[updated_at]=DESC`;

  // Fetch projects along with the existing data
  const [properties, propertyTypes, cities, features, agents, projects] =
    await Promise.all([
      getProperties(property_url),
      getPropertyTypes(),
      getCities(),
      getFeatures(),
      getAgents(),
      getProjects(), // Fetch projects data
    ]);

  const data = {
    properties: properties.data as PropertyList,
    propertyTypes: propertyTypes.data as PropertyType[],
    cities: cities.data as City[],
    features: features.data as Feature[],
    agents: agents.data as Agent[],
    projects: projects.data as ProjectList, // Add projects to the data
  };

  console.log(data.propertyTypes);

  return { props: { homeData: data } };
};

export default Home;
