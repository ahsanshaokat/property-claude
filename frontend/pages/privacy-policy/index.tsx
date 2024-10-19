import BaseContainer from "@/components/common/container/BaseContainer";
import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <BaseContainer>
      <Row className="py-5">
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row>
                <Col md="12">
                  <h3 className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '28px', color: '#007bff' }}>
                    Privacy Policy
                  </h3>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="12">
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    Welcome to Ekzameen.com. Your privacy is of utmost importance to us. This privacy policy
                    explains how we collect, use, and protect your information when you use our services.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>1. Information We Collect</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    We may collect personal information such as your name, email address, and other contact details
                    when you sign up or interact with our services. Please note that we do not collect any location 
                    or device information.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>2. How We Use Your Information</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    We use the information collected to provide, improve, and personalize our services. We may also use it
                    for security purposes, marketing, or to communicate with you about updates or other relevant information.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>3. Sharing Your Information</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    We do not sell, trade, or otherwise transfer your personal information to outside parties, except
                    when necessary to provide our services or comply with the law.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>4. Security of Your Information</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    We implement various security measures such as encryption and access controls to protect your personal information. 
                    However, no method of transmission over the internet is completely secure, so we cannot guarantee absolute security.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>5. Data Retention and Deletion</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    We retain your data for as long as necessary to provide our services. You can request the deletion of your data at any 
                    time by contacting us at <a href="mailto:officialekzameen@gmail.com">support@ekzameen.com</a>. We will take appropriate steps to securely delete your information.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>6. Changes to This Privacy Policy</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    We may update our privacy policy from time to time. Any changes will be posted on this page with
                    an updated effective date.
                  </p>
                  <h5 className="mt-4" style={{ fontWeight: '600', color: '#343a40' }}>7. Contact Us</h5>
                  <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                    If you have any questions regarding this privacy policy, please contact us at 
                    <a href="mailto:officialekzameen@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}> support@ekzameen.com</a>.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </BaseContainer>
  );
};

export default PrivacyPolicy;
