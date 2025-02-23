import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../career/Career.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { verifyUser } from "../../redux/slices/userApi";
import { verifySchema } from "../../helpers/validations/auth";
import ErrorInput from "../../components/common/errorInput";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(verifySchema),
  });

  const onSubmit = async (data) => {
    const user = getLocalStorage(STORAGE.USER_REGI_KEY);

    const result = await dispatch(
      verifyUser({ ...data, phoneNumber: user?.phoneNumber })
    ).unwrap();
    if (result?.status) {
      navigate("/login");
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
                    <h3>Verify OTP</h3>
                    <p>Please enter the OTP sent to your phone.</p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div
                      className={`mb-4 form-focus ${
                        watch("otp") ? "focused" : ""
                      }`}
                    >
                      <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            className="form-control floating"
                          />
                        )}
                      />
                      <label className="focus-label">Enter OTP</label>
                    </div>
                    <ErrorInput error={errors?.otp?.message} />

                    <div className="mb-3">
                      <Button className="btn w-100" type="submit">
                        Verify OTP
                      </Button>
                    </div>
                    <div className="account-signup">
                      <p>
                        Didn't receive the code?{" "}
                        <Link to="/resend-otp">Resend OTP</Link>
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

export default VerifyOtp;
