import React from "react";
import { Project } from "@/data/model/project";
import { useRouter } from "next/router";
import { Row, Col, Table, Button } from "react-bootstrap";

type Projects = {
  data: Project[];
};

const AdminProjectList: React.FC<Projects> = ({ data }) => {
  const router = useRouter();

  return (
    <Row className="py-4 px-2">
      <Col>
        {/* Create New Project Button */}

        <Table className="border" responsive>
          <thead>
            <tr>
              <th className="ft-14 text-uppercase">Name</th>
              <th className="ft-14 text-uppercase">Description</th>
              <th className="ft-14 text-uppercase">Company</th>
              <th className="ft-14 text-uppercase">Edit</th>
              <th className="ft-14 text-uppercase">Preview</th>
            </tr>
          </thead>
          <tbody>
            {data.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.company ? project.company.name : "No Company"}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    Preview
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default AdminProjectList;
