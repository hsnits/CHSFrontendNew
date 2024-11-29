import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../patient/Patient.css";
import user_img from "../../assets/img/profile-06.jpg";
import Footer from "../../components/Footer";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useDispatch, useSelector } from "react-redux";
import { changeProfilePic, userProfile } from "../../redux/slices/userApi";
import { updatePatientProfile } from "../../redux/slices/patientApi";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PatSymptoms from "../../components/patient/symptoms";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  birthDate: yup.date().required("Date of Birth is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  bloodGroup: yup.string().required("Blood Group is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  pinCode: yup.string().required("Pincode is required"),
});

function PatientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(
    (state) => state.USER?.data?.user?.userProfileResult
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data?.profile || {},
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderButton = () => {
    switch (activeTab) {
      case "appointments":
        return (
          <button
            onClick={() => navigate("/doctorlist")}
            className="btn btn-primary"
          >
            Book Appointment
          </button>
        );
      case "medicalRecords":
        return (
          <button
            onClick={() => console.log("Medical")}
            className="btn btn-secondary"
          >
            Add Medical Record
          </button>
        );
      case "prescriptions":
        return (
          <button
            onClick={() => console.log("Prescription")}
            className="btn btn-success"
          >
            Request Prescription
          </button>
        );
      default:
        return null;
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG/PNG).");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds the 2MB limit.");
        return;
      }

      setSelectedFile(file);
    }

    try {
      const formData = new FormData();
      formData.append("profilepic", file);
      const result = dispatch(changeProfilePic(formData));
      console.log("Uploaded successfully:", result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    dispatch(userProfile());
  }, []);

  useEffect(() => {
    if (data?.profile) {
      reset(data?.profile);
    }
  }, [data, reset]);

  const onSubmit = async (value) => {
    const formattedData = {
      ...value,
      id: data._id,
      birthDate: value.birthDate
        ? new Date(value.birthDate).toISOString().split("T")[0]
        : null,
    };
    await dispatch(updatePatientProfile(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") dispatch(userProfile());
    });
  };

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col xl="3" lg="4" className="theiaStickySidebar">
                <div className="profile-sidebar patient-sidebar profile-sidebar-new">
                  <div className="widget-profile pro-widget-content">
                    <div className="profile-info-widget">
                      <Link to="#" className="booking-doc-img">
                        <img
                          src={data?.coverImage ?? user_img}
                          alt="User Image"
                        />
                      </Link>
                      <div className="profile-det-info">
                        <h3>
                          <Link href="#">{data?.profile?.firstName}</Link>
                        </h3>
                        <div className="patient-details">
                          <h5 className="mb-0">Patient ID : {data?._id}</h5>
                        </div>
                        <span>
                          {data?.profile?.gender}{" "}
                          <i className="fa-solid fa-circle"></i> 32 years 03
                          Months
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-widget">
                    <Nav variant="pills" className="flex-column dashboard-menu">
                      <Nav.Item>
                        <Nav.Link eventKey="first">
                          {" "}
                          <i className="fa-solid fa-shapes"></i> Dashboard
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">
                          {" "}
                          <i className="fa-solid fa-calendar-days"></i> My
                          Appointments
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="six">
                          {" "}
                          <i className="fa-solid fa-calendar-days"></i> Symptoms
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="third">
                          {" "}
                          <i className="fa-solid fa-shield-halved"></i> Health
                          Report
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fourth">
                          {" "}
                          <i className="fa-solid fa-user-pen"></i> Profile
                          Settings
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fifth">
                          {" "}
                          <i className="fa-solid fa-calendar-check"></i> Logout
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
              </Col>

              <Col lg="8" xl="9">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="dashboard-header">
                      <h3>Dashboard</h3>
                    </div>

                    <Col lg="12" xl="12" className="d-flex">
                      <div className="dashboard-card w-100">
                        <div className="dashboard-card-head">
                          <div className="header-title">
                            <h5>Reports</h5>
                          </div>
                          <a href="javascript:void(0);">
                            <img
                              src={data?.coverImage ?? user_img}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            &nbsp; &nbsp;{data?.profile?.firstName}
                          </a>
                        </div>
                        <div className="dashboard-card-body">
                          <div className="account-detail-table">
                            <nav className="patient-dash-tab border-0 pb-0 mb-3 mt-3">
                              <ul
                                className="nav nav-tabs-bottom"
                                role="tablist"
                              >
                                <li className="nav-item" role="presentation">
                                  <a
                                    className={`nav-link ${
                                      activeTab === "appointments"
                                        ? "active"
                                        : ""
                                    }`}
                                    href="#appoint-tab"
                                    data-bs-toggle="tab"
                                    aria-selected={activeTab === "appointments"}
                                    role="tab"
                                    onClick={() =>
                                      handleTabClick("appointments")
                                    }
                                  >
                                    Appointments
                                  </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                  <a
                                    className={`nav-link ${
                                      activeTab === "medicalRecords"
                                        ? "active"
                                        : ""
                                    }`}
                                    href="#medical-tab"
                                    data-bs-toggle="tab"
                                    aria-selected={
                                      activeTab === "medicalRecords"
                                    }
                                    role="tab"
                                    onClick={() =>
                                      handleTabClick("medicalRecords")
                                    }
                                  >
                                    Medical Records
                                  </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                  <a
                                    className={`nav-link ${
                                      activeTab === "prescriptions"
                                        ? "active"
                                        : ""
                                    }`}
                                    href="#prsc-tab"
                                    data-bs-toggle="tab"
                                    aria-selected={
                                      activeTab === "prescriptions"
                                    }
                                    role="tab"
                                    onClick={() =>
                                      handleTabClick("prescriptions")
                                    }
                                  >
                                    Prescriptions
                                  </a>
                                </li>
                                <div className="d-flex justify-content-end">
                                  {renderButton()}
                                </div>
                              </ul>
                            </nav>
                            <div className="tab-content pt-0">
                              <div
                                id="appoint-tab"
                                className="tab-pane fade"
                                role="tabpanel"
                              >
                                <div className="custom-new-table">
                                  <div className="table-responsive">
                                    <table className="table table-hover table-center mb-0">
                                      <thead>
                                        <tr>
                                          <th>ID</th>
                                          <th>Test Name</th>
                                          <th>Date</th>
                                          <th>Referred By</th>
                                          <th>Amount</th>
                                          <th>Comments</th>
                                          <th>Status</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <a href="javascript:void(0);">
                                              <span className="text-blue">
                                                RE124343
                                              </span>
                                            </a>
                                          </td>
                                          <td>Electro cardiography</td>
                                          <td>21 Mar 2024</td>
                                          <td>Edalin Hendry</td>
                                          <td>$300</td>
                                          <td>Good take rest</td>
                                          <td>
                                            <span className="badge badge-success-bg">
                                              Normal
                                            </span>
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <a
                                                href="#"
                                                className="account-action me-2"
                                              >
                                                <i className="fa-solid fa-prescription"></i>
                                              </a>
                                              <a
                                                href="#"
                                                className="account-action"
                                              >
                                                <i className="fa-solid fa-file-invoice-dollar"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="javascript:void(0);">
                                              <span className="text-blue">
                                                RE124342
                                              </span>
                                            </a>
                                          </td>
                                          <td>Complete Blood Count</td>
                                          <td>28 Mar 2024</td>
                                          <td>Shanta Nesmith</td>
                                          <td>$400</td>
                                          <td>Stable, no change</td>
                                          <td>
                                            <span className="badge badge-success-bg">
                                              Normal
                                            </span>
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <a
                                                href="#"
                                                className="account-action me-2"
                                              >
                                                <i className="fa-solid fa-prescription"></i>
                                              </a>
                                              <a
                                                href="#"
                                                className="account-action"
                                              >
                                                <i className="fa-solid fa-file-invoice-dollar"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="javascript:void(0);">
                                              <span className="text-blue">
                                                RE124341
                                              </span>
                                            </a>
                                          </td>
                                          <td>Blood Glucose Test</td>
                                          <td>02 Apr 2024</td>
                                          <td>John Ewel</td>
                                          <td>$350</td>
                                          <td>All Clear</td>
                                          <td>
                                            <span className="badge badge-success-bg">
                                              Normal
                                            </span>
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <a
                                                href="#"
                                                className="account-action me-2"
                                              >
                                                <i className="fa-solid fa-prescription"></i>
                                              </a>
                                              <a
                                                href="#"
                                                className="account-action"
                                              >
                                                <i className="fa-solid fa-file-invoice-dollar"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="tab-pane fade"
                                id="medical-tab"
                                role="tabpanel"
                              >
                                <div className="custom-table">
                                  <div className="table-responsive">
                                    <table className="table table-center mb-0">
                                      <thead>
                                        <tr>
                                          <th>ID</th>
                                          <th>Name</th>
                                          <th>Date</th>
                                          <th>Description</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="text-blue-600">
                                            <a href="javascript:void(0);">
                                              #MR-123
                                            </a>
                                          </td>
                                          <td>
                                            <a
                                              href="javascript:void(0);"
                                              className="lab-icon"
                                            >
                                              <span>
                                                <i className="fa-solid fa-paperclip"></i>
                                              </span>
                                              Lab Report
                                            </a>
                                          </td>
                                          <td>24 Mar 2024</td>
                                          <td>Glucose Test V12</td>
                                          <td>
                                            <div className="action-item">
                                              <a href="javascript:void(0);">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                              </a>
                                              <a href="javascript:void(0);">
                                                <i className="fa-solid fa-download"></i>
                                              </a>
                                              <a href="javascript:void(0);">
                                                <i className="fa-solid fa-trash-can"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="tab-pane fade active show"
                                id="prsc-tab"
                                role="tabpanel"
                              >
                                <div className="custom-table">
                                  <div className="table-responsive">
                                    <table className="table table-center mb-0">
                                      <thead>
                                        <tr>
                                          <th>ID</th>
                                          <th>Name</th>
                                          <th>Created Date</th>
                                          <th>Prescriped By</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="text-blue-600">
                                            <a
                                              href="#"
                                              data-bs-toggle="modal"
                                              data-bs-target="#view_prescription"
                                            >
                                              #PR-123
                                            </a>
                                          </td>
                                          <td>
                                            <a
                                              href="javascript:void(0);"
                                              className="lab-icon prescription"
                                            >
                                              <span>
                                                <i className="fa-solid fa-prescription"></i>
                                              </span>
                                              Prescription
                                            </a>
                                          </td>
                                          <td>24 Mar 2024, 10:30 AM</td>
                                          <td>
                                            <h2 className="table-avatar">
                                              <a
                                                href="#"
                                                className="avatar avatar-sm me-2"
                                              >
                                                <img
                                                  className="avatar-img rounded-3"
                                                  src={user_img}
                                                  alt="User Image"
                                                />
                                              </a>
                                              <a href="#">Edalin Hendry</a>
                                            </h2>
                                          </td>
                                          <td>
                                            <div className="action-item">
                                              <a href="javascript:void(0);">
                                                <i className="fa-solid fa-download"></i>
                                              </a>
                                              <a href="javascript:void(0);">
                                                <i className="fa-solid fa-trash-can"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Tab.Pane>

                  <Tab.Pane eventKey="second">
                    <div className="dashboard-header">
                      <h3>Appointments</h3>
                    </div>
                    <div className="appointment-tab-head">
                      <div className="appointment-tabs">
                        <ul
                          className="nav nav-pills inner-tab "
                          id="pills-tab"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link active"
                              id="pills-upcoming-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-upcoming"
                              type="button"
                              role="tab"
                              aria-controls="pills-upcoming"
                              aria-selected="true"
                            >
                              Upcoming<span>21</span>
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              id="pills-cancel-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-cancel"
                              type="button"
                              role="tab"
                              aria-controls="pills-cancel"
                              aria-selected="false"
                              tabindex="-1"
                            >
                              Cancelled<span>16</span>
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              id="pills-complete-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-complete"
                              type="button"
                              role="tab"
                              aria-controls="pills-complete"
                              aria-selected="false"
                              tabindex="-1"
                            >
                              Completed<span>214</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="tab-content appointment-tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-upcoming"
                        role="tabpanel"
                        aria-labelledby="pills-upcoming-tab"
                      >
                        <div className="appointment-wrap">
                          <ul>
                            <li>
                              <div className="patinet-information">
                                <a href="#">
                                  <img src={user_img} alt="User Image" />
                                </a>
                                <div className="patient-info">
                                  <p>#Apt0001</p>
                                  <h6>
                                    <a href="#">Dr Edalin</a>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li className="appointment-info">
                              <p>
                                <i className="fa-solid fa-clock"></i>11 Nov 2024
                                10.45 AM
                              </p>
                              <ul className="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                              </ul>
                            </li>
                            <li className="mail-info-patient">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-envelope"></i>
                                  edalin@example.com
                                </li>
                                <li>
                                  <i className="fa-solid fa-phone"></i>+1 504
                                  368 6874
                                </li>
                              </ul>
                            </li>
                            <li className="appointment-action">
                              <ul>
                                <li>
                                  <a href="#">
                                    <i className="fa-solid fa-eye"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i className="fa-solid fa-comments"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i className="fa-solid fa-xmark"></i>
                                  </a>
                                </li>
                              </ul>
                            </li>
                            <li className="appointment-detail-btn">
                              <a href="#" className="start-link">
                                <i className="fa-solid fa-calendar-check me-1"></i>
                                Attend
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="pills-cancel"
                        role="tabpanel"
                        aria-labelledby="pills-cancel-tab"
                      >
                        <div className="appointment-wrap">
                          <ul>
                            <li>
                              <div className="patinet-information">
                                <a href="#">
                                  <img src={user_img} alt="User Image" />
                                </a>
                                <div className="patient-info">
                                  <p>#Apt00011</p>
                                  <h6>
                                    <a href="#">Dr Edalin</a>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li className="appointment-info">
                              <p>
                                <i className="fa-solid fa-clock"></i>11 Nov 2024
                                10.45 AM
                              </p>
                              <ul className="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                              </ul>
                            </li>
                            <li className="appointment-detail-btn">
                              <a href="#" className="start-link">
                                View Details
                                <i className="fa-regular fa-circle-right ms-1"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="pills-complete"
                        role="tabpanel"
                        aria-labelledby="pills-complete-tab"
                      >
                        <div className="appointment-wrap">
                          <ul>
                            <li>
                              <div className="patinet-information">
                                <a href="#">
                                  <img src={user_img} alt="User Image" />
                                </a>
                                <div className="patient-info">
                                  <p>#Apt0001</p>
                                  <h6>
                                    <a href="#">Dr Edalin</a>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li className="appointment-info">
                              <p>
                                <i className="fa-solid fa-clock"></i>11 Nov 2024
                                10.45 AM
                              </p>
                              <ul className="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                              </ul>
                            </li>
                            <li className="appointment-detail-btn">
                              <a href="#" className="start-link">
                                View Details
                                <i className="fa-regular fa-circle-right ms-1"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="six">
                    <Row>
                      <Col xl="12" className="d-flex">
                        <div className="dashboard-card w-100">
                          <div className="dashboard-card-head">
                            <div className="header-title">
                              <h5>Symptom</h5>
                            </div>
                          </div>
                          <div className="dashboard-card-body">
                            <Row>
                              <Col lg="12" md="12" sm="12">
                                <PatSymptoms />
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  <Tab.Pane eventKey="third">
                    <Row>
                      <Col xl="12" className="d-flex">
                        <div className="dashboard-card w-100">
                          <div className="dashboard-card-head">
                            <div className="header-title">
                              <h5>Health Records</h5>
                            </div>
                            <a href="javascript:void(0);">
                              <img
                                src={user_img}
                                className="avatar dropdown-avatar"
                                alt="Img"
                              />
                              &nbsp; &nbsp; Hendrita
                            </a>
                          </div>
                          <div className="dashboard-card-body">
                            <Row>
                              <Col lg="12" md="12" sm="12">
                                <Row>
                                  <Col lg="4">
                                    <div className="health-records icon-orange">
                                      <span>
                                        <i className="fa-solid fa-heart"></i>
                                        Heart Rate
                                      </span>
                                      <h3>
                                        140 Bpm <sup> 2%</sup>
                                      </h3>
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="health-records icon-amber">
                                      <span>
                                        <i className="fa-solid fa-temperature-high"></i>
                                        Body Temprature
                                      </span>
                                      <h3>37.5 C</h3>
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="health-records icon-dark-blue">
                                      <span>
                                        <i className="fa-solid fa-notes-medical"></i>
                                        Glucose Level
                                      </span>
                                      <h3>
                                        70 - 90<sup> 6%</sup>
                                      </h3>
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="health-records icon-blue">
                                      <span>
                                        <i className="fa-solid fa-highlighter"></i>
                                        SPo2
                                      </span>
                                      <h3>96%</h3>
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="health-records icon-red">
                                      <span>
                                        <i className="fa-solid fa-syringe"></i>
                                        Blood Pressure
                                      </span>
                                      <h3>
                                        100 mg/dl<sup> 2%</sup>
                                      </h3>
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="health-records icon-purple">
                                      <span>
                                        <i className="fa-solid fa-user-pen"></i>
                                        BMI{" "}
                                      </span>
                                      <h3>20.1 kg/m2</h3>
                                    </div>
                                  </Col>
                                  <Col lg="12" md="12">
                                    <div className="report-gen-date">
                                      <p>
                                        Report generated on last visit : 25 Mar
                                        2024{" "}
                                        <span>
                                          <i className="fa-solid fa-copy"></i>
                                        </span>
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  <Tab.Pane eventKey="fourth">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="setting-card">
                        <div className="change-avatar img-upload">
                          <div className="profile-img">
                            {data?.coverImage ? (
                              <img
                                src={data?.coverImage}
                                alt="Profile Preview"
                              />
                            ) : selectedFile ? (
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Profile Preview"
                              />
                            ) : (
                              <i className="fa-solid fa-file-image"></i>
                            )}
                          </div>
                          <div className="upload-img">
                            <h5>Profile Image</h5>
                            <div className="imgs-load d-flex align-items-center">
                              <div className="change-photo">
                                Upload New
                                <input
                                  type="file"
                                  className="upload"
                                  accept="image/*"
                                  // onChange={handlePhotoChange}
                                />
                              </div>
                              <a href="#" className="upload-remove">
                                Remove
                              </a>
                            </div>
                            <p className="form-text">
                              Your Image should Below 4 MB, Accepted format
                              jpg,png,svg
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="setting-title">
                        <h5>Information</h5>
                      </div>
                      <div className="setting-card">
                        <div className="row">
                          <div className="col-lg-4 col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    placeholder="First Name"
                                  />
                                )}
                              />
                              <p className="text-danger">
                                {errors.firstName?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.lastName?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Date of Birth{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="birthDate"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="date"
                                    className="form-control"
                                  />
                                )}
                              />
                              <p className="text-danger">
                                {errors.birthDate?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.phoneNumber?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Email Address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="email"
                                    className="form-control"
                                  />
                                )}
                              />
                              <p className="text-danger">
                                {errors.email?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Blood Group{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="bloodGroup"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.bloodGroup?.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="setting-title">
                        <h5>Address</h5>
                      </div>
                      <div className="setting-card">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Address <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.address?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                City <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.city?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                State <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.state?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Country <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.country?.message}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Pincode <span className="text-danger">*</span>
                              </label>
                              <Controller
                                name="pinCode"
                                control={control}
                                render={({ field }) => (
                                  <input {...field} className="form-control" />
                                )}
                              />
                              <p className="text-danger">
                                {errors.pinCode?.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-btn text-end">
                        <a href="#" className="btn btn-gray">
                          Cancel
                        </a>
                        <button
                          type="submit"
                          className="btn btn-primary prime-btn"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default PatientDashboard;
