import React, { useEffect } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../patient/Patient.css";
import user_img from "../../assets/img/profile-06.jpg";
import Footer from "../../components/Footer";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useDispatch } from "react-redux";
import { STORAGE } from "../../constants";

function PatientDashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(userProfile());
    const token = localStorage.getItem(STORAGE.USER_KEY);
    const parsedValue = JSON.parse(token);
    console.log(parsedValue?.accessToken);
  }, []);
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
                        <img src={user_img} alt="User Image" />
                      </Link>
                      <div className="profile-det-info">
                        <h3>
                          <Link href="#">Hendrita</Link>
                        </h3>
                        <div className="patient-details">
                          <h5 className="mb-0">Patient ID : PT254654</h5>
                        </div>
                        <span>
                          Female <i className="fa-solid fa-circle"></i> 32 years
                          03 Months
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

                    <Col lg="12" xl="12" class="d-flex">
                      <div class="dashboard-card w-100">
                        <div class="dashboard-card-head">
                          <div class="header-title">
                            <h5>Reports</h5>
                          </div>
                          <a href="javascript:void(0);">
                            <img
                              src={user_img}
                              class="avatar dropdown-avatar"
                              alt="Img"
                            />
                            &nbsp; &nbsp;Hendrita
                          </a>
                        </div>
                        <div class="dashboard-card-body">
                          <div class="account-detail-table">
                            <nav class="patient-dash-tab border-0 pb-0 mb-3 mt-3">
                              <ul class="nav nav-tabs-bottom" role="tablist">
                                <li class="nav-item" role="presentation">
                                  <a
                                    class="nav-link"
                                    href="#appoint-tab"
                                    data-bs-toggle="tab"
                                    aria-selected="false"
                                    role="tab"
                                    tabindex="-1"
                                  >
                                    Appointments
                                  </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                  <a
                                    class="nav-link"
                                    href="#medical-tab"
                                    data-bs-toggle="tab"
                                    aria-selected="false"
                                    tabindex="-1"
                                    role="tab"
                                  >
                                    Medical Records
                                  </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                  <a
                                    class="nav-link active"
                                    href="#prsc-tab"
                                    data-bs-toggle="tab"
                                    aria-selected="true"
                                    role="tab"
                                  >
                                    Prescriptions
                                  </a>
                                </li>
                              </ul>
                            </nav>

                            <div class="tab-content pt-0">
                              <div
                                id="appoint-tab"
                                class="tab-pane fade"
                                role="tabpanel"
                              >
                                <div class="custom-new-table">
                                  <div class="table-responsive">
                                    <table class="table table-hover table-center mb-0">
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
                                              <span class="text-blue">
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
                                            <span class="badge badge-success-bg">
                                              Normal
                                            </span>
                                          </td>
                                          <td>
                                            <div class="d-flex align-items-center">
                                              <a
                                                href="#"
                                                class="account-action me-2"
                                              >
                                                <i class="fa-solid fa-prescription"></i>
                                              </a>
                                              <a
                                                href="#"
                                                class="account-action"
                                              >
                                                <i class="fa-solid fa-file-invoice-dollar"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="javascript:void(0);">
                                              <span class="text-blue">
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
                                            <span class="badge badge-success-bg">
                                              Normal
                                            </span>
                                          </td>
                                          <td>
                                            <div class="d-flex align-items-center">
                                              <a
                                                href="#"
                                                class="account-action me-2"
                                              >
                                                <i class="fa-solid fa-prescription"></i>
                                              </a>
                                              <a
                                                href="#"
                                                class="account-action"
                                              >
                                                <i class="fa-solid fa-file-invoice-dollar"></i>
                                              </a>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="javascript:void(0);">
                                              <span class="text-blue">
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
                                            <span class="badge badge-success-bg">
                                              Normal
                                            </span>
                                          </td>
                                          <td>
                                            <div class="d-flex align-items-center">
                                              <a
                                                href="#"
                                                class="account-action me-2"
                                              >
                                                <i class="fa-solid fa-prescription"></i>
                                              </a>
                                              <a
                                                href="#"
                                                class="account-action"
                                              >
                                                <i class="fa-solid fa-file-invoice-dollar"></i>
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
                                class="tab-pane fade"
                                id="medical-tab"
                                role="tabpanel"
                              >
                                <div class="custom-table">
                                  <div class="table-responsive">
                                    <table class="table table-center mb-0">
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
                                          <td class="text-blue-600">
                                            <a href="javascript:void(0);">
                                              #MR-123
                                            </a>
                                          </td>
                                          <td>
                                            <a
                                              href="javascript:void(0);"
                                              class="lab-icon"
                                            >
                                              <span>
                                                <i class="fa-solid fa-paperclip"></i>
                                              </span>
                                              Lab Report
                                            </a>
                                          </td>
                                          <td>24 Mar 2024</td>
                                          <td>Glucose Test V12</td>
                                          <td>
                                            <div class="action-item">
                                              <a href="javascript:void(0);">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                              </a>
                                              <a href="javascript:void(0);">
                                                <i class="fa-solid fa-download"></i>
                                              </a>
                                              <a href="javascript:void(0);">
                                                <i class="fa-solid fa-trash-can"></i>
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
                                class="tab-pane fade active show"
                                id="prsc-tab"
                                role="tabpanel"
                              >
                                <div class="custom-table">
                                  <div class="table-responsive">
                                    <table class="table table-center mb-0">
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
                                          <td class="text-blue-600">
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
                                              class="lab-icon prescription"
                                            >
                                              <span>
                                                <i class="fa-solid fa-prescription"></i>
                                              </span>
                                              Prescription
                                            </a>
                                          </td>
                                          <td>24 Mar 2024, 10:30 AM</td>
                                          <td>
                                            <h2 class="table-avatar">
                                              <a
                                                href="#"
                                                class="avatar avatar-sm me-2"
                                              >
                                                <img
                                                  class="avatar-img rounded-3"
                                                  src={user_img}
                                                  alt="User Image"
                                                />
                                              </a>
                                              <a href="#">Edalin Hendry</a>
                                            </h2>
                                          </td>
                                          <td>
                                            <div class="action-item">
                                              <a href="javascript:void(0);">
                                                <i class="fa-solid fa-download"></i>
                                              </a>
                                              <a href="javascript:void(0);">
                                                <i class="fa-solid fa-trash-can"></i>
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
                    <div class="dashboard-header">
                      <h3>Appointments</h3>
                    </div>
                    <div class="appointment-tab-head">
                      <div class="appointment-tabs">
                        <ul
                          class="nav nav-pills inner-tab "
                          id="pills-tab"
                          role="tablist"
                        >
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link active"
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
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
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
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
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
                    <div class="tab-content appointment-tab-content">
                      <div
                        class="tab-pane fade show active"
                        id="pills-upcoming"
                        role="tabpanel"
                        aria-labelledby="pills-upcoming-tab"
                      >
                        <div class="appointment-wrap">
                          <ul>
                            <li>
                              <div class="patinet-information">
                                <a href="#">
                                  <img src={user_img} alt="User Image" />
                                </a>
                                <div class="patient-info">
                                  <p>#Apt0001</p>
                                  <h6>
                                    <a href="#">Dr Edalin</a>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li class="appointment-info">
                              <p>
                                <i class="fa-solid fa-clock"></i>11 Nov 2024
                                10.45 AM
                              </p>
                              <ul class="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                              </ul>
                            </li>
                            <li class="mail-info-patient">
                              <ul>
                                <li>
                                  <i class="fa-solid fa-envelope"></i>
                                  edalin@example.com
                                </li>
                                <li>
                                  <i class="fa-solid fa-phone"></i>+1 504 368
                                  6874
                                </li>
                              </ul>
                            </li>
                            <li class="appointment-action">
                              <ul>
                                <li>
                                  <a href="#">
                                    <i class="fa-solid fa-eye"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i class="fa-solid fa-comments"></i>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <i class="fa-solid fa-xmark"></i>
                                  </a>
                                </li>
                              </ul>
                            </li>
                            <li class="appointment-detail-btn">
                              <a href="#" class="start-link">
                                <i class="fa-solid fa-calendar-check me-1"></i>
                                Attend
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="pills-cancel"
                        role="tabpanel"
                        aria-labelledby="pills-cancel-tab"
                      >
                        <div class="appointment-wrap">
                          <ul>
                            <li>
                              <div class="patinet-information">
                                <a href="#">
                                  <img src={user_img} alt="User Image" />
                                </a>
                                <div class="patient-info">
                                  <p>#Apt00011</p>
                                  <h6>
                                    <a href="#">Dr Edalin</a>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li class="appointment-info">
                              <p>
                                <i class="fa-solid fa-clock"></i>11 Nov 2024
                                10.45 AM
                              </p>
                              <ul class="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                              </ul>
                            </li>
                            <li class="appointment-detail-btn">
                              <a href="#" class="start-link">
                                View Details
                                <i class="fa-regular fa-circle-right ms-1"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="pills-complete"
                        role="tabpanel"
                        aria-labelledby="pills-complete-tab"
                      >
                        <div class="appointment-wrap">
                          <ul>
                            <li>
                              <div class="patinet-information">
                                <a href="#">
                                  <img src={user_img} alt="User Image" />
                                </a>
                                <div class="patient-info">
                                  <p>#Apt0001</p>
                                  <h6>
                                    <a href="#">Dr Edalin</a>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li class="appointment-info">
                              <p>
                                <i class="fa-solid fa-clock"></i>11 Nov 2024
                                10.45 AM
                              </p>
                              <ul class="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                              </ul>
                            </li>
                            <li class="appointment-detail-btn">
                              <a href="#" class="start-link">
                                View Details
                                <i class="fa-regular fa-circle-right ms-1"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
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
                    <form>
                      <div class="setting-card">
                        <div class="change-avatar img-upload">
                          <div class="profile-img">
                            <i class="fa-solid fa-file-image"></i>
                          </div>
                          <div class="upload-img">
                            <h5>Profile Image</h5>
                            <div class="imgs-load d-flex align-items-center">
                              <div class="change-photo">
                                Upload New
                                <input type="file" class="upload" />
                              </div>
                              <a href="#" class="upload-remove">
                                Remove
                              </a>
                            </div>
                            <p class="form-text">
                              Your Image should Below 4 MB, Accepted format
                              jpg,png,svg
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="setting-title">
                        <h5>Information</h5>
                      </div>
                      <div class="setting-card">
                        <div class="row">
                          <div class="col-lg-4 col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                First Name <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Last Name <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Date of Birth <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Phone Number <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Email Address <span class="text-danger">*</span>
                              </label>
                              <input type="email" class="form-control" />
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Blood Group <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="setting-title">
                        <h5>Address</h5>
                      </div>
                      <div class="setting-card">
                        <div class="row">
                          <div class="col-lg-12">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Address <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                City <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                State <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Country <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-wrap">
                              <label class="col-form-label">
                                Pincode <span class="text-danger">*</span>
                              </label>
                              <input type="text" class="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="modal-btn text-end">
                        <a href="#" class="btn btn-gray">
                          Cancel
                        </a>
                        <button type="submit" class="btn btn-primary prime-btn">
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
