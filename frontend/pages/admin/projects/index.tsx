import AdminProjectList from "@/components/admin/projects/AdminProjectList";
import Loader from "@/components/common/loader/Loader";
import { useRouter } from "next/router";
import BasicPagination from "@/components/common/pagination/BasicPagination";
import { HandlePaginationProps } from "@/components/common/pagination/pagination-types";
import AdminLayout from "@/components/layouts/AdminLayout";
import { getProjects } from "@/data/api/project";
import { ProjectList } from "@/data/model/project-list";
import { NextPageWithLayout } from "@/pages/_app";
import { GetServerSideProps } from "next";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import Link from "next/link"; // Import Link for navigation

type AdminProjectsProps = {
  projects: ProjectList | null; // Allow projects to be null initially
};

const Index: NextPageWithLayout<AdminProjectsProps> = ({ projects }) => {
  const router = useRouter();
  const [projectList, setProjectList] = useState<ProjectList | null>(projects); // Set default to null if projects is not provided
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(false);

  // Log the initial project list to check if it's coming correctly from SSR
  useEffect(() => {
    console.log("Initial project list from SSR:", projectList);
  }, [projectList]);

  const handlePagination = useCallback(
    (paginationFilter: HandlePaginationProps) => {
      setLoading(true);
      paginationFilter.page && setActive(paginationFilter.page);

      getProjects(paginationFilter)
        .then((result) => {
          console.log("Fetched projects on pagination:", result.data); // Log the fetched projects on pagination
          setLoading(false);
          setProjectList(result.data as ProjectList);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching paginated projects:", error); // Log error if the request fails
        });
    },
    []
  );

  return (
    <Container className="py-1">
      <Row className="py-2">
        <Col>
        
        <Button
          variant="warning"
          onClick={() => router.push("/admin/projects/create")}
          className="rounded-0 ft-13 fw-normal mb-3"
        >
          Create New Project
        </Button>
          {loading && <Loader />}
          {/* Check if projectList and projectList.data are available */}
          {!loading && projectList && projectList.length > 0 ? (
            <AdminProjectList data={projectList} />
          ) : (
            <p>No projects available</p> // Fallback when there are no projects
          )}
        </Col>
      </Row>

      {/* Check for projectList.meta to avoid errors */}
      {projectList && projectList.data && projectList.meta && projectList.data.length > 0 && (
        <Row className="py-1">
          <Col>
            <hr className="mt-2" />
            <BasicPagination
              total={Math.ceil(projectList.meta.all_total / projectList.meta.per_page)}
              active={active}
              onChange={handlePagination}
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const projects = await getProjects();
    console.log("Projects from API call:", projects); // Log the project API response
    return { props: { projects: projects.data || null } }; // Default to null if no projects
  } catch (error) {
    console.error("Failed to fetch projects", error);
    return { props: { projects: null } }; // Handle API failure gracefully
  }
};

export default Index;
