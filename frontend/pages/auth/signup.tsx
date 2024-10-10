import BaseContainer from "@/components/common/container/BaseContainer";
import React, { useState } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Role, SignUpFormFields, signUpSchema } from "@/components/auth/helpers";
import { getErrorMessage } from "@/data/utils/lib";
import { signUp } from "@/data/api/auth";
import { AxiosError } from "axios";
import SubmitButton from "@/components/common/form/SubmitButton";

const SignUp = () => {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Hook form with yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormFields>({
    resolver: yupResolver(signUpSchema),
    mode: "onTouched",
  });

  // Error message function
  const errorMessage = getErrorMessage(errors);

  // OnSubmit function handling form submission
  const onSubmit = async (data: SignUpFormFields) => {
    // Generate a temporary email from the username
    const tempEmail = `${data.username}@tempmail.com`; // Adjust domain if needed

    const signUpPayload = {
      ...data,
      email: tempEmail, // Set the hidden email from username
    };

    try {
      setSubmitLoading(true);
      const createUser = await signUp(signUpPayload); // Call API

      if (createUser.data) {
        router.push("/auth/signin"); // Redirect after successful signup
      } else {
        setSubmitLoading(false);
        alert("Username or password error");
      }
    } catch (error: any) {
      setSubmitLoading(false);

      if (error instanceof AxiosError) {
        const message = error.response?.data?.message as string;
        const findDuplicateError = message.search("usersUniqueName");

        if (findDuplicateError) {
          alert("Username already exists!");
        } else {
          alert(message);
        }
      }
    }
  };

  return (
    <BaseContainer>
      <Row className="py-3">
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Row className="py-2">
                <Col md="12">
                  <h3 className="text-center ft-24 fw-bold">Create account</h3>
                </Col>
              </Row>

              {/* Form submission */}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" {...register("firstName")} />
                    {errorMessage("firstName") && (
                      <Form.Text className="text-danger">
                        {errorMessage("firstName")}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" {...register("lastName")} />
                    {errorMessage("lastName") && (
                      <Form.Text className="text-danger">
                        {errorMessage("lastName")}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" {...register("username")} />
                    {errorMessage("username") && (
                      <Form.Text className="text-danger">
                        {errorMessage("username")}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" {...register("phone")} />
                    {errorMessage("phone") && (
                      <Form.Text className="text-danger">
                        {errorMessage("phone")}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="ImageType">
                    <Form.Label>Sign Up As</Form.Label>
                    <Form.Select {...register("role")}>
                    <option value={Role.USER}>User</option>
                      <option value={Role.AGENT}>Agent</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" {...register("password")} />
                    {errorMessage("password") && (
                      <Form.Text className="text-danger">
                        {errorMessage("password")}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                {/* Submit Button */}
                <Row className="py-3">
                  <Col md="12" className="mt-2">
                    <SubmitButton
                      title="Submit"
                      isLoading={submitLoading}
                      buttonCls="w-100"
                      variant="warning"
                    />
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </BaseContainer>
  );
};

export default SignUp;
