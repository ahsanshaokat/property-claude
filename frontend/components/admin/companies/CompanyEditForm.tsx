import { InputField } from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import SubmitButton from "@/components/common/form/SubmitButton";
import { editCompany } from "@/data/api/company"; // Update to company API path
import { Company } from "@/data/model/company"; // Update to company model path
import { CompanyFormHelpers } from "@/data/types/company/company"; // Update to company helper path
import { getErrorMessage } from "@/data/utils/lib";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { companySchema, setCompanyEditForm } from "./company.helper"; // Update to company helper path

type CompanyEditProps = {
  data: CompanyFormHelpers;
  companyData: Company;
};

const CompanyEditForm: React.FC<CompanyEditProps> = ({
  data,
  companyData,
}) => {
  const [company] = useState(companyData);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(companySchema), // Use company schema
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  useEffect(() => {
    setCompanyEditForm(company, setValue); // Set form values based on company data
  }, [company, setValue]);

  const onSubmit = async (data: any) => {
    setSubmitLoading(true);

    try {
      const companyEdit = await editCompany(company.id, data); // Call the API to edit the company
      if (companyEdit.status === 200) {
        router.push("/admin/companies"); // Redirect to the company list after successful edit
      } else {
        setSubmitLoading(false);
        alert("Something went wrong!");
      }
    } catch (error) {
      setSubmitLoading(false);
      console.error(error);
    }
  };

  const errorMessage = getErrorMessage(errors);

  return (
    <Container fluid>
      <Row>
        <Col className="py-4" md="8">
          <h4 className="mt-2 mb-4 text-justify fw-bold">Company Edit Form</h4>
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
                        inputType="url"
                        errorMessage={errorMessage("website")}
                      />
                    </Col>
                    <Col md="6">
                      <SelectField
                        labelText="Is Active"
                        fieldName="isActive"
                        selectData={[
                          { id: true, name: "Active" },
                          { id: false, name: "Inactive" }
                        ]}
                        errorMessage={errorMessage("isActive")}
                      />
                    </Col>
                  </Row>

                  <SubmitButton
                    title="Submit"
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

export default CompanyEditForm;
