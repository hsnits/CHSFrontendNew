import React from "react";
import "../register/Register.css";
import login_img from "../../assets/img/login_img.png";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Input } from "reactstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../register/Register.css";

export default function DoctorRegister() {
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

                    <Form>
                      <div className="mb-3 form-focus">
                        <Input type="text" className="form-control floating" />
                        <label className="focus-label">Name</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <Input type="text" className="form-control floating" />
                        <label className="focus-label">Mobile Number</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <Input
                          type="password"
                          className="form-control floating"
                        />
                        <label className="focus-label">Email Address</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <Input
                          type="password"
                          className="form-control floating"
                        />
                        <label className="focus-label">Create Password</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <Input
                          rows={4}
                          type="textarea"
                          className="form-control floating"
                          style={{ Overflow: "hidden" }}
                        />
                        <label className="focus-label">Address</label>
                      </div>
                      <div className="mb-3 form-focus">
                        <label for="exampleSelect" className="focus-label">
                          Choose Role
                        </label>
                        <Input
                          id="exampleSelect"
                          className="form-control floating"
                          name="select"
                          type="select"
                        >
                          <option>Patient</option>
                          <option>Doctor</option>
                          <option>Pharmacy Retailers</option>
                          <option>Pathology</option>
                          <option>Diagnosis</option>
                          <option>Ambulance</option>
                          <option>Nursing</option>
                          <option>Biomedical</option>
                          <option>Hospital</option>
                        </Input>
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
