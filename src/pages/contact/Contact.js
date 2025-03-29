import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Mail, MapPin, PhoneCall, UserCheck } from "react-feather";
import {
  email_address,
  address,
  admin_info,
} from "../../components/static";
import {
  Container,
  Row,
  Col,
  Button,
  CardBody,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";
import { Input, Label, FormFeedback } from "reactstrap";
import "./Contact.css"; // Custom CSS
import { callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";

const Contact = () => {
  const user = getLocalStorage(STORAGE.USER_KEY);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      services: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too Short!").required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Must be digits")
        .min(10, "Invalid phone number")
        .required("Phone is required"),
      services: Yup.string().required("Service is required"),
      message: Yup.string()
        .min(10, "Message too short")
        .required("Message is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form Data:", values);
      try {
        setLoading(true);
        const response = await callPostApi(`/admin/contact`, {
          ...values,
          userId: user?._id,
        });
        if (response?.status) {
          setLoading(false);
          toastMessage("success", "Message Sent Successfully!");
          formik.resetForm();
        }
      } catch (error) {
        setLoading(false);
        console.error("Message Sent error:", error);
        toastMessage("error", "An unexpected error occurred.");
      }
    },
  });

  return (
    <>
      <Header />
      <Breadcrumb />

      <section className="contact-section py-5">
        <Container>
          <Row>
            {/* Contact Info */}
            <Col lg={5} md={12} className="mb-4">
              <div className="section-inner-header">
                <h6>Get in touch</h6>
                <h3>Have Any Questions?</h3>
              </div>

              <Card className="contact-card mb-4">
                <CardBody className="d-flex align-items-center">
                  <MapPin
                    className="contact-icon colorful-icon me-3"
                    size={32}
                  />
                  <div>
                    <h4>Address</h4>
                    <p>{address}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="contact-card mb-4">
                <CardBody className="d-flex align-items-center">
                  <UserCheck
                    className="contact-icon colorful-icon me-3"
                    size={32}
                  />
                  <div>
                    <h4>Admin Info</h4>
                    <p>{admin_info}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="contact-card">
                <CardBody className="d-flex align-items-center">
                  <Mail className="contact-icon colorful-icon me-3" size={32} />
                  <div>
                    <h4>Email Address</h4>
                    <p>{email_address}</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Contact Form */}
            <Col lg={7} md={12} className="d-flex">
              <Card className="contact-form-card w-100">
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Label className="mb-2">Name</Label>
                        <Input
                          type="text"
                          name="name"
                          className={`form-control ${
                            formik.touched.name && formik.errors.name
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Your Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <FormFeedback>{formik.errors.name}</FormFeedback>
                        )}
                      </Col>

                      <Col md={6} className="mb-3">
                        <Label className="mb-2">Email Address</Label>
                        <Input
                          type="email"
                          name="email"
                          className={`form-control ${
                            formik.touched.email && formik.errors.email
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Email Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <FormFeedback>{formik.errors.email}</FormFeedback>
                        )}
                      </Col>

                      <Col md={6} className="mb-3">
                        <Label className="mb-2">Phone Number</Label>
                        <Input
                          type="text"
                          name="phone"
                          className={`form-control ${
                            formik.touched.phone && formik.errors.phone
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Phone Number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phone}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <FormFeedback>{formik.errors.phone}</FormFeedback>
                        )}
                      </Col>

                      <Col md={6} className="mb-3">
                        <Label className="mb-2">Services</Label>
                        <Input
                          type="text"
                          name="services"
                          className={`form-control ${
                            formik.touched.services && formik.errors.services
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Services"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.services}
                        />
                        {formik.touched.services && formik.errors.services && (
                          <FormFeedback>{formik.errors.services}</FormFeedback>
                        )}
                      </Col>

                      <Col md={12} className="mb-3">
                        <Label className="mb-2">Message</Label>
                        <textarea
                          name="message"
                          className={`form-control ${
                            formik.touched.message && formik.errors.message
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter your comments"
                          rows="4"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.message}
                        />
                        {formik.touched.message && formik.errors.message && (
                          <FormFeedback>{formik.errors.message}</FormFeedback>
                        )}
                      </Col>

                      <Col md={12} className="text-center">
                        <Button
                          disabled={loading}
                          type="submit"
                          className="btn-medium"
                        >
                          Send Message {loading && <Spinner size="sm" />}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
