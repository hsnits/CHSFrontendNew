import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import biomedical_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import NotFound from "../../components/common/notFound";
import { getDateFormate, getIdLastDigits, formatName } from "../../helpers/utils";
import { putDataAPI } from "../../helpers/axiosInstance";
import { toastMessage } from "../../config/toast";

const Appointments = ({ biomedicalDetails }) => {
  const [tab, setTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const {
    data: appointments,
    loading,
    getAllData,
    setQuery,
    query,
  } = useGetMountData(userProfileId ? `/biomedical/appointments` : null);

  const getByFilter = async (filter) => {
    setTab(filter);
    if (filter === "all") {
      setQuery((pre) => ({ ...pre, status: undefined }));
    } else {
      setQuery((pre) => ({ ...pre, status: filter }));
    }
  };

  const handleModelShow = (appointment = null) => {
    setSelectedAppointment(appointment);
    setServiceNotes(appointment?.serviceNotes || "");
    setEstimatedCost(appointment?.estimatedCost || "");
    setShowModal(true);
  };

  const handleModelClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setStatusUpdate("");
    setServiceNotes("");
    setEstimatedCost("");
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await putDataAPI(`/biomedical/appointments/${appointmentId}/status`, {
        status: newStatus,
      });
      
      if (response.success) {
        toastMessage("success", `Service request ${newStatus} successfully`);
        getAllData(); // Refresh appointments
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      toastMessage("error", error.message || "Failed to update service request status");
    }
  };

  const handleServiceUpdate = async () => {
    try {
      if (!selectedAppointment) return;

      const updateData = {
        serviceNotes,
        estimatedCost: parseFloat(estimatedCost) || 0,
      };

      const response = await putDataAPI(`/biomedical/appointments/${selectedAppointment._id}`, updateData);
      
      if (response.success) {
        toastMessage("success", "Service details updated successfully");
        getAllData();
        handleModelClose();
      } else {
        throw new Error(response.message || "Failed to update service details");
      }
    } catch (error) {
      toastMessage("error", error.message || "Failed to update service details");
    }
  };

  useEffect(() => {
    if (userProfileId) {
      getAllData();
    }
  }, [userProfileId]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "badge-warning";
      case "confirmed":
        return "badge-primary";
      case "completed":
        return "badge-success";
      case "cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case "maintenance":
        return "fa-wrench";
      case "repair":
        return "fa-screwdriver";
      case "installation":
        return "fa-plug";
      case "calibration":
        return "fa-sliders-h";
      case "inspection":
        return "fa-search";
      case "emergency":
        return "fa-exclamation-triangle";
      default:
        return "fa-tools";
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <h3>Service Requests</h3>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Biomedical Service Requests</h4>
          <div className="card-header-btns">
            <Button
              className={`btn btn-sm me-2 ${tab === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => getByFilter("all")}
            >
              All
            </Button>
            <Button
              className={`btn btn-sm me-2 ${tab === "pending" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => getByFilter("pending")}
            >
              Pending
            </Button>
            <Button
              className={`btn btn-sm me-2 ${tab === "confirmed" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => getByFilter("confirmed")}
            >
              Confirmed
            </Button>
            <Button
              className={`btn btn-sm me-2 ${tab === "completed" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => getByFilter("completed")}
            >
              Completed
            </Button>
            <Button
              className={`btn btn-sm ${tab === "cancelled" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => getByFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Service ID</th>
                    <th>Patient</th>
                    <th>Service Type</th>
                    <th>Equipment</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>
                        <span className="text-blue">
                          #{getIdLastDigits(appointment._id, "BM-")}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={appointment.patientId?.coverImage || biomedical_img}
                            alt="Patient"
                            className="avatar-sm rounded-circle me-2"
                          />
                          <div>
                            <p className="mb-0">
                              {formatName(appointment.patientId?.firstName, appointment.patientId?.lastName)}
                            </p>
                            <small className="text-muted">
                              {appointment.patientId?.email}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className={`fa-solid ${getServiceTypeIcon(appointment.serviceType)} me-2`}></i>
                          <span className="badge badge-soft-info">
                            {appointment.serviceType || "Equipment Service"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="mb-0">{appointment.patientDetails?.equipmentType || "N/A"}</p>
                          <small className="text-muted">
                            {appointment.patientDetails?.equipmentModel || ""}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="mb-0">{getDateFormate(appointment.appointmentDate)}</p>
                          <small className="text-muted">
                            {appointment.appointmentTime || "N/A"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          appointment.priority === "emergency" ? "badge-danger" :
                          appointment.priority === "urgent" ? "badge-warning" :
                          "badge-info"
                        }`}>
                          {appointment.priority || "normal"}
                        </span>
                      </td>
                      <td>
                        <div className="action-item">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleModelShow(appointment)}
                            title="View Details"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          {appointment.status === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-success me-1"
                                onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                                title="Confirm"
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                                title="Cancel"
                              >
                                <i className="fa-solid fa-times"></i>
                              </button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleStatusUpdate(appointment._id, "completed")}
                              title="Mark Complete"
                            >
                              <i className="fa-solid fa-check-double"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NotFound message="No service requests found" />
          )}
        </div>
      </div>

      {/* Service Request Details Modal */}
      <Modal
        show={showModal}
        onHide={handleModelClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Service Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="service-request-details">
              <div className="row">
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Patient Information</h6>
                    <div className="detail-item">
                      <label>Name:</label>
                      <p>{formatName(selectedAppointment.patientId?.firstName, selectedAppointment.patientId?.lastName)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <p>{selectedAppointment.patientId?.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <p>{selectedAppointment.patientId?.phoneNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Service Information</h6>
                    <div className="detail-item">
                      <label>Service Type:</label>
                      <p>
                        <i className={`fa-solid ${getServiceTypeIcon(selectedAppointment.serviceType)} me-2`}></i>
                        {selectedAppointment.serviceType}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Equipment Type:</label>
                      <p>{selectedAppointment.patientDetails?.equipmentType}</p>
                    </div>
                    <div className="detail-item">
                      <label>Equipment Model:</label>
                      <p>{selectedAppointment.patientDetails?.equipmentModel || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Appointment Details</h6>
                    <div className="detail-item">
                      <label>Date:</label>
                      <p>{getDateFormate(selectedAppointment.appointmentDate)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Time:</label>
                      <p>{selectedAppointment.appointmentTime}</p>
                    </div>
                    <div className="detail-item">
                      <label>Priority:</label>
                      <p>
                        <span className={`badge ${
                          selectedAppointment.priority === "emergency" ? "badge-danger" :
                          selectedAppointment.priority === "urgent" ? "badge-warning" :
                          "badge-info"
                        }`}>
                          {selectedAppointment.priority || "normal"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Status & Cost</h6>
                    <div className="detail-item">
                      <label>Status:</label>
                      <p>
                        <span className={`badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Estimated Cost:</label>
                      <p>₹{selectedAppointment.estimatedCost || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6>Problem Description</h6>
                <div className="detail-item">
                  <p>{selectedAppointment.patientDetails?.description || "No description provided"}</p>
                </div>
              </div>

              <div className="detail-section">
                <h6>Service Notes</h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add service notes, observations, or recommendations..."
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="detail-section">
                <h6>Estimated Cost</h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Enter estimated cost"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModelClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleServiceUpdate}>
            Update Service Details
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Appointments; 