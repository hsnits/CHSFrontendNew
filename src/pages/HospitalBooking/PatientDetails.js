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
        <h4 className="patient-title">Patient Details</h4>
      </div>
      
      <div className="patient-appointment">
        <form>
          {/* Patient Information */}
          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">
                  Appointment for <span className="text-danger">*</span>
                </label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="myself"
                      name="appointmentFor"
                      value="myself"
                      checked={formData.isMySelf}
                      onChange={handleAppointmentChange}
                    />
                    <label htmlFor="myself">My Self</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="dependent"
                      name="appointmentFor" 
                      value="dependent"
                      checked={!formData.isMySelf}
                      onChange={handleAppointmentChange}
                    />
                    <label htmlFor="dependent">Dependent</label>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {!formData.isMySelf && (
            <Row>
              <Col lg="6">
                <div className="form-group">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.dependent}
                    onChange={(e) => setFormData(prev => ({ ...prev, dependent: e.target.value }))}
                    placeholder="Enter patient name"
                  />
                </div>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="ENT">ENT</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Service Type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Admission">Admission</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Health Checkup">Health Checkup</option>
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
                  <option value="Low">Low - Routine</option>
                  <option value="Medium">Medium - Within 24 hours</option>
                  <option value="High">High - Within 6 hours</option>
                  <option value="Critical">Critical - Emergency</option>
                </select>
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Preferred Doctor</label>
                <input
                  type="text"
                  name="preferredDoctor"
                  value={formData.preferredDoctor}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter preferred doctor name (if any)"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Emergency contact number"
                  maxLength="10"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea
                  className="form-control"
                  value={formData.reason}
                  onChange={handleReasonChange}
                  placeholder="Please describe the reason for your hospital visit"
                  rows="3"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">Medical Condition / Symptoms</label>
                <textarea
                  name="medicalCondition"
                  value={formData.medicalCondition}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe your medical condition, symptoms, or reason for visit"
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
                <label className="form-label">Upload Medical Documents</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="form-control"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <small className="form-text text-muted">
                  Upload medical reports, prescriptions, or relevant documents (Optional)
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
                      id="insurance-yes-hospital"
                      name="insurance"
                      value="yes"
                      checked={formData.isInsurance}
                      onChange={handleInsuranceChange}
                    />
                    <label htmlFor="insurance-yes-hospital">Yes</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="insurance-no-hospital"
                      name="insurance"
                      value="no"
                      checked={!formData.isInsurance}
                      onChange={handleInsuranceChange}
                    />
                    <label htmlFor="insurance-no-hospital">No</label>
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