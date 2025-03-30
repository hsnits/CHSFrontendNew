import React, { useRef } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import {
  Col,
  Container,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import career_img from "../../assets/img/career_with_us2.jpg";
import culture_img from "../../assets/img/culture.jpg";
import { Link } from "react-router-dom";
import "../career/Career.css";
import { BlogData } from "../../Data";
import { Calendar, MessageSquare, User } from "react-feather";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Spinner } from "react-bootstrap";
import { callPostApi } from "../../_service";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import { uploadFile } from "../../helpers/utils";

const Contact = () => {
  const user = getLocalStorage(STORAGE.USER_KEY);
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      experience: "",
      designation: "",
      message: "",
      resume: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").min(2, "Too short"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      experience: Yup.string().required("Experience is required"),
      designation: Yup.string().required("Designation is required"),
      message: Yup.string()
        .required("Message is required")
        .min(10, "Too short"),
      resume: Yup.mixed()
        .required("Resume is required")
        .test(
          "fileFormat",
          "Only PDF, DOC, or DOCX files are allowed.",
          (value) =>
            !value ||
            [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(value.type)
        ),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log("Form Data:", values);
      try {
        if (!values?.resume) {
          toastMessage("error", "CV/Resume is required");
          return;
        }
        let file = await uploadFile(values?.resume, "Resume is uploading...");
        const response = await callPostApi(`/admin/apply`, {
          ...values,
          resumeUrl: file?.location,
          resumeKey: file?.key,
          userId: user?._id || null,
        });
        if (response?.status) {
          toastMessage("success", "Team Form Applied successfully!");
          resetForm();
          setSubmitting(false);
        }
      } catch (error) {
        console.error("Message Sent error:", error);
        setSubmitting(false);
        toastMessage("error", "An unexpected error occurred.");
      }
    },
  });

  return (
    <>
      <Header />
      <Breadcrumb />
      <section className="contact-section">
        <Container>
          <Row>
            <Col lg="7">
              <div className="about-box">
                <h2>Join Caresmart Health Solution</h2>
                <p className="mt-4 text-justify">
                  At Caresmart Health Solution, we believe that world-class
                  healthcare should be accessible to everyone, not just the
                  affluent. Our mission is to deliver affordable, Tier-1
                  healthcare standards to the middle class and financially
                  challenged communities.
                </p>
                <p>
                  We are committed to clinical excellence with social relevance,
                  fostering a culture that inspires our talented doctors,
                  nurses, and support staff to perform groundbreaking work every
                  day. If you're passionate about making a difference and want
                  to be part of a team that prioritizes both exceptional care
                  and community impact, we invite you to explore career
                  opportunities with us.
                </p>
                <div class="view-all-more">
                  <Link className="btn btn-primary" onClick={scrollToSection}>
                    🚀 Join Us
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg="5">
              <img
                src={career_img}
                className="img-fluid"
                alt="career-with-us"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section class="choose-us-section-thirteen common-padding">
        <Container>
          <Row>
            <div class="col-lg-12 aos" data-aos="fade-up">
              <div class="section-header-thirteen">
                <h2>Our Culture at Caresmart Health Solution</h2>
              </div>
            </div>
          </Row>
          <Row>
            <Col lg="6">
              <div class="choose-us-inner-all aos" data-aos="fade-up">
                <div class="choose-us-thirteen-img">
                  <img src={culture_img} alt="Doctor" class="img-fluid" />
                </div>
              </div>
            </Col>
            <Col lg="6">
              <ul>
                <li class="aos" data-aos="fade-up">
                  <div class="choose-us-content-thirteen">
                    <div class="chooseus-contents">
                      <MessageSquare />
                    </div>
                    <div class="chooseus-content-ryt">
                      <h5> Patient-Centric Approach</h5>
                      <p>
                        We prioritize our patients in everything we do. Every
                        decision, every initiative, and every interaction is
                        guided by our commitment to providing exceptional care
                        and improving health outcomes.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="aos" data-aos="fade-up">
                  <div class="choose-us-content-thirteen">
                    <div class="chooseus-contents">
                      <MessageSquare />
                    </div>
                    <div class="chooseus-content-ryt">
                      <h5>Inclusivity and Diversity</h5>
                      <p>
                        We celebrate diversity and foster an inclusive
                        environment where every voice is heard and valued. Our
                        team reflects a range of backgrounds and experiences,
                        enhancing our ability to serve our diverse community.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="aos" data-aos="fade-up">
                  <div class="choose-us-content-thirteen">
                    <div class="chooseus-contents">
                      <MessageSquare />
                    </div>
                    <div class="chooseus-content-ryt">
                      <h5>Continuous Learning and Growth</h5>
                      <p>
                        We are dedicated to the professional development of our
                        staff. We offer ongoing training, mentorship programs,
                        and opportunities for advancement, ensuring our team
                        remains at the forefront of medical excellence.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="aos" data-aos="fade-up">
                  <div class="choose-us-content-thirteen">
                    <div class="chooseus-contents">
                      <MessageSquare />
                    </div>
                    <div class="chooseus-content-ryt">
                      <h5>Community Impact</h5>
                      <p>
                        We are committed to making a positive difference in our
                        community. Our initiatives focus on accessibility,
                        education, and health promotion, ensuring that quality
                        healthcare is available to all.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="aos" data-aos="fade-up">
                  <div class="choose-us-content-thirteen">
                    <div class="chooseus-contents">
                      <MessageSquare />
                    </div>
                    <div class="chooseus-content-ryt">
                      <h5>Collaboration and Teamwork</h5>
                      <p>
                        We believe that teamwork is key to success. Our
                        interdisciplinary teams work closely together, sharing
                        knowledge and expertise to provide the best possible
                        care for our patients.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="aos" data-aos="fade-up">
                  <div class="choose-us-content-thirteen">
                    <div class="chooseus-contents">
                      <MessageSquare />
                    </div>
                    <div class="chooseus-content-ryt">
                      <h5>Work-Life Balance</h5>
                      <p>
                        We understand the importance of maintaining a healthy
                        work-life balance. We support our staff in achieving
                        their personal and professional goals, fostering a
                        culture of well-being.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <div ref={sectionRef}>
        <section className="form-section">
          <Card className="policy-card">
            <Card.Body>
              <Container>
                <Row>
                  <Col lg="12" className="text-center mb-4">
                    <h2 className="text-primary fw-bold">Join Our Team</h2>
                    <p className="text-muted">
                      Fill out the form below to apply
                    </p>
                  </Col>

                  <form onSubmit={formik.handleSubmit} className="custom-form">
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Name</Label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            invalid={
                              formik.touched.name && !!formik.errors.name
                            }
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <FormFeedback>{formik.errors.name}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup>
                          <Label>Phone Number</Label>
                          <Input
                            type="text"
                            name="phone"
                            placeholder="Enter your phone"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            invalid={
                              formik.touched.phone && !!formik.errors.phone
                            }
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <FormFeedback>{formik.errors.phone}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup>
                          <Label>Email Address</Label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            invalid={
                              formik.touched.email && !!formik.errors.email
                            }
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <FormFeedback>{formik.errors.email}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Experience</Label>
                          <Input
                            type="select"
                            name="experience"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.experience}
                            invalid={
                              formik.touched.experience &&
                              !!formik.errors.experience
                            }
                          >
                            <option value="">Select Experience</option>
                            <option value="1">1 Year</option>
                            <option value="2">2 Years</option>
                            <option value="3">3 Years</option>
                            <option value="4">4 Years</option>
                            <option value="5">5+ Years</option>
                          </Input>
                          {formik.touched.experience &&
                          formik.errors.experience ? (
                            <FormFeedback>
                              {formik.errors.experience}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup>
                          <Label>Designation</Label>
                          <Input
                            type="text"
                            name="designation"
                            placeholder="Enter your designation"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.designation}
                            invalid={
                              formik.touched.designation &&
                              !!formik.errors.designation
                            }
                          />
                          {formik.touched.designation &&
                          formik.errors.designation ? (
                            <FormFeedback>
                              {formik.errors.designation}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup>
                          <Label>CV/Resume</Label>
                          <Input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={(event) => {
                              const file = event.target.files[0];

                              // ✅ File validation: Only PDF, DOC, DOCX
                              if (
                                file &&
                                ![
                                  "application/pdf",
                                  "application/msword",
                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                ].includes(file.type)
                              ) {
                                toastMessage(
                                  "error",
                                  "Only PDF, DOC, or DOCX files are allowed."
                                );
                                formik.setFieldValue("resume", "");
                                event.target.value = ""; // Clear invalid file
                                return;
                              }
                              formik.setFieldValue("resume", file);
                              // event.target.value = "";
                            }}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.resume && !!formik.errors.resume
                            }
                          />

                          {/* ✅ Error Message */}
                          {formik.touched.resume && formik.errors.resume && (
                            <FormFeedback>{formik.errors.resume}</FormFeedback>
                          )}

                          {/* ✅ Display Uploaded File Name */}
                          {formik.values.resume && (
                            <p className="text-success mt-1">
                              Uploaded: {formik.values.resume.name}
                            </p>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Write A Message</Label>
                          <Input
                            type="textarea"
                            name="message"
                            placeholder="Enter your message"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                            invalid={
                              formik.touched.message && !!formik.errors.message
                            }
                          />
                          {formik.touched.message && formik.errors.message ? (
                            <FormFeedback>{formik.errors.message}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="text-center">
                      <Button
                        type="submit"
                        color="primary"
                        size="lg"
                        className="submit-btn"
                        disabled={formik.isSubmitting}
                      >
                        Apply Now {formik.isSubmitting && <Spinner size="sm" />}
                      </Button>
                    </div>
                  </form>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </section>
      </div>
      <section class="articles-section">
        <div class="container">
          <div class="row">
            <div class="col-md-12 aos" data-aos="fade-up">
              <div class="section-header-one text-center">
                <h2 class="section-title">CHS Highlights & Updates</h2>
              </div>
            </div>
          </div>
          <div class="row">
            {BlogData.map((item, key) => (
              <div
                class="col-lg-6 col-md-6 d-flex aos"
                data-aos="fade-up"
                key={item.id}
              >
                <div class="articles-grid w-100">
                  <div class="articles-info">
                    <div class="articles-left">
                      <a href="#">
                        <div class="articles-img">
                          <img
                            src={item.blog_img}
                            class="img-fluid"
                            alt="John Doe"
                          />
                        </div>
                      </a>
                    </div>
                    <div class="articles-right">
                      <div class="articles-content">
                        <ul class="articles-list nav">
                          <li>
                            <User size={15} /> &nbsp; {item.user_name}
                          </li>
                          <li>
                            <Calendar size={15} /> &nbsp; {item.date}
                          </li>
                        </ul>
                        <h4>
                          <a href="#">{item.blog_heading}</a>
                        </h4>
                        <p>{item.blog_desc}</p>
                        <a href="#" class="btn">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
