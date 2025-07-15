import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import user_img from "../../assets/img/dr_profile.jpg";
import {
  getDateFormate,
  getIdLastDigits,
  truncateAllText,
} from "../../helpers/utils";
import useGetMountData from "../../helpers/getDataHook";
import NotFound from "../../components/common/notFound";
import { getDataAPI, postDataAPI, putDataAPI } from "../../helpers/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toastMessage } from "../../config/toast";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";

// Validation schema for test update
const testUpdateSchema = yup.object().shape({
  testName: yup.string().required("Test name is required"),
  description: yup.string().required("Description is required"),
  cost: yup.number().required("Cost is required").min(0, "Cost must be positive"),
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");

  const userData = getLocalStorage(STORAGE.USER_KEY);
  const userProfileId = userData?.profile?._id;

  const handleModelShow = (appointment = null) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };
  
  const handleModelClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setStatusUpdate("");
  };

  const handleTabClick = (tab, event) => {
    event.preventDefault();
    setActiveTab(tab);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(testUpdateSchema),
  });

  // Get dashboard data
  const {
    data: dashboardData,
    loading: dashboardLoading,
    getAllData: getDashboardData,
  } = useGetMountData(userProfileId ? `/pathology/dashboard` : null);

  // Get appointments
  const {
    data: appointmentData,
    loading: appointmentLoading,
    getAllData: getAppointments,
    setData: setAppointmentData,
  } = useGetMountData(userProfileId ? `/pathology/appointments` : null);

  // Get profile data
  const {
    data: profileData,
    loading: profileLoading,
    getAllData: getProfile,
  } = useGetMountData(userProfileId ? `/pathology/profile` : null);

  useEffect(() => {
    if (userProfileId) {
      getDashboardData();
      getAppointments();
      getProfile();
    }
  }, [userProfileId]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await putDataAPI(`/pathology/appointments/${appointmentId}/status`, {
        status: newStatus,
      });
      
      if (response.success) {
        toastMessage("success", `Test ${newStatus} successfully`);
        getAppointments(); // Refresh appointments
        getDashboardData(); // Refresh dashboard stats
      }
    } catch (error) {
      toastMessage("error", "Failed to update test status");
    }
  };

  const onSubmit = async (values) => {
    try {
      if (!selectedAppointment) return;

      const response = await putDataAPI(`/pathology/appointments/${selectedAppointment._id}`, values);
      
      if (response.success) {
        toastMessage("success", "Test details updated successfully");
        getAppointments();
        handleModelClose();
      }
    } catch (error) {
      toastMessage("error", "Failed to update test details");
    }
  };

  const renderButton = () => {
    switch (activeTab) {
      case "appointments":
        return (
          <button
            onClick={() => navigate("/pathology/availability")}
            className="btn btn-primary"
          >
            Manage Availability
          </button>
        );
      case "profile":
        return (
          <button
            onClick={() => navigate("/pathology/profile/edit")}
            className="btn btn-secondary"
          >
            Edit Profile
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <div className="dashboard-header">
          <h3>Pathology Dashboard</h3>
        </div>

        <Col lg="12" xl="12" className="d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Lab Management</h5>
              </div>
              <a href="#">
                <img
                  src={profileData?.coverImage || user_img}
                  className="avatar dropdown-avatar"
                  alt="Profile"
                />
                &nbsp; &nbsp;{profileData?.labName || profileData?.firstName || userData?.name}
              </a>
            </div>
            <div className="dashboard-card-body">
              <div className="account-detail-table">
                <nav className="relative patient-dash-tab border-0 pb-0 mb-3 mt-3">
                  <ul className="nav nav-tabs-bottom" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "appointments" ? "active" : ""
                        }`}
                        href="#appointments-tab"
                        onClick={(event) =>
                          handleTabClick("appointments", event)
                        }
                      >
                        Test Requests
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "statistics" ? "active" : ""
                        }`}
                        href="#statistics-tab"
                        onClick={(event) =>
                          handleTabClick("statistics", event)
                        }
                      >
                        Statistics
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "profile" ? "active" : ""
                        }`}
                        href="#profile-tab"
                        onClick={(event) =>
                          handleTabClick("profile", event)
                        }
                      >
                        Profile
                      </a>
                    </li>
                    <div className="d-flex absolute top-0 right-0">
                      {renderButton()}
                    </div>
                  </ul>
                </nav>

                {/* Tab Content */}
                <div className="tab-content pt-0">
                  {activeTab === "appointments" && (
                    <div
                      id="appointments-tab"
                      className="tab-pane fade show active"
                      role="tabpanel"
                    >
                      <div className="custom-new-table">
                        <div className="table-responsive">
                          <table className="table table-hover table-center mb-0">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Test Name</th>
                                <th>Collection Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {!appointmentLoading &&
                                appointmentData?.length > 0 &&
                                appointmentData.map((appointment, index) => (
                                  <tr key={index}>
                                    <td>
                                      <span className="text-blue">
                                        {getIdLastDigits(appointment._id, "PT-")}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="table-avatar">
                                        <img
                                          src={appointment.patientId?.coverImage || user_img}
                                          alt="Patient"
                                          className="avatar-img rounded-3"
                                        />
                                        <div className="table-avatar-info">
                                          <h6>{appointment.patientId?.name || "N/A"}</h6>
                                          <span>{appointment.patientId?.email || ""}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>{appointment.testName || "N/A"}</td>
                                    <td>{appointment.collectionType || "N/A"}</td>
                                    <td>{getDateFormate(appointment.appointmentDate)}</td>
                                    <td>
                                      <span className={`badge badge-${appointment.status?.toLowerCase()}-bg`}>
                                        {appointment.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="action-item">
                                        <button
                                          className="btn btn-sm btn-outline-primary me-1"
                                          onClick={() => handleModelShow(appointment)}
                                        >
                                          <i className="fa-solid fa-eye"></i>
                                        </button>
                                        {appointment.status === "pending" && (
                                          <>
                                            <button
                                              className="btn btn-sm btn-outline-success me-1"
                                              onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                                            >
                                              <i className="fa-solid fa-check"></i>
                                            </button>
                                            <button
                                              className="btn btn-sm btn-outline-danger"
                                              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                                            >
                                              <i className="fa-solid fa-times"></i>
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          <NotFound
                            loading={appointmentLoading}
                            isData={appointmentData?.length > 0}
                            message="No test requests found."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "statistics" && (
                    <div
                      id="statistics-tab"
                      className="tab-pane fade show active"
                      role="tabpanel"
                    >
                      <div className="row">
                        <div className="col-md-3">
                          <div className="dashboard-widget-box">
                            <div className="dashboard-content-info">
                              <h6>Total Tests</h6>
                              <h4>{dashboardData?.totalBookings || 0}</h4>
                            </div>
                            <div className="dashboard-widget-icon">
                              <span className="dash-icon-box">
                                <i className="fa-solid fa-flask"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="dashboard-widget-box">
                            <div className="dashboard-content-info">
                              <h6>Pending</h6>
                              <h4>{dashboardData?.pendingBookings || 0}</h4>
                            </div>
                            <div className="dashboard-widget-icon">
                              <span className="dash-icon-box">
                                <i className="fa-solid fa-clock"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="dashboard-widget-box">
                            <div className="dashboard-content-info">
                              <h6>Completed</h6>
                              <h4>{dashboardData?.completedBookings || 0}</h4>
                            </div>
                            <div className="dashboard-widget-icon">
                              <span className="dash-icon-box">
                                <i className="fa-solid fa-check-circle"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="dashboard-widget-box">
                            <div className="dashboard-content-info">
                              <h6>Revenue</h6>
                              <h4>₹{dashboardData?.revenue || 0}</h4>
                            </div>
                            <div className="dashboard-widget-icon">
                              <span className="dash-icon-box">
                                <i className="fa-solid fa-rupee-sign"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "profile" && (
                    <div
                      id="profile-tab"
                      className="tab-pane fade show active"
                      role="tabpanel"
                    >
                      <div className="custom-table">
                        <div className="profile-info">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="profile-item">
                                <label>Lab Name:</label>
                                <p>{profileData?.labName || "N/A"}</p>
                              </div>
                              <div className="profile-item">
                                <label>Email:</label>
                                <p>{profileData?.email}</p>
                              </div>
                              <div className="profile-item">
                                <label>Phone:</label>
                                <p>{profileData?.phone}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="profile-item">
                                <label>Address:</label>
                                <p>{profileData?.address || "N/A"}</p>
                              </div>
                              <div className="profile-item">
                                <label>License Number:</label>
                                <p>{profileData?.licenseNumber || "N/A"}</p>
                              </div>
                              <div className="profile-item">
                                <label>Specializations:</label>
                                <p>{profileData?.specializations?.join(", ") || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </div>

      {/* Modal for appointment details */}
      <Modal
        show={showModal}
        onHide={handleModelClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Test Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="appointment-details">
              <div className="row">
                <div className="col-md-6">
                  <div className="detail-item">
                    <label>Patient Name:</label>
                    <p>{selectedAppointment.patientId?.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Test Name:</label>
                    <p>{selectedAppointment.testName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Collection Type:</label>
                    <p>{selectedAppointment.collectionType}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <label>Date:</label>
                    <p>{getDateFormate(selectedAppointment.appointmentDate)}</p>
                  </div>
                  <div className="detail-item">
                    <label>Time:</label>
                    <p>{selectedAppointment.appointmentTime}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <p>
                      <span className={`badge badge-${selectedAppointment.status?.toLowerCase()}-bg`}>
                        {selectedAppointment.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <label>Additional Notes:</label>
                <p>{selectedAppointment.patientDetails?.notes || "No additional notes"}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModelClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard; 