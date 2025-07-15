import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const PatientDetails = ({ 
  formData, 
  setFormData, 
  handleFileChange, 
  handleReasonChange, 
  handleSymptomsChange, 
  handleAppointmentChange, 
  handleInsuranceChange 
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    if (handleFileChange) {
      handleFileChange(e);
    }
  };

  return (
    <Container>
      <div className="patient-details-header">
        <h4 className="patient-title">Service Details</h4>
      </div>
      
      <div className="patient-appointment">
        <form>
          {/* Service Information */}
          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">
                  Service for <span className="text-danger">*</span>
                </label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="organization"
                      name="appointmentFor"
                      value="myself"
                      checked={formData.isMySelf}
                      onChange={handleAppointmentChange}
                    />
                    <label htmlFor="organization">My Organization</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="other-org"
                      name="appointmentFor" 
                      value="dependent"
                      checked={!formData.isMySelf}
                      onChange={handleAppointmentChange}
                    />
                    <label htmlFor="other-org">Other Organization</label>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {!formData.isMySelf && (
            <Row>
              <Col lg="6">
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.dependent}
                    onChange={(e) => setFormData(prev => ({ ...prev, dependent: e.target.value }))}
                    placeholder="Enter organization name"
                  />
                </div>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Equipment Type</label>
                <select
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Equipment Type</option>
                  <option value="Ventilator">Ventilator</option>
                  <option value="X-Ray Machine">X-Ray Machine</option>
                  <option value="CT Scanner">CT Scanner</option>
                  <option value="MRI Machine">MRI Machine</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG Machine">ECG Machine</option>
                  <option value="Defibrillator">Defibrillator</option>
                  <option value="Dialysis Machine">Dialysis Machine</option>
                  <option value="Anesthesia Machine">Anesthesia Machine</option>
                  <option value="Patient Monitor">Patient Monitor</option>
                  <option value="Infusion Pump">Infusion Pump</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  name="preferredServiceType"
                  value={formData.preferredServiceType}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="installation">Installation</option>
                  <option value="calibration">Calibration</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Low">Low - Routine Service</option>
                  <option value="Medium">Medium - Within 24 hours</option>
                  <option value="High">High - Within 12 hours</option>
                  <option value="Critical">Critical - Immediate</option>
                </select>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Service Reason</label>
                <textarea
                  className="form-control"
                  value={formData.reason}
                  onChange={handleReasonChange}
                  placeholder="Please describe the reason for service"
                  rows="3"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Issue Description</label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe the equipment issue or service requirement in detail"
                  rows="4"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-control"
                  value={formData.symptoms}
                  onChange={handleSymptomsChange}
                  placeholder="Any additional information or special requirements"
                  rows="3"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Upload Equipment Documents</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="form-control"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <small className="form-text text-muted">
                  Upload equipment manuals, error reports, or warranty documents (Optional)
                </small>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Insurance Coverage</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="insurance-yes"
                      name="insurance"
                      value="yes"
                      checked={formData.isInsurance}
                      onChange={handleInsuranceChange}
                    />
                    <label htmlFor="insurance-yes">Yes</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="insurance-no"
                      name="insurance"
                      value="no"
                      checked={!formData.isInsurance}
                      onChange={handleInsuranceChange}
                    />
                    <label htmlFor="insurance-no">No</label>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </form>
      </div>
    </Container>
  );
};

export default PatientDetails; 