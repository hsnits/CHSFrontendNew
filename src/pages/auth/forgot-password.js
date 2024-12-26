import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../career/Career.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import { Eye, EyeOff } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { forgotUserPassword } from "../../redux/slices/userApi";
import { ROLES } from "../../constants";
import { forgotSchema } from "../../helpers/validations/auth";
import ErrorInput from "../../components/common/errorInput";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(forgotUserPassword(data)).unwrap();
    if (result?.status) {
      navigate("/reset-password");
    }
  };

  return (
    <>
      <Header />
      <div className="login-content-info">
        <Container>
          <Row className="justify-content-center">
            <Col lg={4} md={6}>
              <div className="account-content">
                <div className="account-info">
                  <div className="login-title">
                    <h3>Forgot Password</h3>
                    <p>We'll send a confirmation code to your Phone.</p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      className={`mb-4 form-focus ${
                        watch("phoneNumber") ? "focused" : ""
                      }`}
                    >
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            className="form-control floating"
                          />
                        )}
                      />
                      <label className="focus-label">Phone Number</label>
                    </div>
                    <ErrorInput error={errors?.phoneNumber?.message} />

                    <div className="mb-3">
                      <Button className="btn w-100" type="submit">
                        Send Code
                      </Button>
                    </div>
                    <div className="account-signup">
                      <p>
                        Go to <Link to="/login">login</Link>
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
