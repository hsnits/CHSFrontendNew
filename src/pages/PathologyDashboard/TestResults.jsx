import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllTestAppointments, 
  addTestResults 
} from "../../redux/slices/pathologyApi";
import { Spinner } from "reactstrap";
import { toastMessage } from "../../config/toast";

const TestResults = ({ labDetails }) => {
  const dispatch = useDispatch();
  const { testAppointments, loading } = useSelector(state => ({
    testAppointments: state.PATHOLOGY.data.pathology.getAllTestAppointmentsResult,
    loading: state.PATHOLOGY.loading.pathology.getAllTestAppointmentsLoading || state.PATHOLOGY.loading.pathology.addTestResultsLoading
  }));
  
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [resultData, setResultData] = useState({
    results: '',
    notes: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (labDetails?.profile?._id) {
      // Only get accepted appointments for test results
      dispatch(getAllTestAppointments({
        labId: labDetails.profile._id,
        status: 'Accepted'
      }));
    }
  }, [dispatch, labDetails?.profile?._id]);

  const handleAddResults = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    setResultData({
      results: appointment.testResults || '',
      notes: appointment.notes || '',
      file: null
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toastMessage("error", "Only PDF, JPEG, JPG, PNG files are allowed");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastMessage("error", "File size should not exceed 5MB");
        return;
      }
      
      setResultData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmitResults = async () => {
    if (!resultData.results.trim()) {
      toastMessage("error", "Please enter test results");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('appointmentId', selectedAppointment._id);
      formData.append('results', resultData.results);
      formData.append('notes', resultData.notes);
      
      if (resultData.file) {
        formData.append('file', resultData.file);
      }

      const resultAction = await dispatch(addTestResults(formData));

      if (addTestResults.fulfilled.match(resultAction)) {
        toastMessage("success", "Test results added successfully");
        setShowModal(false);
        setSelectedAppointment(null);
        setResultData({ results: '', notes: '', file: null });
        
        // Refresh appointments
        dispatch(getAllTestAppointments({
          labId: labDetails.profile._id,
          status: 'Accepted'
        }));
      }
    } catch (error) {
      toastMessage("error", "Failed to add test results");
    } finally {
      setUploading(false);
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
  const acceptedAppointments = appointments.filter(app => app.status === 'Accepted');

  return (
    <div>
      <div className="dashboard-header">
        <h3>Test Results Management</h3>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg="6" md="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">{acceptedAppointments.filter(app => !app.testResults).length}</h4>
              <p className="mb-0">Tests In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="6" md="6">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">{acceptedAppointments.filter(app => app.testResults).length}</h4>
              <p className="mb-0">Completed Tests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Results Table */}
      <Card>
        <Card.Header>
          <h5>Test Results</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Tests</th>
                  <th>Date</th>
                  <th>Collection Type</th>
                  <th>Status</th>
                  <th>Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {acceptedAppointments.length > 0 ? (
                  acceptedAppointments.map((appointment) => (
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
                        {appointment.testResults ? (
                          <div>
                            <Badge bg="success">Available</Badge>
                            {appointment.reportFile && (
                              <div className="mt-1">
                                <a 
                                  href={appointment.reportFile} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fa-solid fa-download me-1"></i>
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge bg="secondary">Pending</Badge>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAddResults(appointment)}
                        >
                          {appointment.testResults ? 'Update' : 'Add'} Results
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <div className="py-4">
                        <i className="fa-solid fa-file-medical fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No accepted test appointments found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Results Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAppointment?.testResults ? 'Update' : 'Add'} Test Results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <div className="mb-3">
                <strong>Patient:</strong> {selectedAppointment.patientId?.firstName} {selectedAppointment.patientId?.lastName}
                <br />
                <strong>Phone:</strong> {selectedAppointment.patientId?.phoneNumber}
                <br />
                <strong>Test:</strong> {selectedAppointment.testName || 'General Test'}
                <br />
                <strong>Date:</strong> {selectedAppointment.date ? new Date(selectedAppointment.date).toLocaleDateString() : 'Date TBD'} {selectedAppointment.time || ''}
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Test Results <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={resultData.results}
                    onChange={(e) => setResultData(prev => ({ ...prev, results: e.target.value }))}
                    placeholder="Enter detailed test results..."
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={resultData.notes}
                    onChange={(e) => setResultData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or recommendations..."
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Upload Report File (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Supported formats: PDF, JPEG, JPG, PNG. Max size: 5MB
                  </Form.Text>
                  {resultData.file && (
                    <div className="mt-2">
                      <Badge bg="info">Selected: {resultData.file.name}</Badge>
                    </div>
                  )}
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowModal(false)}
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitResults}
            disabled={uploading}
          >
            {uploading && <Spinner size="sm" className="me-2" />}
            {selectedAppointment?.testResults ? 'Update' : 'Add'} Results
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestResults; 