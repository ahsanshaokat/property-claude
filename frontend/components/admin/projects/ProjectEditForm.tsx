import { InputField } from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import SubmitButton from "@/components/common/form/SubmitButton";
import { deleteImage, uploadImage } from "@/data/api/image-files";
import { editProject } from "@/data/api/project";
import { Image } from "@/data/model/image-file";
import { Project } from "@/data/model/project";
import { ProjectFormHelpers } from "@/data/types/project/project";
import { getErrorMessage } from "@/data/utils/lib";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import {
  ProjectFormFields,
  projectSchema,
  setProjectEditForm,
  projectTypes,
} from "./project.helper";

type ProjectEditProps = {
  data: ProjectFormHelpers;
  projectData: Project;
};

const ProjectEditForm: React.FC<ProjectEditProps> = ({
  data,
  projectData,
}) => {
  const [project] = useState(projectData);
  const [imageType, setImageType] = useState("");
  const [imageFiles, setImageFiles] = useState<Image[]>([]);
  const [existingImageFiles, setExistingImageFiles] = useState<Image[]>(
    projectData.images || []
  );
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleting, setDeleting] = useState(0);
  const router = useRouter();

  const availableProjectTypes = projectTypes || [];

  const methods = useForm<ProjectFormFields>({
    resolver: yupResolver(projectSchema),
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  useEffect(() => {
    setProjectEditForm(project, setValue);
  }, [project, setValue]);

  const onSubmit = async (data: ProjectFormFields) => {
    const projectFormData = {
      ...data,
      projectImages: imageFiles.map((image) => image.id),
    };

    setSubmitLoading(true);

    try {
      const projectEdit = await editProject(project.id, projectFormData);
      if (projectEdit.status == 200) {
        router.push("/admin/projects");
      } else {
        setSubmitLoading(false);
        alert("Something went wrong!");
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
    }
  };

  const errorMessage = getErrorMessage(errors);

  const handleFileDelete = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    const check = confirm("Are you sure you want to delete the image?");
    if (check) {
      setDeleting(id);
      deleteImage(id)
        .then(() => {
          setDeleting(0);
          setImageFiles(imageFiles.filter((image) => image.id !== id));
          setExistingImageFiles(
            existingImageFiles.filter((image) => image.id !== id)
          );
        })
        .catch((error) => {
          setDeleting(0);
          console.log(error.message);
        });
    }
  };

  const handleFileUpload = (e: SyntheticEvent) => {
    if (!imageType) {
      alert("Please select an image type");
      return;
    }
    const target = e.target as HTMLInputElement;
    const files = target.files instanceof FileList ? target.files : null;
    if (!files) {
      return;
    }
    const formData = new FormData();
    formData.append("type", imageType);
    formData.append("size", "md");
    formData.append("fileName", files[0]);
    setLoading(true);
    uploadImage(formData)
      .then((res) => {
        setLoading(false);
        target.value = "";
        setImageFiles([...imageFiles, res.data]);
        setExistingImageFiles([...existingImageFiles, res.data]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Container fluid>
      <Row>
        <Col className="py-4" md="8">
          <h4 className="mt-2 mb-4 text-justify fw-bold">Project Edit Form</h4>
          <Card>
            <Card.Body>
              <FormProvider {...methods}>
                <Form className="py-3" onSubmit={handleSubmit(onSubmit)}>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Project Name"
                        name="name"
                        inputType="text"
                        errorMessage={errorMessage("name")}
                      />
                    </Col>
                    <Col md="6">
                      <SelectField
                        labelText="Project Type"
                        fieldName="projectType"
                        selectData={availableProjectTypes.map((item) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                        errorMessage={errorMessage("projectType")}
                        defaultValue={project.projectType}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md="12">
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          {...register("description")}
                          defaultValue={project.description}
                          isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorMessage("description")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

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
                        defaultValue={project.totalUnits}
                        inputType="number"
                        errorMessage={errorMessage("totalUnits")}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Budget"
                        defaultValue={project.budget}
                        name="budget"
                        inputType="number"
                        errorMessage={errorMessage("budget")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Estimated Revenue"
                        defaultValue={project.estimatedRevenue}
                        name="estimatedRevenue"
                        inputType="number"
                        errorMessage={errorMessage("estimatedRevenue")}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        labelText="Start Date"
                        defaultValue={project.startDate}
                        name="startDate"
                        inputType="date"
                        errorMessage={errorMessage("startDate")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Completion Date"
                        defaultValue={project.completionDate}
                        name="completionDate"
                        inputType="date"
                        errorMessage={errorMessage("completionDate")}
                      />
                    </Col>
                  </Row>

                  {/* Image Upload Section */}
                  <Row className="mb-3">
                    <Col md="6">
                      <Form.Group controlId="imageUpload">
                        <Form.Label>Upload Project Images</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </Form.Group>
                      <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={() => setImageType("project")}
                      >
                        Set Image Type
                      </Button>
                    </Col>
                  </Row>

                  {/* Display existing images */}
                  <Row>
                    {existingImageFiles.map((image) => (
                      <Col key={image.id} md="3">
                        <Card>
                          <Card.Img variant="top" src={image.url} />
                          <Card.Body>
                            <Button
                              variant="danger"
                              onClick={(e) => handleFileDelete(e, image.id)}
                              disabled={deleting === image.id}
                            >
                              {deleting === image.id ? "Deleting..." : "Delete"}
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
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

export default ProjectEditForm;
