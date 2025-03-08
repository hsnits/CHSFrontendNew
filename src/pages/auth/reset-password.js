import "./Register.css";
import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import { Eye, EyeOff } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "../../redux/slices/userApi";
import { resetSchema } from "../../helpers/validations/auth";
import ErrorInput from "../../components/common/errorInput";
import { getLocalStorage, removeLocalStorage } from "../../helpers/storage";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [eyeOpen, setEyeOpen] = useState(false);
  const [eyeCnOpen, setEyeCnOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    let number = getLocalStorage("userNumber");
    let upData = {
      otp: data?.code,
      password: data?.password,
      phoneNumber: number,
    };
    const result = await dispatch(resetUserPassword(upData)).unwrap();
    if (result?.status) {
      navigate("/login");
      removeLocalStorage("userNumber");
      reset();
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
                    <h3>Reset Password</h3>
                    <p>Enter your OTP to reset your password.</p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      className={`mb-4 form-focus ${
                        watch("code") ? "focused" : ""
                      }`}
                    >
                      <Controller
                        name="code"
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
                        One Time Password <span className="text-danger">*</span>
                      </label>
                    </div>
                    <ErrorInput error={errors?.code?.message} />

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

                    <div
                      className={`mb-4 form-focus pass-group ${
                        watch("confirmPassword") ? "focused" : ""
                      }`}
                    >
                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type={!eyeCnOpen ? "password" : "text"}
                            className="form-control floating"
                          />
                        )}
                      />
                      <span className="eye-icon-span">
                        {eyeCnOpen ? (
                          <Eye onClick={() => setEyeCnOpen((pre) => !pre)} />
                        ) : (
                          <EyeOff onClick={() => setEyeCnOpen((pre) => !pre)} />
                        )}
                      </span>
                      <label className="focus-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                    </div>
                    <ErrorInput error={errors?.confirmPassword?.message} />

                    <div className="form-group-flex">
                      <label className="mb-3"></label>
                      <Link to="/forgot-password" className="forgot-link">
                        Re-send Otp?
                      </Link>
                    </div>

                    <div className="mb-3">
                      <Button className="btn w-100" type="submit">
                        Reset Password
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

export default ResetPassword;
