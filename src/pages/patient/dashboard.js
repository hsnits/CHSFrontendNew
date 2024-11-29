import React, { useState } from "react";
import { Col, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import user_img from "../../assets/img/profile-06.jpg";

const Dashboard = ({ data }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");

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
  return (
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
                <ul className="nav nav-tabs-bottom" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "appointments" ? "active" : ""
                      }`}
                      href="#appoint-tab"
                      data-bs-toggle="tab"
                      aria-selected={activeTab === "appointments"}
                      role="tab"
                      onClick={() => handleTabClick("appointments")}
                    >
                      Appointments
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "medicalRecords" ? "active" : ""
                      }`}
                      href="#medical-tab"
                      data-bs-toggle="tab"
                      aria-selected={activeTab === "medicalRecords"}
                      role="tab"
                      onClick={() => handleTabClick("medicalRecords")}
                    >
                      Medical Records
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "prescriptions" ? "active" : ""
                      }`}
                      href="#prsc-tab"
                      data-bs-toggle="tab"
                      aria-selected={activeTab === "prescriptions"}
                      role="tab"
                      onClick={() => handleTabClick("prescriptions")}
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
                <div id="appoint-tab" className="tab-pane fade" role="tabpanel">
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
                                <span className="text-blue">RE124343</span>
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
                                <a href="#" className="account-action me-2">
                                  <i className="fa-solid fa-prescription"></i>
                                </a>
                                <a href="#" className="account-action">
                                  <i className="fa-solid fa-file-invoice-dollar"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a href="javascript:void(0);">
                                <span className="text-blue">RE124342</span>
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
                                <a href="#" className="account-action me-2">
                                  <i className="fa-solid fa-prescription"></i>
                                </a>
                                <a href="#" className="account-action">
                                  <i className="fa-solid fa-file-invoice-dollar"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a href="javascript:void(0);">
                                <span className="text-blue">RE124341</span>
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
                                <a href="#" className="account-action me-2">
                                  <i className="fa-solid fa-prescription"></i>
                                </a>
                                <a href="#" className="account-action">
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

                <div className="tab-pane fade" id="medical-tab" role="tabpanel">
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
                              <a href="javascript:void(0);">#MR-123</a>
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
                                <a href="#" className="avatar avatar-sm me-2">
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
  );
};

export default Dashboard;
