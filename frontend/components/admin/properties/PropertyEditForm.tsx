import { InputField } from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import SubmitButton from "@/components/common/form/SubmitButton";
import Loading from "@/components/common/icon/Loading";
import { deleteImage, uploadImage } from "@/data/api/image-files";
import { editProperty } from "@/data/api/property";
import { Image } from "@/data/model/image-file";
import { Property } from "@/data/model/property";
import { PropertyFormHelpers } from "@/data/types/property/property";
import { getErrorMessage } from "@/data/utils/lib";
import { yupResolver } from "@hookform/resolvers/yup";
import { property } from "lodash";
import { useRouter } from "next/router";
import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Nav,
  Spinner,
} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import {
  propertyFeatureMerge,
  PropertyFormFields,
  propertyPurpose,
  propertySchema,
  setPropertyEditForm,
} from "./property.helpers";

type PropertyEditProps = {
  data: PropertyFormHelpers;
  propertyData: Property;
};

const PropertyEditForm: React.FC<PropertyEditProps> = ({
  data,
  propertyData,
}) => {
  const [property] = useState(propertyData);
  const [cities] = useState(data.cities);
  const [propertyTypes] = useState(data.propertyTypes);
  const [features] = useState(data.features);
  const [checkedFeatures, setCheckedFeatures] = useState<number[]>([]);
  const [imageType, setImageType] = useState("");
  const [imageFiles, setImageFiles] = useState<Image[]>([]);
  const [existingImageFiles, setExistingImageFiles] = useState<Image[]>(
    propertyData.propertyImages
  );
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleting, setDeleting] = useState(0);
  const router = useRouter();

  const methods = useForm<PropertyFormFields>({
    resolver: yupResolver(propertySchema),
    mode: "onTouched",
  });
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  useEffect(() => {
    setPropertyEditForm(property, setValue);
  }, [property, setValue]);

  // const watchPurpose = watch("purpose");

  const onSubmit = async (data: PropertyFormFields) => {
    const { itemToBeAdded, itemToBeDeleted } = propertyFeatureMerge(
      property,
      data.features
    );
    const propertyFormData = {
      ...data,
      features: itemToBeAdded,
      propertyImages: imageFiles.map((image) => image.id),
      itemToBeDeleted,
    };

    setSubmitLoading(true);

    try {
      const propertyEdit = await editProperty(property.id, propertyFormData);
      if (propertyEdit.status == 200) {
        router.push("/admin/properties");
      } else {
        setSubmitLoading(false);
        console.log(propertyEdit);
        alert("Something went wrong !");
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
    }
  };

  const errorMessage = getErrorMessage(errors);

  const handleFeature = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    let updatedList = [...checkedFeatures];
    if (target.checked) {
      updatedList = [...checkedFeatures, +target.value];
    } else {
      updatedList.splice(checkedFeatures.indexOf(+target.value), 1);
    }
    setCheckedFeatures(updatedList);
  };

  const handleFileDelete = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    const check = confirm("Are sure want to delete image?");
    if (check) {
      setDeleting(id);
      deleteImage(id)
        .then(async (res) => {
          setDeleting(0);
          setImageFiles([...imageFiles.filter((image) => image.id !== id)]);
          setExistingImageFiles([
            ...existingImageFiles.filter((image) => image.id !== id),
          ]);
        })
        .catch((error) => {
          setDeleting(0);
          console.log(error.message);
        });
    }
  };

  const handleFileUpload = (e: SyntheticEvent) => {
    if (!imageType) {
      alert("Please select image type");
      return;
    }
    const target = e.target as HTMLInputElement;
    const files = target.files instanceof FileList ? target.files : null;
    if (!files) {
      return;
    }
    let formData = new FormData();
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
          <h4 className="mt-2 mb-4 text-justify fw-bold">Property Edit Form</h4>
          <Card>
            <Card.Body>
              <FormProvider {...methods}>
                <Form className="py-3" onSubmit={handleSubmit(onSubmit)}>
                  <Row className="mb-3">
                    <Col md="4">
                      <SelectField
                        labelText="Property Type"
                        fieldName="propertyType"
                        // register={register}
                        selectData={propertyTypes.map((item) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                        errorMessage={errorMessage("propertyType")}
                      />
                    </Col>

                    <Col md="4">
                      <SelectField
                        labelText="City"
                        // register={register}
                        fieldName="city"
                        selectData={cities}
                        errorMessage={errorMessage("city")}
                      />
                    </Col>

                    <Col md="4">
                      <InputField
                        labelText="Property Name"
                        // register={register}
                        name="name"
                        inputType="text"
                        errorMessage={errorMessage("name")}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md="6">
                      <SelectField
                        labelText="Purpose"
                        // register={register}
                        fieldName="purpose"
                        selectData={propertyPurpose}
                        errorMessage={errorMessage("purpose")}
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        labelText="Address"
                        // register={register}
                        name="address"
                        inputType="text"
                        errorMessage={errorMessage("address")}
                      />
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="propertyDescription">
                    <Form.Label>Descriptions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...register("descriptions")}
                      className={errors?.descriptions ? "is-invalid" : ""}
                    />
                    {errors?.address && (
                      <p className="text-danger">{errorMessage("address")}</p>
                    )}
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md="3">
                      <InputField
                        labelText="Price"
                        // register={register}
                        name="price"
                        inputType="number"
                        errorMessage={errorMessage("price")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="No Of Bed Room"
                        // register={register}
                        name="noOfBedRoom"
                        inputType="number"
                        errorMessage={errorMessage("noOfBedRoom")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="No Of Bath Room"
                        // register={register}
                        name="noOfBathRoom"
                        inputType="number"
                        errorMessage={errorMessage("noOfBathRoom")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="Property Size"
                        // register={register}
                        name="propertySize"
                        inputType="number"
                        errorMessage={errorMessage("propertySize")}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md="3">
                      <InputField
                        labelText="Year Build"
                        // register={register}
                        name="yearBuild"
                        inputType="number"
                        errorMessage={errorMessage("yearBuild")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="Total Floors"
                        // register={register}
                        name="totalFloors"
                        inputType="number"
                        errorMessage={errorMessage("totalFloors")}
                      />
                    </Col><Col md="6">
                      <InputField
                        labelText="Contact Number"
                        // register={register}
                        name="additionalSpec"
                        inputType="text"
                        errorMessage={errorMessage("additionalSpec")}
                      />
                    </Col>
                    {/* <Col md="3">
                      <InputField
                        labelText="Ceiling Height (meter)"
                        // register={register}
                        name="ceilingHeight"
                        inputType="number"
                        errorMessage={errorMessage("ceilingHeight")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="Electricity Cost"
                        // register={register}
                        name="electricityCost"
                        inputType="text"
                        errorMessage={errorMessage("electricityCost")}
                      />
                    </Col> */}
                  </Row>

                  <Row className="mb-3">
                    {/* <Col md="3">
                      <InputField
                        labelText="Distance From Center(Miles)"
                        // register={register}
                        name="distanceFromCenter"
                        inputType="number"
                        errorMessage={errorMessage("distanceFromCenter")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="Parking"
                        // register={register}
                        name="parking"
                        inputType="text"
                        errorMessage={errorMessage("parking")}
                      />
                    </Col>
                    <Col md="3">
                      <InputField
                        labelText="Area Size"
                        // register={register}
                        name="areaSize"
                        inputType="number"
                        errorMessage={errorMessage("areaSize")}
                      />
                    </Col> */}
                    <Col md="3">
                      {/* <div className="mt-4">
                        <Form.Group id="propertyGarage">
                          <Form.Check
                            type="checkbox"
                            label="Garage"
                            {...register("garage")}
                          />
                        </Form.Group>
                      </div> */}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    {/* <Col md="3">
                      <InputField
                        labelText="Accommodations"
                        // register={register}
                        name="accommodations"
                        inputType="text"
                        errorMessage={errorMessage("accommodations")}
                      />
                    </Col> */}

                    
{/* 
                    <Col md="3">
                      <InputField
                        labelText="Utility Cost"
                        // register={register}
                        name="utilityCost"
                        inputType="number"
                        errorMessage={errorMessage("utilityCost")}
                      />
                    </Col> */}

                    {/* <Col md="3">
                      <InputField
                        labelText="Cable Tv Cost"
                        // register={register}
                        name="cableTvCost"
                        inputType="number"
                        errorMessage={errorMessage("cableTvCost")}
                      />
                    </Col> */}
                  </Row>

                  {/* <Row className="mb-3">
                    <Col md="4">
                      <InputField
                        labelText="Heating"
                        // register={register}
                        name="heating"
                        inputType="text"
                        errorMessage={errorMessage("heating")}
                      />
                    </Col>

                    <Col md="4">
                      <InputField
                        labelText="Lat"
                        // register={register}
                        name="lat"
                        inputType="number"
                        errorMessage={errorMessage("lat")}
                      />
                    </Col>

                    <Col md="4">
                      <InputField
                        labelText="Long"
                        // register={register}
                        name="long"
                        inputType="number"
                        errorMessage={errorMessage("long")}
                      />
                    </Col>
                  </Row> */}

                  <Row className="mb-2">
                    <h6 className="mt-1 mb-1">Features </h6>
                    {features.length > 0 &&
                      features.map((feature, index) => {
                        return (
                          <Col md="3" key={index} className="mt-2">
                            <Card>
                              <Card.Body>
                                <Form.Group controlId={`htmlId`}>
                                  <Form.Check type={"checkbox"} className={``}>
                                    <Form.Check.Input
                                      type={"checkbox"}
                                      value={feature.id}
                                      {...register("features")}
                                    />
                                    <Form.Check.Label className={``}>
                                      <span className={``}>{feature.name}</span>
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Form.Group>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                  </Row>

                  {/* {watchPurpose == "RENT" && <Row></Row>} */}

                  <Row className="mt-5">
                    <Col md="7">
                      <Row>
                        <Col className="mt-2 mb-2">
                          <h5 className="mb-3">Upload Property Image</h5>
                          <Card>
                            <Card.Body>
                              <Row>
                                <Col md="10">
                                  <Row>
                                    <Form.Group as={Col} controlId="ImageType">
                                      <Form.Label>Image Type</Form.Label>
                                      <Form.Select
                                        onChange={({ target }) =>
                                          setImageType(target.value)
                                        }
                                      >
                                        <option value={""}>
                                          Select image type
                                        </option>
                                        <option value={"header"}>Header</option>
                                        <option value={"feature"}>
                                          Feature
                                        </option>
                                      </Form.Select>
                                    </Form.Group>
                                    <Form.Group
                                      as={Col}
                                      controlId="formFileSm"
                                      className="mb-3"
                                    >
                                      <Form.Label>
                                        Upload Header Image
                                      </Form.Label>
                                      <Form.Control
                                        type="file"
                                        size="sm"
                                        name="propertyImage"
                                        onChange={handleFileUpload}
                                      />
                                    </Form.Group>
                                  </Row>
                                </Col>
                                <Col md="2" className="mt-4">
                                  {loading && <Loading />}
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="5">
                      <Row>
                        {existingImageFiles.length > 0 &&
                          existingImageFiles.map((image) => (
                            <Col md="4" key={image.id}>
                              <Card className="mt-5">
                                <Card.Body className="px-0 py-0">
                                  <Row className="mb-0 ft-12 px-3">
                                    <Col md="9" className="text-start ft-12">
                                      {image.type.toLowerCase()}
                                    </Col>
                                    <Col
                                      md="3"
                                      className="text-start bg-warning text-dark"
                                      style={{ cursor: "pointer" }}
                                      onClick={(e) => {
                                        handleFileDelete(e, image.id);
                                      }}
                                    >
                                      x
                                    </Col>
                                  </Row>
                                  {deleting === image.id ? (
                                    <Row className="py-1 mt-3">
                                      <Col
                                        md={{ span: 6, offset: 3 }}
                                        style={{ minHeight: "80px" }}
                                      >
                                        <Loading />
                                      </Col>
                                    </Row>
                                  ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={image.image_url}
                                      className={`w-100`}
                                      height={`100`}
                                      alt="Property image"
                                    />
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                      </Row>
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

export default PropertyEditForm;

/* <Row className="mb-3">
        <Col>
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <Form.Group controlId="dobId">
                <Form.Label className={`${profileStyles.FormLabel}`}>
                  <span>生年月日</span>
                  <span className="text-danger">*</span>
                </Form.Label>
                <ReactDatePicker
                  className="form-control"
                  placeholderText="1980/10/01"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  maxDate={addDays(new Date(), -365)}
                  dateFormat="yyyy/MM/dd"
                  closeOnScroll={true}
                />
              </Form.Group>
            )}
          />
        </Col>
      </Row> */

// https://stackblitz.com/edit/react-l3io1m?file=src%2FApp.js
