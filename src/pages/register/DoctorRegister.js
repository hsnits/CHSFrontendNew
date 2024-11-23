import React from "react";
import "../register/Register.css";
import login_img from "../../assets/img/login_img.png";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../register/Register.css";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/api";

const roles = [
  "Patient",
  "Doctor",
  "Pharmacy Retailers",
  "Pathology",
  "Diagnosis",
  "Ambulance",
  "Nursing",
  "Biomedical",
  "Hospital",
];

const registrationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  phoneNumber: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^[0-9]+$/, "Mobile Number must only contain digits")
    .min(10, "Mobile Number must be exactly 10 digits")
    .max(15, "Mobile Number must not exceed 15 digits"),
  email: yup
    .string()
    .required("Email Address is required")
    .email("Email Address must be valid"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must not exceed 100 characters"),
  role: yup
    .string()
    .required("Role is required")
    .oneOf(
      [
        "Patient",
        "Doctor",
        "Pharmacy Retailers",
        "Pathology",
        "Diagnosis",
        "Ambulance",
        "Nursing",
        "Biomedical",
        "Hospital",
      ],
      "Invalid role selected"
    ),
});

export default function DoctorRegister() {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      role: data.role.toLowerCase(),
    };
    const result = await dispatch(registerUser(formattedData)).unwrap();
    console.log(result, "===");
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
                      <div className="mb-3 form-focus">
                        <label className="focus-label">Name</label>
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
                        <p
                          style={{
                            color: "red",
                            fontSize: "12px",
                          }}
                        >
                          {errors.name?.message}
                        </p>
                      </div>
                      <div className="mb-3 form-focus">
                        <label className="focus-label">Mobile Number</label>
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
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {errors.phoneNumber?.message}
                        </p>
                      </div>
                      <div className="mb-3 form-focus">
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
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {errors.email?.message}
                        </p>
                        <label className="focus-label">Email Address</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="password"
                              className="form-control floating"
                            />
                          )}
                        />
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {errors.password?.message}
                        </p>
                        <label className="focus-label">Create Password</label>
                      </div>
                      <div className="mb-3 form-focus">
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
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {errors.address?.message}
                        </p>
                        <label className="focus-label">Address</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <label for="exampleSelect" className="focus-label">
                          Choose Role
                        </label>
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <select
                              id="exampleSelect"
                              className="form-control floating"
                              {...field}
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {errors.role?.message}
                        </p>
                      </div>
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
