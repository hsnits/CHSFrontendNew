import React, { useState, useEffect } from "react";
import { Card, Table, Button, Badge, Row, Col, Form, Modal, Pagination } from "react-bootstrap";

import useGetMountData from "../../helpers/getDataHook";
import { callPutApi, callPostApi } from "../../_service";
import { toast } from "react-toastify";
import NotFound from "../../components/common/notFound";
import {
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import drProfileImg from "../../assets/img/dr_profile.jpg";

const Appointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // New Admission modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmission, setNewAdmission] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    department: "General",
    serviceType: "Consultation",
    admissionDate: "",
    priority: "normal",
  });

  const {
    data: appointments,
    loading,
    getAllData,
    setQuery,
    pagination,
  } = useGetMountData(`/hospital/appointments`);

  const statusFilters = [
    { key: "all", label: "All Admissions", count: appointments?.length || 0 },
    { key: "pending", label: "Pending", count: appointments?.filter(a => a.status === "Pending")?.length || 0 },
    { key: "confirmed", label: "Confirmed", count: appointments?.filter(a => a.status === "Confirmed")?.length || 0 },
    { key: "in-progress", label: "In Progress", count: appointments?.filter(a => a.status === "In Progress")?.length || 0 },
    { key: "completed", label: "Completed", count: appointments?.filter(a => a.status === "Completed")?.length || 0 },
    { key: "cancelled", label: "Cancelled", count: appointments?.filter(a => a.status === "Cancelled")?.length || 0 },
  ];

  useEffect(() => {
    handleFilterChange("all");
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    const filterQuery = filter === "all" ? {} : { status: filter };
    setQuery(prev => ({ ...prev, ...filterQuery, search: searchTerm }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setQuery(prev => ({ 
      ...prev, 
      search: value,
      ...(activeFilter !== "all" && { status: activeFilter })
    }));
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await callPutApi(`/hospital/appointments/${appointmentId}/status`, {
        status: newStatus,
      });

      if (response?.success || response?.status) {
        toast.success(`Admission ${newStatus.toLowerCase()} successfully`);
        getAllData();
        setShowDetailModal(false);
      } else {
        toast.error("Failed to update admission status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update admission status");
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "confirmed": return "info";
      case "in-progress": return "primary";
      case "completed": return "success";
      case "cancelled": return "danger";
      default: return "secondary";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "emergency": return "danger";
      case "urgent": return "warning";
      case "normal": return "success";
      default: return "secondary";
    }
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesFilter = activeFilter === "all" || 
      appointment.status?.toLowerCase() === activeFilter;
    const matchesSearch = !searchTerm || 
      appointment.patientDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="hospital-appointments">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-0">
            <i className="fas fa-bed me-2"></i>
            Hospital Admissions Management
          </h4>
          <p className="text-muted">Manage patient admissions and hospital services</p>
        </Col>
      </Row>

      {/* Filter Buttons */}
      <Row className="mb-4">
        <Col>
          <div className="filter-buttons">
            {statusFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "primary" : "outline-primary"}
                className={`filter-btn ${activeFilter === filter.key ? "active" : ""}`}
                onClick={() => handleFilterChange(filter.key)}
              >
                {filter.label}
                <Badge bg="light" text="dark" className="ms-2">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="search"
              placeholder="Search by patient name, department, or service..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </Form.Group>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" className="me-2" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus me-1"></i>
            New Admission
          </Button>
          <Button variant="outline-primary">
            <i className="fas fa-download me-1"></i>
            Export
          </Button>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Card className="appointments-table">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Admissions List
              </h5>
            </Col>
            <Col xs="auto">
              <Form.Select size="sm" defaultValue="10">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading admissions...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Patient Details</th>
                    <th>Department</th>
                    <th>Service Type</th>
                    <th>Admission Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment._id || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={appointment.patientDetails?.profileImage || drProfileImg}
                            alt="Patient"
                            className="rounded-circle me-3"
                            width="45"
                            height="45"
                          />
                          <div>
                            <h6 className="mb-1">{appointment.patientDetails?.name || "N/A"}</h6>
                            <small className="text-muted">
                              ID: #{getIdLastDigits(appointment._id)}
                            </small>
                            <br />
                            <small className="text-muted">
                              {appointment.patientDetails?.age ? `${appointment.patientDetails.age}y` : ""} 
                              {appointment.patientDetails?.gender ? ` • ${appointment.patientDetails.gender}` : ""}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="department-badge">
                          {appointment.department || "General"}
                        </Badge>
                      </td>
                      <td>
                        <span className="service-type">
                          {appointment.serviceType || "Consultation"}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">
                            {getDateFormate(appointment.date)}
                          </div>
                          <small className="text-muted">
                            {appointment.time || "All Day"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getPriorityBadge(appointment.priority)}>
                          {appointment.priority || "Normal"}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          bg={getStatusVariant(appointment.status)}
                          className="status-badge"
                        >
                          {appointment.status || "Pending"}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="action-btn me-1"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          
                          {appointment.status === "Pending" && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="action-btn me-1"
                                onClick={() => updateAppointmentStatus(appointment._id, "Confirmed")}
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="action-btn"
                                onClick={() => updateAppointmentStatus(appointment._id, "Cancelled")}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </>
                          )}
                          
                          {appointment.status === "Confirmed" && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="action-btn"
                              onClick={() => updateAppointmentStatus(appointment._id, "In Progress")}
                            >
                              <i className="fas fa-play"></i>
                            </Button>
                          )}
                          
                          {appointment.status === "In Progress" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="action-btn"
                              onClick={() => updateAppointmentStatus(appointment._id, "Completed")}
                            >
                              <i className="fas fa-check-circle"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <NotFound 
                message={
                  searchTerm 
                    ? `No admissions found matching "${searchTerm}"` 
                    : activeFilter === "all" 
                      ? "No admissions found" 
                      : `No ${activeFilter} admissions found`
                } 
              />
            </div>
          )}
        </Card.Body>
        
        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <Card.Footer>
            <Row className="align-items-center">
              <Col>
                <small className="text-muted">
                  Showing {pagination.page} of {pagination.pages} pages 
                  ({pagination.total} total admissions)
                </small>
              </Col>
              <Col xs="auto">
                <Pagination size="sm" className="mb-0">
                  <Pagination.Prev disabled={pagination.page === 1} />
                  {[...Array(pagination.pages)].map((_, i) => (
                    <Pagination.Item 
                      key={i + 1} 
                      active={i + 1 === pagination.page}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next disabled={pagination.page === pagination.pages} />
                </Pagination>
              </Col>
            </Row>
          </Card.Footer>
        )}
      </Card>

      {/* Appointment Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-info-circle me-2"></i>
            Admission Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Patient Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={selectedAppointment.patientDetails?.profileImage || drProfileImg}
                        alt="Patient"
                        className="rounded-circle me-3"
                        width="60"
                        height="60"
                      />
                      <div>
                        <h5 className="mb-1">{selectedAppointment.patientDetails?.name}</h5>
                        <p className="text-muted mb-0">
                          ID: #{getIdLastDigits(selectedAppointment._id)}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-6">
                        <strong>Age:</strong> {selectedAppointment.patientDetails?.age || "N/A"}
                      </div>
                      <div className="col-6">
                        <strong>Gender:</strong> {selectedAppointment.patientDetails?.gender || "N/A"}
                      </div>
                      <div className="col-12 mt-2">
                        <strong>Contact:</strong> {selectedAppointment.patientDetails?.phone || "N/A"}
                      </div>
                      <div className="col-12 mt-2">
                        <strong>Email:</strong> {selectedAppointment.patientDetails?.email || "N/A"}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Admission Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row">
                      <div className="col-12 mb-2">
                        <strong>Department:</strong>
                        <Badge bg="light" text="dark" className="ms-2">
                          {selectedAppointment.department || "General"}
                        </Badge>
                      </div>
                      <div className="col-12 mb-2">
                        <strong>Service Type:</strong> {selectedAppointment.serviceType || "N/A"}
                      </div>
                      <div className="col-6 mb-2">
                        <strong>Date:</strong> {getDateFormate(selectedAppointment.date)}
                      </div>
                      <div className="col-6 mb-2">
                        <strong>Time:</strong> {selectedAppointment.time || "All Day"}
                      </div>
                      <div className="col-6 mb-2">
                        <strong>Priority:</strong>
                        <Badge bg={getPriorityBadge(selectedAppointment.priority)} className="ms-2">
                          {selectedAppointment.priority || "Normal"}
                        </Badge>
                      </div>
                      <div className="col-6 mb-2">
                        <strong>Status:</strong>
                        <Badge bg={getStatusVariant(selectedAppointment.status)} className="ms-2">
                          {selectedAppointment.status || "Pending"}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedAppointment.symptoms && (
                      <div className="mt-3">
                        <strong>Symptoms/Notes:</strong>
                        <p className="mt-1 text-muted">{selectedAppointment.symptoms}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          {selectedAppointment?.status === "Pending" && (
            <>
              <Button 
                variant="success" 
                onClick={() => updateAppointmentStatus(selectedAppointment._id, "Confirmed")}
              >
                <i className="fas fa-check me-1"></i>
                Confirm Admission
              </Button>
              <Button 
                variant="danger" 
                onClick={() => updateAppointmentStatus(selectedAppointment._id, "Cancelled")}
              >
                <i className="fas fa-times me-1"></i>
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Add Admission Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Admission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="patientName">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAdmission.patientName}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="patientAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    value={newAdmission.patientAge}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientAge: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="patientGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={newAdmission.patientGender}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientGender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="department">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAdmission.department}
                    onChange={(e) => setNewAdmission({ ...newAdmission, department: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="serviceType">
                  <Form.Label>Service Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAdmission.serviceType}
                    onChange={(e) => setNewAdmission({ ...newAdmission, serviceType: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="admissionDate">
                  <Form.Label>Admission Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newAdmission.admissionDate}
                    onChange={(e) => setNewAdmission({ ...newAdmission, admissionDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newAdmission.priority}
                    onChange={(e) => setNewAdmission({ ...newAdmission, priority: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={async () => {
            try {
              const response = await callPostApi('/hospital/appointments', newAdmission);
              if (response?.success || response?.status) {
                toast.success('Admission created successfully');
                setShowAddModal(false);
                // refresh list
                getAllData();
              } else {
                toast.error(response?.message || 'Failed to create admission');
              }
            } catch (err) {
              console.error(err);
              toast.error('Failed to create admission');
            }
          }}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments; 