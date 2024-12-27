import React, { useState } from "react";
import login_img from "../../assets/img/login_img.png";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Register.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/userApi";
import { userRoles } from "../../constants/auth";
import { registrationSchema } from "../../helpers/validations/auth";
import ErrorInput from "../../components/common/errorInput";
import { Eye, EyeOff } from "react-feather";

export default function DoctorRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [eyeOpen, setEyeOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      role: data.role.toLowerCase(),
    };
    const result = dispatch(registerUser(formattedData));
    if (result?.payload?.status) {
      navigate("/login");
    }
  };

  return (
    <>
      <Header />
      <div className="content top-space">
        <Container fluid>
          <Row>
            <Col md={8} className="offset-md-2">
              <div className="account-content">
                <Row className="align-items-center justify-content-center">
                  <Col md={7} lg={6} className="login-left">
                    <img
                      src={login_img}
                      className="img-fluid border-20"
                      alt="Login"
                    />
                  </Col>
                  <Col md={12} lg={6} className="login-right">
                    <div className="login-header">
                      <h2>Register Now</h2>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <div
                        className={`mb-3 form-focus ${
                          watch("name") ? "focused" : ""
                        }`}
                      >
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              className="form-control floating"
                            />
                          )}
                        />
                        <label className="focus-label">Name</label>
                      </div>
                      <ErrorInput error={errors?.name?.message} />

                      <div
                        className={`mb-3 form-focus ${
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
                        <label className="focus-label">Mobile Number</label>
                      </div>
                      <ErrorInput error={errors?.phoneNumber?.message} />

                      <div
                        className={`mb-3 form-focus ${
                          watch("email") ? "focused" : ""
                        }`}
                      >
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="form-control floating"
                            />
                          )}
                        />
                        <label className="focus-label">Email Address</label>
                      </div>
                      <ErrorInput error={errors?.email?.message} />

                      <div
                        className={`mb-3 form-focus ${
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
                        <label className="focus-label">Password</label>
                      </div>
                      <ErrorInput error={errors?.password?.message} />

                      <div
                        className={`mb-3 form-focus ${
                          watch("address") ? "focused" : ""
                        }`}
                      >
                        <Controller
                          name="address"
                          control={control}
                          render={({ field }) => (
                            <Input
                              rows={4}
                              type="textarea"
                              className="form-control floating"
                              style={{ Overflow: "hidden" }}
                              {...field}
                            />
                          )}
                        />
                        <label className="focus-label">Address</label>
                      </div>
                      <ErrorInput error={errors?.address?.message} />

                      <div className={`mb-3 form-focus focused`}>
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <select
                              id="exampleSelect"
                              className="form-control floating"
                              {...field}
                            >
                              {userRoles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        <label for="exampleSelect" className="focus-label">
                          Choose Role
                        </label>
                      </div>
                      <ErrorInput error={errors?.role?.message} />

                      <div className="text-end">
                        <Link className="forgot-link" to="/Login">
                          Already have an account?
                        </Link>
                      </div>
                      <Button
                        className="btn btn-primary w-100 btn-lg login-btn"
                        type="submit"
                      >
                        Signup
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
}
