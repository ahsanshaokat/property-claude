import { Property } from "@/data/model/property";
import React from "react";
import { Row, Col } from "react-bootstrap";
import SpecificationInfo from "./SpecificationInfo";
import SpecificationInfoDetails from "./SpecificationInfoDetails";

type PropertySpecificationsProps = {
  data?: Property;
};
const PropertySpecifications: React.FC<PropertySpecificationsProps> = ({
  data,
}) => {
  return (
    <>
      <SpecificationInfo title="Specification" lClSize={3} rClSize={9}>
        <Row>
          <Col md="6">
            <SpecificationInfoDetails
              title="Bedrooms:"
              content={data?.noOfBedRoom as number}
            />
            <SpecificationInfoDetails
              title="Property size:"
              content={data?.propertySize as number}
              contentPostfix="sq ft"
            />
            <SpecificationInfoDetails
              title="Total floors:"
              content={data?.totalFloors as number}
            />
            <SpecificationInfoDetails
              title="Heating:"
              content={data?.heating as string}
            />
          </Col>
          <Col md="6">
            <SpecificationInfoDetails
              title="Bathrooms:"
              content={data?.noOfBathRoom as number}
            />
            <SpecificationInfoDetails
              title="Year Built:"
              content={data?.yearBuild as number}
            />
            <SpecificationInfoDetails
              title="Accommodation:"
              content={data?.accommodations as string}
            />
          </Col>
        </Row>
      </SpecificationInfo>
    </>
  );
};

export default PropertySpecifications;
