import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Company } from "@/data/model/company"; // Assuming a similar structure to Property

type CompanyGeneralInfoProps = {
  data?: Company;
};

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({ data }) => {
  return (
    <Container>
      <Row className="">
        <Col md="9" className="px-3">
          <h2 className="ft-24 fw-bold px-1">
            {data?.name}
          </h2>
          <p>{data?.description}</p>
          <p>Address: {data?.address}</p>
          <p>Website: {data?.website}</p>
        </Col>
        <Col md="3" className="px-3">
          <a href={`tel:${data?.phoneNumber}`} className="btn btn-warning w-100 py-2 mt-1 ft-14 fw-bold text-uppercase rounded-0">
            Call: {data?.phoneNumber}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyGeneralInfo;
