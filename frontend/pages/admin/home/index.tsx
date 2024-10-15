import AdminPropertyList from "@/components/admin/properties/AdminPropertyList";
import AdminProjectList from "@/components/admin/projects/AdminProjectList"; // Add project list component
import Loader from "@/components/common/loader/Loader";
import BasicPagination from "@/components/common/pagination/BasicPagination";
import { HandlePaginationProps } from "@/components/common/pagination/pagination-types";
import AdminLayout from "@/components/layouts/AdminLayout";
import { getCities } from "@/data/api/city";
import {
  BasicType,
  getProperties,
  getPropertiesByFilter,
  PropertiesFilter,
} from "@/data/api/property";
import {
  getProjects,
  getProjectsByFilter,
  ProjectsFilter,
} from "@/data/api/project"; // Add project APIs
import { getPropertyTypes } from "@/data/api/property-types";
import { City } from "@/data/model/city";
import { PropertyList } from "@/data/model/property-list";
import { ProjectList } from "@/data/model/project-list"; // Add project list model
import { PropertyType } from "@/data/model/property-type";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextPageWithLayout } from "@/pages/_app";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { MdCategory, MdLocationCity, MdOutlineHomeWork } from "react-icons/md";

type AdminHomeProps = {
  adminHome: {
    properties: PropertyList;
    projects: ProjectList; // Add projects data
    propertyTypes: PropertyType[];
    cities: City[];
  };
};

const Index: NextPageWithLayout<AdminHomeProps> = ({
  adminHome: { properties, projects, propertyTypes, cities },
}) => {
  const [propertyList, setPropertyList] = useState(properties);
  const [projectList, setProjectList] = useState(projects); // Manage project list state
  const [activePropertyPage, setActivePropertyPage] = useState(1);
  const [activeProjectPage, setActiveProjectPage] = useState(1); // Track project pagination
  const [filterClient, setFilterClient] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false); // Manage project loading state

  const [propertyFilter, setPropertyFilter] = useState<PropertiesFilter>({
    basic: {
      page: properties?.meta?.page || 1, // Fallback to 1 if undefined
      perPage: properties?.meta?.per_page || 10, // Fallback to 10 if undefined
    },
    order: {
      updated_at: "DESC",
    },
  });

  const [projectFilter, setProjectFilter] = useState<ProjectsFilter>({
    basic: {
      page: projects?.meta?.page || 1, // Fallback to 1 if undefined
      perPage: projects?.meta?.per_page || 10, // Fallback to 10 if undefined
    },
    order: {
      updated_at: "DESC",
    },
  });

  const handlePropertyPagination = useCallback(
    (paginationFilter: HandlePaginationProps) => {
      setLoadingProperties(true);
      filterClient === false && setFilterClient(true);
      paginationFilter.page && setActivePropertyPage(paginationFilter.page);

      for (const [key, value] of Object.entries(paginationFilter)) {
        setPropertyFilter((prevState) => ({
          ...prevState,
          basic: {
            ...prevState.basic,
            [key as keyof BasicType]: Number(value),
          },
        }));
      }
    },
    [filterClient]
  );

  const handleProjectPagination = useCallback(
    (paginationFilter: HandlePaginationProps) => {
      setLoadingProjects(true);
      filterClient === false && setFilterClient(true);
      paginationFilter.page && setActiveProjectPage(paginationFilter.page);

      for (const [key, value] of Object.entries(paginationFilter)) {
        setProjectFilter((prevState) => ({
          ...prevState,
          basic: {
            ...prevState.basic,
            [key as keyof BasicType]: Number(value),
          },
        }));
      }
    },
    [filterClient]
  );

  useEffect(() => {
    filterClient &&
      getPropertiesByFilter({
        basic: propertyFilter.basic,
        order: propertyFilter.order,
        filters: propertyFilter.filters,
      }).then((result) => {
        setLoadingProperties(false);
        const propertyData = result?.data as PropertyList;
        setPropertyList((prevState) => ({
          ...prevState,
          data: propertyData.data,
          meta: propertyData.meta,
        }));
      });
  }, [filterClient, propertyFilter.basic, propertyFilter.order, propertyFilter.filters]);

  useEffect(() => {
    filterClient &&
      getProjectsByFilter({
        basic: projectFilter.basic,
        order: projectFilter.order,
        filters: projectFilter.filters,
      }).then((result) => {
        setLoadingProjects(false);
        const projectData = result?.data as ProjectList;
        setProjectList((prevState) => ({
          ...prevState,
          data: projectData.data,
          meta: projectData.meta,
        }));
      });
  }, [filterClient, projectFilter.basic, projectFilter.order, projectFilter.filters]);

  return (
    <Container className="py-5">
      <Row>
        <Col md="4">
          <Card>
            <Card.Body>
              <h4 className="ft-16 text-center">
                <span>
                  <MdOutlineHomeWork size={30} className="text-danger" />
                </span>
              </h4>
              <h4 className="mt-2 mb-2 text-center ft-16 text-uppercase">
                <span>Properties</span>
              </h4>
              <h4 className="mt-1 mb-1 text-center">
                {properties.meta?.all_total || 0} {/* Fallback to 0 if undefined */}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <Card.Body>
              <h4 className="ft-16 text-center">
                <span>
                  <MdOutlineHomeWork size={30} className="text-primary" />
                </span>
              </h4>
              <h4 className="mt-2 mb-2 text-center ft-16 text-uppercase">
                <span>Projects</span>
              </h4>
              <h4 className="mt-1 mb-1 text-center">
                {projects.meta?.all_total || 0} {/* Fallback to 0 if undefined */}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <Card.Body>
              <h4 className="ft-16 text-center">
                <span>
                  <MdCategory size={30} className="text-info" />
                </span>
              </h4>
              <h4 className="mt-2 mb-2 text-center ft-16 text-uppercase">
                <span>Property Types</span>
              </h4>
              <h4 className="mt-1 mb-1 text-center">
                {propertyTypes.length}
              </h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="py-2">
        <Col>
          {loadingProperties && <Loader />}
          {!loadingProperties && propertyList?.data?.length > 0 && (
            <AdminPropertyList data={propertyList.data} />
          )}
        </Col>
      </Row>
      {propertyList?.data?.length > 0 && (
        <Row className="py-1">
          <Col>
            <hr className="mt-2" />
            <BasicPagination
              total={Math.ceil(propertyList.meta?.all_total / propertyList.meta?.per_page || 1)}
              active={activePropertyPage}
              onChange={handlePropertyPagination}
            />
          </Col>
        </Row>
      )}
      <Row className="py-2">
        <Col>
          {loadingProjects && <Loader />}
          {!loadingProjects && projectList?.data?.length > 0 && (
            <AdminProjectList data={projectList.data} />
          )}
        </Col>
      </Row>
      {projectList?.data?.length > 0 && (
        <Row className="py-1">
          <Col>
            <hr className="mt-2" />
            <BasicPagination
              total={Math.ceil(projectList.meta?.all_total / projectList.meta?.per_page || 1)}
              active={activeProjectPage}
              onChange={handleProjectPagination}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const userId = (session.user as any).id as string;
    const role = (session.user as any).role;
    let filterUrl = `?page=1&perPage=12&order[updated_at]=DESC`;
    if (role === "agent" || role === "user") {
      filterUrl += `&filters[userId]=${userId}`;
    }

    const [propertyRes, projectRes, propertyTypes, cities] = await Promise.all([
      getProperties(filterUrl),
      getProjects(filterUrl),
      getPropertyTypes(),
      getCities(),
    ]);

    const homeData = {
      properties: propertyRes.data,
      projects: projectRes.data,
      propertyTypes: propertyTypes.data,
      cities: cities.data,
    };

    return { props: { adminHome: homeData } };
  } else {
    return {
      notFound: true,
    };
  }
};

export default Index;
