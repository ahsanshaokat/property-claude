import BaseContainer from "@/components/common/container/BaseContainer";
import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <BaseContainer>
      <Row className="py-3">
        <Col md={{ span: 8, offset: 2 }}>
          <Card>
            <Card.Body>
              <Row>
                <Col md="12">
                  <h3 className="text-center ft-24 fw-bold">Privacy Policy</h3>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="12">
                  <p>
                    Welcome to Ekzameen.com. Your privacy is of utmost importance to us. This privacy policy
                    explains how we collect, use, and protect your information when you use our services.
                  </p>
                  <h5 className="mt-4">1. Information We Collect</h5>
                  <p>
                    We may collect personal information such as your name, email address, and other contact details
                    when you sign up or interact with our services.
                  </p>
                  <h5 className="mt-4">2. How We Use Your Information</h5>
                  <p>
                    We use the information collected to provide, improve, and personalize our services. We may also use it
                    for security purposes, marketing, or to communicate with you about updates or other relevant information.
                  </p>
                  <h5 className="mt-4">3. Sharing Your Information</h5>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to outside parties, except
                    when necessary to provide our services or comply with the law.
                  </p>
                  <h5 className="mt-4">4. Security of Your Information</h5>
                  <p>
                    We implement various security measures to protect your personal information. However, no method of
                    transmission over the internet is completely secure, so we cannot guarantee absolute security.
                  </p>
                  <h5 className="mt-4">5. Changes to This Privacy Policy</h5>
                  <p>
                    We may update our privacy policy from time to time. Any changes will be posted on this page with
                    an updated effective date.
                  </p>
                  <h5 className="mt-4">6. Contact Us</h5>
                  <p>
                    If you have any questions regarding this privacy policy, please contact us at officalekzameen@gmail.com.
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
