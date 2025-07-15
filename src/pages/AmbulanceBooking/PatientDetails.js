import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function PatientDetails({
  formData,
  setFormData,
  onAppointmentChange,
  onInsuranceChange,
  onFileChange,
  onReasonChange,
  onSymptomsChange,
  onSpecialInstructionsChange,
}) {
  const urgencyLevels = ["Low", "Medium", "High", "Critical"];
  const ambulanceTypes = ["Basic", "Advanced", "ICU", "Neonatal", "Cardiac"];

  return (
    <Container>
      <div className="patient-details-header">
        <h4 className="patient-title">Patient & Service Details</h4>
      </div>
      
      <div className="patient-appointment">
        <form>
          {/* Patient Information */}
          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Service for <span className="text-danger">*</span>
                </label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="myself"
                      name="appointmentFor"
                      value="myself"
                      checked={formData.isMySelf}
                      onChange={onAppointmentChange}
                    />
                    <label htmlFor="myself">Myself</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="dependent"
                      name="appointmentFor"
                      value="dependent"
                      checked={!formData.isMySelf}
                      onChange={onAppointmentChange}
                    />
                    <label htmlFor="dependent">Family Member/Other</label>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6">
              {!formData.isMySelf && (
                <div className="form-group">
                  <label className="form-label">
                    Patient Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter patient name"
                    value={formData.dependent || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dependent: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </Col>
          </Row>

          {/* Location Details */}
          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Pickup Location <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter complete pickup address with landmarks"
                  value={formData.pickupLocation || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickupLocation: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Drop Location <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter complete drop address (hospital/clinic)"
                  value={formData.dropLocation || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dropLocation: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
          </Row>

          {/* Contact Information */}
          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name of person to contact"
                  value={formData.contactPerson || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Contact Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter contact number"
                  value={formData.contactNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
          </Row>

          {/* Medical Details */}
          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Reason for Ambulance <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe the medical emergency or transport need"
                  value={formData.reason || ""}
                  onChange={onReasonChange}
                />
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Patient Condition/Symptoms
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe current condition, symptoms, or medical history"
                  value={formData.patientCondition || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patientCondition: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
          </Row>

          {/* Service Preferences */}
          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Urgency Level <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control form-select"
                  value={formData.urgencyLevel || "Medium"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      urgencyLevel: e.target.value,
                    }))
                  }
                >
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level} {level === "Critical" ? "(Life-threatening)" : level === "High" ? "(Urgent)" : level === "Medium" ? "(Moderate)" : "(Non-urgent)"}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Ambulance Type Preference
                </label>
                <select
                  className="form-control form-select"
                  value={formData.ambulanceType || "Basic"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ambulanceType: e.target.value,
                    }))
                  }
                >
                  {ambulanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type} Ambulance
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>

          {/* Special Instructions */}
          <Row>
            <Col lg="12">
              <div className="form-group">
                <label className="form-label">
                  Special Instructions
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Any special requirements, accessibility needs, or additional information"
                  value={formData.specialInstructions || ""}
                  onChange={onSpecialInstructionsChange}
                />
              </div>
            </Col>
          </Row>

          {/* Insurance */}
          <Row>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Do you have insurance? <span className="text-danger">*</span>
                </label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="insurance-yes"
                      name="insurance"
                      value="yes"
                      checked={formData.isInsurance}
                      onChange={onInsuranceChange}
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
                      onChange={onInsuranceChange}
                    />
                    <label htmlFor="insurance-no">No</label>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="form-group">
                <label className="form-label">
                  Upload Medical Documents (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={onFileChange}
                />
                <small className="text-muted">
                  Upload prescription, medical reports, or insurance documents
                </small>
              </div>
            </Col>
          </Row>
        </form>
      </div>
    </Container>
  );
} 