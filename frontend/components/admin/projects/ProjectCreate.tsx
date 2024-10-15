import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/data/utils/lib";
import { InputField } from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import { ProjectFormData, ProjectFormFields, projectSchema, projectTypes } from "./project.helper";
import { createProject } from "@/data/api/project";
import { useRouter } from "next/router";
import SubmitButton from "@/components/common/form/SubmitButton";

const ProjectCreate: React.FC<ProjectFormData> = ({ companies }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // State for file uploads
  const router = useRouter();

  const methods = useForm<ProjectFormFields>({
    resolver: yupResolver(projectSchema),
    mode: "onTouched",
  });

  const { handleSubmit, formState: { errors }, register } = methods;

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const onSubmit = async (formData: ProjectFormFields) => {
    setSubmitLoading(true);
  
    // Properly format the dates as ISO 8601 format without time zone issues
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("projectType", formData.projectType);
    payload.append("totalArea", formData.totalArea || 0);
    payload.append("totalUnits", formData.totalUnits || 0);
    payload.append("companyId", formData.companyId.toString());
    payload.append("startDate", new Date(formData.startDate).toISOString()); // Ensure date is properly formatted
    payload.append("completionDate", new Date(formData.completionDate).toISOString()); // Ensure date is properly formatted
    payload.append("budget", formData.budget || 0);
    payload.append("estimatedRevenue", formData.estimatedRevenue || 0);
    payload.append("isActive", formData.isActive ? "true" : "false");
  
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        payload.append("images", file);
      });
    }
  
    try {
      const response = await createProject(payload);
      if (response.status === 200 || 201) {
        router.push("/admin/projects");
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
          <h4 className="mt-2 mb-4 text-justify fw-bold">Project Create Form</h4>
          <Card>
            <Card.Body>
              <FormProvider {...methods}>
                <Form className="py-3" onSubmit={handleSubmit(onSubmit)}>

                  {/* Project Name Field */}
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Project Name"
                        name="name"
                        inputType="text"
                        errorMessage={errorMessage("name")}
                      />
                    </Col>

                    {/* Company Selection */}
                    <Col md="6">
                      <SelectField
                        labelText="Company"
                        fieldName="companyId"
                        selectData={
                          companies.length > 0
                            ? companies.map((company: { id: number; name: string }) => ({
                                id: company.id,
                                name: company.name,
                              }))
                            : [{ id: "", name: "No companies available" }]
                        }
                        errorMessage={errorMessage("companyId")}
                      />
                    </Col>
                  </Row>

                  {/* Project Type Selection */}
                  <Row className="mb-3">
                    <Col md="6">
                      <SelectField
                        labelText="Project Type"
                        fieldName="projectType"
                        selectData={projectTypes.map((type) => ({
                          id: type.id,
                          name: type.name,
                        }))}
                        errorMessage={errorMessage("projectType")}
                      />
                    </Col>
                  </Row>

                  {/* Images Upload */}
                  <Row className="mb-3">
                    <Col md="6">
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload Images</Form.Label>
                        <Form.Control
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Description Field */}
                  <Form.Group className="mb-3" controlId="projectDescription">
                    <Form.Label>Project Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...register("description")}
                      className={errors?.description ? "is-invalid" : ""}
                    />
                    {errors?.description && (
                      <p className="text-danger">{errorMessage("description")}</p>
                    )}
                  </Form.Group>

                  {/* Total Area and Total Units Fields */}
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Total Area"
                        name="totalArea"
                        inputType="number"
                        errorMessage={errorMessage("totalArea")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Total Units"
                        name="totalUnits"
                        inputType="number"
                        errorMessage={errorMessage("totalUnits")}
                      />
                    </Col>
                  </Row>

                  {/* Budget and Estimated Revenue Fields */}
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Budget"
                        name="budget"
                        inputType="number"
                        errorMessage={errorMessage("budget")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Estimated Revenue"
                        name="estimatedRevenue"
                        inputType="number"
                        errorMessage={errorMessage("estimatedRevenue")}
                      />
                    </Col>
                  </Row>

                  {/* Start Date and Completion Date Fields */}
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Start Date"
                        name="startDate"
                        inputType="date"
                        errorMessage={errorMessage("startDate")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Completion Date"
                        name="completionDate"
                        inputType="date"
                        errorMessage={errorMessage("completionDate")}
                      />
                    </Col>
                  </Row>

                  {/* Is Active Field */}
                  <Row className="mb-3">
                    <Col md="6">
                      <SelectField
                        labelText="Is Active"
                        fieldName="isActive"
                        selectData={[
                          { id: true, name: "Active" },
                          { id: false, name: "Inactive" },
                        ]}
                        errorMessage={errorMessage("isActive")}
                      />
                    </Col>
                  </Row>

                  {/* Submit Button */}
                  <SubmitButton
                    title="Create Project"
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

export default ProjectCreate;
