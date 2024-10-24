import { Property } from "@/data/model/property";
import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap"; // Assuming you're using react-bootstrap
import BathIcon from "../common/icon/Bath";
import BedIcon from "../common/icon/Bed";
import PropertySizeIcon from "../common/icon/PropertySize";
import PropertyInquiryModal from "./inquiry/PropertyInquiryModal";

type PropertyGeneralInfo = {
  data?: Property;
};

const PropertyGeneralInfo: React.FC<PropertyGeneralInfo> = ({ data }) => {
  const [modalShow, setModalShow] = useState(false);
  const setModalClose = (show: boolean) => {
    setModalShow(false);
  };

  return (
    <Container>
      <Row className="">
        <Col md="9" className="px-3">
          <Row>
            <Col md="3" xs="12" className="py-1 mt-1">
              <div className="border-end">
                <h2 className="ft-24 fw-bold px-1">
                  Rs.{data?.price.toFixed(2)}
                  {data?.purpose === "RENT" && (
                    <span className="ft-16 text-color-b94">/mo</span>
                  )}
                </h2>
              </div>
            </Col>
            <Col md="3" xs="6" className="py-1 mt-1">
              <div className="border-end">
                <span className="px-2 text-color-09a">
                  <BedIcon />
                </span>
                <span className="ft-14 text-colo-a3a">
                  {data?.noOfBedRoom} Bedrooms
                </span>
              </div>
            </Col>
            <Col md="3" xs="6" className="py-1 mt-1">
              <div className="border-end">
                <span className="px-2 text-color-09a">
                  <BathIcon />
                </span>
                <span className="ft-14 text-colo-a3a">
                  {data?.noOfBathRoom} Bathrooms
                </span>
              </div>
            </Col>
            <Col md="3" xs="6" className="py-1 mt-1">
              <span className="px-2 text-color-09a">
                <PropertySizeIcon />
              </span>
              <span className="ft-14 text-colo-a3a">
                {data?.propertySize} sq ft
              </span>
            </Col>
          </Row>
        </Col>
        <Col md="3" className="px-3">
          {/* Replacing <a> tag with Button */}
          <Button
            variant="warning"
            className="w-100 py-2 mt-1 ft-14 fw-bold text-uppercase rounded-0"
            href={`tel:${data?.additionalSpec as string}`} // href is used for the 'tel' action
          >
            Call on phone number
          </Button>
        </Col>
        <PropertyInquiryModal
          modalShow={modalShow}
          setModalClose={setModalClose}
        />
      </Row>
    </Container>
  );
};

export default PropertyGeneralInfo;
