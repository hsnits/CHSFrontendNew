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
import { loginUser } from "../../redux/slices/userApi";
import { ROLES } from "../../constants";
import { loginSchema } from "../../helpers/validations/auth";
import ErrorInput from "../../components/common/errorInput";

const Contact = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eyeOpen, setEyeOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data)).unwrap();
    debugger;
    if (result?.status) {
      if (result?.data?.role === ROLES.PATIENT) {
        navigate("/patient");
      } else if (result?.data?.role === ROLES.DOCTOR) {
        navigate("/DoctorDashboard");
      } else if (result?.data?.role === ROLES.PATHOLOGY) {
        navigate("/PathologyDashboard");
      } 
      else if (result?.data?.role === ROLES.NURSING) {
        navigate("/NurseDashboard");
      } 
      else if (result?.data?.role === ROLES.AMBULANCE) {
        navigate("/AmbulanceDashboard");
      } 
      else if (result?.data?.role === ROLES.BIOCHEMICAL) {
        navigate("/BiomedicalDashboard");
      } 
      else if (result?.data?.role === ROLES.HOSPITAL) {
        navigate("/HospitalDashboard");
      } 
      else {
        navigate("/pharmacy");
      }
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
                    <h3>Sign in</h3>
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
                      <label className="focus-label">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                    </div>
                    <ErrorInput error={errors?.phoneNumber?.message} />

                    <div
                      className={`mb-4 form-focus pass-group ${
                        watch("password") ? "focused" : ""
                      }`}
                    >
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type={!eyeOpen ? "password" : "text"}
                            className="form-control floating"
                          />
                        )}
                      />
                      <span className="eye-icon-span">
                        {eyeOpen ? (
                          <Eye onClick={() => setEyeOpen((pre) => !pre)} />
                        ) : (
                          <EyeOff onClick={() => setEyeOpen((pre) => !pre)} />
                        )}
                      </span>
                      <label className="focus-label">
                        Password <span className="text-danger">*</span>
                      </label>
                    </div>
                    <ErrorInput error={errors?.password?.message} />

                    <div className="form-group-flex">
                      <label className="mb-3"></label>
                      <Link to="/forgot-password" className="forgot-link">
                        Forgot password?
                      </Link>
                    </div>

                    <div className="mb-3">
                      <Button className="btn w-100" type="submit">
                        Sign in
                      </Button>
                    </div>
                    <div className="account-signup">
                      <p>
                        Don't have an account ?{" "}
                        <Link to="/register">Sign up</Link>
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
