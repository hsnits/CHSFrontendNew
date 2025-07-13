import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Container, Card, CardBody, Spinner } from "react-bootstrap";
import BookingSummary from "../../components/doctorBooking/BookingSummary";
import { ArrowDownRight } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointment,
  updateAppointment,
} from "../../redux/slices/patientApi";
import DatePicker from "react-datepicker";
import { toastMessage } from "../../config/toast";
import PatientDetails from "./PatientDetails";
import CollectionType from "./CollectionType";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { uploadFile } from "../../redux/slices/userApi";
import "react-datepicker/dist/react-datepicker.css";

const formatDate = (date) => date.toISOString().split("T")[0];

export default function PathologyBooking({ type }) {
  const { id } = useParams(); // Appointment ID
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    time: null,
    isMySelf: true,
    attachment: null,
    dependent: "",
    reason: "",
    symptoms: "",
    testName: "",
    appointmentType: "Lab", // "Lab" or "Home Collection"
    isInsurance: false,
    specialInstructions: "",
    fastingRequired: false,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const data = useSelector(
    (state) =>
      state.PATIENT.data?.user?.getAppointmentResult ||
      state.PATIENT.data?.user?.createAppointmentResult
  );

  useEffect(() => {
    dispatch(getAppointment(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Pre-populate form if data is loaded
    if (data) {
      setFormData((prev) => ({
        ...prev,
        date: data.date ? formatDate(new Date(data.date)) : prev.date,
        time: data.time || prev.time,
        reason: data.reason || prev.reason,
        symptoms: data.symptoms || prev.symptoms,
        testName: data.testName || prev.testName,
        appointmentType: data.appointmentType || prev.appointmentType,
        isInsurance: data.isInsurance || prev.isInsurance,
        isMySelf: data.appointmentFor !== "Dependent",
        dependent: data.appointmentFor === "Dependent" ? data.appointmentPersonName : "",
      }));
    }
  }, [data]);

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date: formatDate(date) }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time: time }));
  };

  const handleAppointmentChange = (e) => {
    setFormData((prev) => ({ ...prev, isMySelf: e.target.value === "myself" }));
  };

  const handleInsuranceChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isInsurance: e.target.value === "yes",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (allowedTypes.includes(file.type)) {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        setFormData((prev) => ({ ...prev, attachment: formDataObj }));
      } else {
        alert("Please upload a valid PDF or image file (JPG, JPEG, PNG).");
      }
    }
  };

  const handleReasonChange = (e) => {
    setFormData((prev) => ({ ...prev, reason: e.target.value }));
  };

  const handleSymptomsChange = (e) => {
    setFormData((prev) => ({ ...prev, symptoms: e.target.value }));
  };

  const handleTestNameChange = (e) => {
    setFormData((prev) => ({ ...prev, testName: e.target.value }));
  };

  const handleCollectionTypeChange = (typeVal) => {
    setFormData((prev) => ({ ...prev, appointmentType: typeVal }));
  };

  const handleSpecialInstructionsChange = (e) => {
    setFormData((prev) => ({ ...prev, specialInstructions: e.target.value }));
  };

  const handleFastingRequiredChange = (e) => {
    setFormData((prev) => ({ ...prev, fastingRequired: e.target.checked }));
  };

  // Placeholder handler for CollectionType component compatibility
  const handlePreferredTimeChange = (e) => {
    // No longer needed since we simplified to single time selection
  };

  const validateStep1 = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const selectedDateOnly = new Date(formData.date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isPastDate = selectedDateOnly < currentDate;

    if (isPastDate) {
      toastMessage("error", "Selected date cannot be in the past.");
      return false;
    }

    if (formData.bookingType === "multiple" && formData.duration < 1) {
      toastMessage("error", "Please select a valid duration.");
      return false;
    }

    if (formData.bookingType === "recurring" && formData.duration < 1) {
      toastMessage("error", "Please select number of sessions.");
      return false;
    }

    if (formData.appointmentType === "Home Collection" && !formData.time && !formData.preferredTime) {
      toastMessage("error", "Please select a preferred time for home collection.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.testName && formData.selectedTests.length === 0) {
      toastMessage("error", "Please specify the test name or select tests.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.appointmentType) {
      toastMessage("error", "Please select a collection type.");
      return false;
    }
    return true;
  };

  const getAppointmentId = getLocalStorage(STORAGE.APPOINTMENT_KEY);

  const handleSubmit = () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        break;
    }

    if (isValid) {
      if (step === 3) {
        setLoading(true);
        toastMessage("success", "Processing lab test booking...");

        if (formData?.attachment) {
          toastMessage("success", "Prescription file uploading...");
          dispatch(uploadFile(formData.attachment)).then((res) => {
            if (res?.meta?.requestStatus === "fulfilled") {
              handleUpdateAppointment(res.payload);
            } else {
              setLoading(false);
              toastMessage("error", "File upload failed. Please try again.");
            }
          });
        } else {
          handleUpdateAppointment(null);
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleUpdateAppointment = (uploadedFile) => {
    const formattedData = {
      ...formData,
      id: getAppointmentId?.appointment_id,
      appointmentFor: formData?.isMySelf ? "" : formData?.dependent,
      attachment: uploadedFile?.location || null,
      fileKey: uploadedFile?.key || null,
      // Multi-day booking fields
      bookingType: formData.bookingType,
      endDate: formData.endDate,
      duration: formData.duration,
      recurringPattern: formData.recurringPattern,
      // Time fields
      startTime: formData.startTime,
      endTime: formData.endTime,
      // Pathology specific fields
      testName: formData.testName,
      symptoms: formData.specialInstructions || formData.symptoms,
    };

    // Set the correct ref field
    if (type === "pathology") {
      formattedData.refPathology = data?.refPathology?._id || data?.pathology?._id;
    }

    dispatch(updateAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLoading(false);
        navigate("/BookingSuccess", { state: { type: "pathology" } });
      } else {
        setLoading(false);
        toastMessage("error", "Lab test booking failed.");
      }
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get the correct summary data
  const summaryData =
    type === "pathology"
      ? data?.refPathology || data?.pathology
      : data?.refDoctor || data?.doctor;

  return (
    <>
      <style jsx>{`
        .booking-card {
          min-height: auto !important;
          height: auto !important;
          border: 1px solid #e3e6f0;
          border-radius: 0.35rem;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
        }
        .time-slot-card-body {
          min-height: auto !important;
          height: auto !important;
          overflow: visible !important;
        }
        .pathology-schedule-selector {
          width: 100%;
          overflow: visible;
        }

        .collection-option-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          background-color: #f9f9f9;
        }

        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          font-weight: 600;
          color: #5a5c69;
          margin-bottom: 8px;
        }
        .form-control, .form-select {
          border: 1px solid #d1d3e2;
          border-radius: 0.35rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        }
        .form-control:focus, .form-select:focus {
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <Header />
      <Breadcrumb type="apId" />
      <div className="content content-space">
        <Container>
          <Row>
            {step > 1 && (
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="back-link">
                    <button 
                      onClick={handleBack}
                      className="btn btn-outline-primary"
                      style={{ marginBottom: '20px' }}
                    >
                      <i className="fa-solid fa-arrow-left-long"></i> Back
                    </button>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <Col lg="8" md="12">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button 
                      onClick={() => navigate(-1)}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fa-solid fa-arrow-left-long"></i> Back to Lab List
                    </button>
                  </div>
                  <div className="booking-header">
                    <h4 className="booking-title">Select Test Date & Time</h4>
                  </div>
                  <div className="booking-date choose-date-book">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Choose Test Date</label>
                          <DatePicker
                            selected={new Date(formData.date)}
                            onChange={handleDateChange}
                            dateFormat="MMMM d, yyyy"
                            className="form-control"
                            minDate={new Date()}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Select Time Slot</label>
                          <select
                            className="form-control form-select"
                            value={formData.time || ""}
                            onChange={(e) => handleTimeSelect(e.target.value)}
                          >
                            <option value="">Select a time slot</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={summaryData} type={type} />
              </>
            )}
            {step === 2 && (
              <>
                <Col lg="8" md="12">
                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body">
                      <PatientDetails
                        formData={formData}
                        setFormData={setFormData}
                        onAppointmentChange={handleAppointmentChange}
                        onInsuranceChange={handleInsuranceChange}
                        onFileChange={handleFileChange}
                        onReasonChange={handleReasonChange}
                        onSymptomsChange={handleSymptomsChange}
                        onTestNameChange={handleTestNameChange}
                        onSpecialInstructionsChange={handleSpecialInstructionsChange}
                        onFastingRequiredChange={handleFastingRequiredChange}
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={summaryData} type={type} />
              </>
            )}
            {step === 3 && (
              <>
                <Col lg="8" md="12">
                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body">
                      <CollectionType
                        formData={formData}
                        onCollectionTypeChange={handleCollectionTypeChange}
                        onPreferredTimeChange={handlePreferredTimeChange}
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      {loading ? <Spinner size="sm" /> : "Book Lab Test"}{" "}
                      <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={summaryData} type={type} />
              </>
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
} 