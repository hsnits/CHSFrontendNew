import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table, Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllTestAppointments, 
  updateTestStatus,
  getAppointmentCounts 
} from "../../redux/slices/pathologyApi";
import { Spinner } from "reactstrap";
import { toastMessage } from "../../config/toast";
import { callPutApi, callGetApi } from "../../_service";

const TestAppointments = ({ labDetails }) => {
  const dispatch = useDispatch();
  const { testAppointments, appointmentsCounts, loading } = useSelector(state => ({
    testAppointments: state.PATHOLOGY.data.pathology.getAllTestAppointmentsResult,
    appointmentsCounts: state.PATHOLOGY.data.pathology.getAppointmentCountsResult,
    loading: state.PATHOLOGY.loading.pathology.getAllTestAppointmentsLoading || state.PATHOLOGY.loading.pathology.getAppointmentCountsLoading
  }));
  

  
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (labDetails?.profile?._id) {
      const params = {
        labId: labDetails.profile._id,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        date: selectedDate || undefined
      };
      
      console.log("=== Frontend API calls ===");
      console.log("Lab ID:", labDetails.profile._id);
      console.log("Selected Status:", selectedStatus);
      console.log("Selected Date:", selectedDate);
      console.log("API params:", params);
      
      dispatch(getAllTestAppointments(params));
      dispatch(getAppointmentCounts(labDetails.profile._id));
    }
  }, [dispatch, labDetails?.profile?._id, selectedStatus, selectedDate]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const resultAction = await dispatch(updateTestStatus({
        appointmentId,
        status: newStatus
      }));

      if (updateTestStatus.fulfilled.match(resultAction)) {
        toastMessage("success", "Test status updated successfully");
        // Refresh appointments
        dispatch(getAllTestAppointments({
          labId: labDetails.profile._id,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          date: selectedDate || undefined
        }));
      }
    } catch (error) {
      toastMessage("error", "Failed to update test status");
    }
  };

  const handleAcceptWithAmount = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAmountModal(true);
    setAmount(""); // Reset amount
  };

  const handleConfirmAccept = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toastMessage("error", "Please enter a valid amount");
      return;
    }

    try {
      const response = await callPutApi(`/patient/appointment/${selectedAppointment._id}`, {
        status: "Accepted",
        amount: parseFloat(amount)
      });
      
      if (!response.status) throw new Error(response.message);
      
      setShowAmountModal(false);
      setSelectedAppointment(null);
      setAmount("");

      toastMessage("success", `Test appointment accepted with amount $${amount}`);

      // Refresh appointments
      dispatch(getAllTestAppointments({
        labId: labDetails.profile._id,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        date: selectedDate || undefined
      }));
    } catch (error) {
      toastMessage("error", "Failed to accept appointment");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { variant: 'warning', text: 'Pending' },
      'Created': { variant: 'info', text: 'Created' },
      'Accepted': { variant: 'primary', text: 'Accepted' },
      'Completed': { variant: 'success', text: 'Completed' },
      'Cancelled': { variant: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getCollectionTypeBadge = (type) => {
    return type === 'Home Collection' ? 
      <Badge bg="success"><i className="fa-solid fa-home me-1"></i>Home</Badge> :
      <Badge bg="primary"><i className="fa-solid fa-building me-1"></i>Lab</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const appointments = testAppointments || [];
  const counts = appointmentsCounts || {};



  return (
    <div>
      <div className="dashboard-header d-flex justify-content-between align-items-center">
        <h3>Test Appointments</h3>
        <div className="d-flex gap-3">
          <select 
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Created">Created</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input 
            type="date" 
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Status Summary Cards */}
      <Row className="mb-4">
        <Col lg="2" md="4" sm="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">{counts.pending || 0}</h4>
              <p className="mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="2" md="4" sm="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-info">{counts.created || 0}</h4>
              <p className="mb-0">Created</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="2" md="4" sm="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{counts.accepted || 0}</h4>
              <p className="mb-0">Accepted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="2" md="4" sm="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">{counts.completed || 0}</h4>
              <p className="mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="2" md="4" sm="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-danger">{counts.cancelled || 0}</h4>
              <p className="mb-0">Cancelled</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>



      {/* Appointments Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Tests</th>
                  <th>Date & Time</th>
                  <th>Collection Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="py-4">
                        <Spinner />
                        <p className="text-muted mt-2">Loading appointments...</p>
                      </div>
                    </td>
                  </tr>
                ) : appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>
                        <div>
                          <strong>
                            {appointment.patientId?.firstName || appointment.name || 'Unknown Patient'} {appointment.patientId?.lastName || ''}
                          </strong>
                          <br />
                          <small className="text-muted">{appointment.patientId?.phoneNumber || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {appointment.testName && appointment.testName.trim() ? (
                            <Badge bg="light" text="dark" className="me-1 mb-1">
                              {appointment.testName}
                            </Badge>
                          ) : (
                            <Badge bg="light" text="dark" className="me-1 mb-1">
                              General Test
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>
                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date TBD'}
                          </strong>
                          <br />
                          <small>{appointment.time || 'Time TBD'}</small>
                        </div>
                      </td>
                      <td>
                        {getCollectionTypeBadge(appointment.appointmentType)}
                      </td>
                      <td>
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {appointment.status === 'Pending' && (
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleAcceptWithAmount(appointment)}
                            >
                              Accept
                            </button>
                          )}
                          {appointment.status === 'Accepted' && (
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleStatusUpdate(appointment._id, 'Completed')}
                            >
                              Complete
                            </button>
                          )}
                          {['Pending', 'Accepted'].includes(appointment.status) && (
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatusUpdate(appointment._id, 'Cancelled')}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="py-4">
                        <i className="fa-solid fa-flask fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No test appointments found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Amount Modal */}
      <Modal show={showAmountModal} onHide={() => setShowAmountModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Test Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="mb-3">
              <p><strong>Patient:</strong> {selectedAppointment.patientId?.firstName} {selectedAppointment.patientId?.lastName}</p>
              <p><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()} {selectedAppointment.time}</p>
              <p><strong>Test:</strong> {selectedAppointment.testName || "Lab Test"}</p>
              <p><strong>Type:</strong> {selectedAppointment.appointmentType}</p>
            </div>
          )}
          <Form.Group>
            <Form.Label>Amount ($) <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter test amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <Form.Text className="text-muted">
              Enter the test fee for this appointment
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAmountModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmAccept}>
            Accept Test
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestAppointments; 