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
  onTestNameChange,
  onSpecialInstructionsChange,
  onFastingRequiredChange,
}) {
  const commonTests = [
    "Complete Blood Count (CBC)",
    "Lipid Profile",
    "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)",
    "Thyroid Profile",
    "Blood Sugar (Fasting/PP)",
    "HbA1c",
    "Urine Analysis",
    "Vitamin D",
    "Vitamin B12",
    "ESR",
    "CRP",
    "Electrolytes",
    "Cardiac Markers",
    "Tumor Markers",
    "Hormone Profile",
    "Allergy Panel",
    "HIV/AIDS Test",
    "Hepatitis Profile",
    "COVID-19 Test",
  ];

  const handleTestSelection = (testName) => {
    const currentTests = formData.selectedTests || [];
    const isSelected = currentTests.includes(testName);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selectedTests: currentTests.filter(test => test !== testName)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedTests: [...currentTests, testName]
      }));
    }
  };

  return (
    <Container>
      <style jsx>{`
        .patient-details-container {
          padding: 20px 0;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          font-weight: 600;
          color: #5a5c69;
          margin-bottom: 8px;
          display: block;
        }
        .form-control, .form-select {
          border: 1px solid #d1d3e2;
          border-radius: 0.35rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          width: 100%;
        }
        .form-control:focus, .form-select:focus {
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }
        .test-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-top: 15px;
        }
        .test-checkbox {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          background: #f8f9fc;
          border: 2px solid #e3e6f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .test-checkbox:hover {
          background: #e8f4fd;
          border-color: #4e73df;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(78, 115, 223, 0.15);
        }
        .test-checkbox.selected {
          background: #d4edda;
          border-color: #28a745;
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.15);
        }
        .test-checkbox input[type="checkbox"] {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          accent-color: #28a745;
          cursor: pointer;
        }
        .test-checkbox label {
          margin: 0;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: #2c3e50;
          flex: 1;
        }
        .test-checkbox.selected label {
          color: #155724;
          font-weight: 600;
        }
        .selected-tests-display {
          background: #d4edda;
          border: 2px solid #28a745;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .selected-test-tag {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          margin: 4px;
          box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
          border-bottom: 2px solid #4e73df;
          padding-bottom: 8px;
        }
        .radio-group {
          display: flex;
          gap: 20px;
          margin-top: 8px;
        }
        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .radio-option input[type="radio"] {
          margin: 0;
        }
        .radio-option label {
          margin: 0;
          cursor: pointer;
        }
        .form-text {
          font-size: 0.75rem;
          color: #6c757d;
          margin-top: 5px;
        }
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        .checkbox-group input[type="checkbox"] {
          margin: 0;
        }
        .checkbox-group label {
          margin: 0;
          cursor: pointer;
        }
      `}</style>

      <div className="patient-details-container">
        <h4 className="section-title">Test & Patient Information</h4>

        <Row>
          <Col lg="12">
            <div className="form-group">
              <label className="form-label">
                Test Name or Description <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter specific test name or description"
                value={formData.testName || ""}
                onChange={onTestNameChange}
              />
              <small className="form-text">
                If you know the specific test name, enter it here. Otherwise, select from common tests below.
              </small>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <div className="form-group">
              <label className="form-label">Common Laboratory Tests</label>
              <div className="test-selection-grid">
                {commonTests.map((test, index) => (
                  <div
                    key={index}
                    className={`test-checkbox ${
                      formData.selectedTests?.includes(test) ? "selected" : ""
                    }`}
                    onClick={() => handleTestSelection(test)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedTests?.includes(test) || false}
                      onChange={() => handleTestSelection(test)}
                    />
                    <label>{test}</label>
                  </div>
                ))}
              </div>
              
              {formData.selectedTests && formData.selectedTests.length > 0 && (
                <div className="selected-tests-display">
                  <strong>Selected Tests:</strong>
                  <div>
                    {formData.selectedTests.map((test, index) => (
                      <span key={index} className="selected-test-tag">
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">
                Reason for Test <span className="text-danger">*</span>
              </label>
              <select
                className="form-control form-select"
                value={formData.reason || ""}
                onChange={onReasonChange}
              >
                <option value="">Select reason</option>
                <option value="Routine Health Checkup">Routine Health Checkup</option>
                <option value="Doctor Prescription">Doctor Prescription</option>
                <option value="Symptoms Monitoring">Symptoms Monitoring</option>
                <option value="Follow-up Test">Follow-up Test</option>
                <option value="Pre-surgery Screening">Pre-surgery Screening</option>
                <option value="Employment Medical">Employment Medical</option>
                <option value="Insurance Medical">Insurance Medical</option>
                <option value="Pregnancy Screening">Pregnancy Screening</option>
                <option value="Chronic Disease Monitoring">Chronic Disease Monitoring</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </Col>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">Current Symptoms/Concerns</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe any symptoms or health concerns"
                value={formData.symptoms || ""}
                onChange={onSymptomsChange}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Any special instructions or preparation notes"
                value={formData.specialInstructions || ""}
                onChange={onSpecialInstructionsChange}
              />
            </div>
          </Col>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">Fasting Required</label>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="fastingRequired"
                  checked={formData.fastingRequired || false}
                  onChange={onFastingRequiredChange}
                />
                <label htmlFor="fastingRequired">
                  This test requires fasting (8-12 hours)
                </label>
              </div>
              <small className="form-text">
                Check this if you need to fast before the test
              </small>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">
                Test for <span className="text-danger">*</span>
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
                  <label htmlFor="dependent">Family Member/Dependent</label>
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

        <Row>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">Insurance Coverage</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="insurance_yes"
                    name="insurance"
                    value="yes"
                    checked={formData.isInsurance}
                    onChange={onInsuranceChange}
                  />
                  <label htmlFor="insurance_yes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="insurance_no"
                    name="insurance"
                    value="no"
                    checked={!formData.isInsurance}
                    onChange={onInsuranceChange}
                  />
                  <label htmlFor="insurance_no">No</label>
                </div>
              </div>
            </div>
          </Col>
          <Col lg="6">
            <div className="form-group">
              <label className="form-label">Prescription/Medical Records</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={onFileChange}
              />
              <small className="form-text">
                Upload doctor's prescription or relevant medical records (PDF, JPG, PNG)
              </small>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
} 