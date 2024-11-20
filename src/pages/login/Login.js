import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../career/Career.css";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import { Eye, EyeOff } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Contact = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
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
                    <h3>Sign in</h3>
                    <p>We'll send a confirmation code to your Phone.</p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label className="mb-2">Phone Number</label>
                      <Controller
                        name="phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            className="form-control form-control-lg group_formcontrol"
                            id="phone"
                            type="number"
                            {...field}
                          />
                        )}
                      />
                      <p style={{ color: "red" }}>{errors.phone?.message}</p>
                    </div>
                    <div className="mb-3">
                      <div className="form-group-flex">
                        <label className="mb-2">Password</label>
                        <Link to="#" className="forgot-link">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="pass-group">
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              type="password"
                              className="form-control pass-input"
                              placeholder="*************"
                              {...field}
                            />
                          )}
                        />
                        <p style={{ color: "red" }}>
                          {errors.password?.message}
                        </p>

                        <Eye
                          className="feather-eye-off toggle-password"
                          size={15}
                        />
                      </div>
                    </div>
                    <div className="mb-3 form-check-box">
                      <div className="form-group-flex">
                        <label className="custom_check d-inline-flex">
                          {" "}
                          Remember Me
                          <input type="checkbox" name="login" />
                          <span className="checkmark"></span>
                        </label>
                        <label className="custom_check d-inline-flex">
                          {" "}
                          Login with OTP
                          <input type="checkbox" name="login" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <Button className="btn w-100" type="submit">
                        Sign in
                      </Button>
                    </div>
                    <div className="account-signup">
                      <p>
                        Don't have an account ?{" "}
                        <Link to="/DoctorRegister">Sign up</Link>
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

export default Contact;
