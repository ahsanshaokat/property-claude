import React from "react";
import { Company } from "@/data/model/company"; // Replace with actual company model path
import { useRouter } from "next/router";
import { Row, Col, Table, Button } from "react-bootstrap";

type Companies = {
  data: Company[];
};

const AdminCompanyList: React.FC<Companies> = ({ data }) => {
  const router = useRouter();

  return (
    <Row className="py-4 px-2">
      <Col>
        {/* Create New Company Button */}
        <Button
          variant="warning"
          onClick={() => router.push("/admin/companies/create")}
          className="rounded-0 ft-13 fw-normal"
        >
          Create New Company
        </Button>

        <Table className="border" responsive>
          <thead>
            <tr>
              <th className="ft-14 text-uppercase">Name</th>
              <th className="ft-14 text-uppercase">Address</th>
              <th className="ft-14 text-uppercase">Website</th>
              <th className="ft-14 text-uppercase">Edit</th>
              <th className="ft-14 text-uppercase">Preview</th>
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.address || "N/A"}</td>
                <td>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    {company.website || "N/A"}
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => router.push(`/admin/companies/edit/${company.id}`)}
                    className="btn btn-warning"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => router.push(`/companies/${company.id}`)}
                    className="btn btn-info"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default AdminCompanyList;
