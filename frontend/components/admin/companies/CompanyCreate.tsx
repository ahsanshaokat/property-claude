import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { getErrorMessage } from "@/data/utils/lib";
import { InputField } from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField"; // Importing SelectField component for dropdown
import { companySchema, CompanyFormData, CompanyFormFields } from "./company.helper"; // Replace with your actual path for company helpers
import { createCompany } from "@/data/api/company"; // Replace with your actual path for company API
import { useRouter } from "next/router";
import SubmitButton from "@/components/common/form/SubmitButton";

const CompanyCreate: React.FC<CompanyFormData> = ({ data }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<CompanyFormFields>({
    resolver: yupResolver(companySchema),
    mode: "onTouched",
  });

  const { handleSubmit, formState: { errors }, register } = methods;

  const onSubmit = async (formData: CompanyFormFields) => {
    setSubmitLoading(true);
    try {
      const response = await createCompany(formData);
      if (response.status === 200 || response.status === 201) {
        router.push("/admin/companies");
      } else {
        setSubmitLoading(false);
        console.error("Failed response", response);
      }
    } catch (error) {
      setSubmitLoading(false);
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  const errorMessage = getErrorMessage(errors);

  return (
    <Container fluid>
      <Row>
        <Col className="py-4" md="8">
          <h4 className="mt-2 mb-4 text-justify fw-bold">Company Create Form</h4>
          <Card>
            <Card.Body>
              <FormProvider {...methods}>
                <Form className="py-3" onSubmit={handleSubmit(onSubmit)}>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Company Name"
                        name="name"
                        inputType="text"
                        errorMessage={errorMessage("name")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Address"
                        name="address"
                        inputType="text"
                        errorMessage={errorMessage("address")}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Website"
                        name="website"
                        inputType="text"
                        errorMessage={errorMessage("website")}
                      />
                    </Col>
                    <Col md="6">
                      {/* Dropdown for User Selection */}
                      <SelectField
                        labelText="Assign User"
                        fieldName="userId"
                        selectData={data?.users.map((user: { id: number; firstName: string; lastName: string; }) => ({
                          id: user.id,
                          name: `${user.firstName} ${user.lastName}`, // Display full name in dropdown
                        }))}
                        errorMessage={errorMessage("userId")}
                      />
                    </Col>
                  </Row>

                  <SubmitButton
                    title="Create Company"
                    isLoading={submitLoading}
                    buttonCls="mt-3"
                  />
                </Form>
              </FormProvider>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyCreate;
