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
import ConsultationType from "./ConsultationType";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { uploadFile } from "../../redux/slices/userApi";
import "react-datepicker/dist/react-datepicker.css";

const formatDate = (date) => date.toISOString().split("T")[0];

export default function Booking({ type }) {
  const { id } = useParams(); // Appointment ID
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    endDate: null,
    bookingType: "single", // "single", "multiple", "recurring"
    selectedDates: [],
    recurringPattern: "daily", // "daily", "weekly", "custom"
    duration: 1, // number of days/sessions
    hourlyDuration: 1, // number of hours for shift duration
    time: null,
    startTime: null,
    endTime: null,
    customTime: null,
    isMySelf: true,
    attachment: null,
    dependent: "",
    reason: "",
    symptoms: "",
    appointmentType: "Chat",
    isInsurance: false,
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

  const handleEndDateChange = (date) => {
    setFormData((prev) => ({ ...prev, endDate: formatDate(date) }));
  };

  const handleBookingTypeChange = (type) => {
    setFormData((prev) => ({ 
      ...prev, 
      bookingType: type,
      endDate: type === "single" ? null : prev.endDate,
      selectedDates: type === "single" ? [] : prev.selectedDates,
      duration: type === "single" ? 1 : prev.duration,
      hourlyDuration: 1 // Reset hourly duration when changing booking type
    }));
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    setFormData((prev) => {
      const newData = { ...prev, duration };
      
      // Auto-calculate end date for duration-based booking
      if (prev.bookingType === "multiple") {
        const startDate = new Date(prev.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration - 1);
        newData.endDate = formatDate(endDate);
      }
      
      return newData;
    });
  };

  const handleRecurringPatternChange = (e) => {
    setFormData((prev) => ({ ...prev, recurringPattern: e.target.value }));
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

  const handleConsultationTypeChange = (typeVal) => {
    setFormData((prev) => ({ ...prev, appointmentType: typeVal }));
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

    if (!formData.time && !formData.startTime && !formData.customTime) {
      toastMessage("error", "Please select a time slot or enter custom time.");
      return false;
    }

    if (formData.startTime && !formData.hourlyDuration) {
      toastMessage("error", "Please select duration for the nursing shift.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.reason) {
      toastMessage("error", "Please provide the reason for the appointment.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.appointmentType) {
      toastMessage("error", "Please select a consultation type.");
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
        toastMessage("success", "Processing appointment...");

        if (formData?.attachment) {
          toastMessage("success", "Symptom file uploading...");
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
      // Hourly time fields
      startTime: formData.startTime,
      endTime: formData.endTime,
      hourlyDuration: formData.startTime ? formData.hourlyDuration : null,
    };

    // Set the correct ref field
    if (type === "nurse") {
      formattedData.refNurse = data?.refNurse?._id || data?.nurse?._id;
    } else {
      formattedData.refDoctor = data?.refDoctor?._id || data?.doctor?._id;
    }

    dispatch(updateAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLoading(false);
        navigate("/BookingSuccess", { state: { type: "nurse" } });
      } else {
        setLoading(false);
        toastMessage("error", "Appointment update failed.");
      }
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get the correct summary data
  debugger;
  const summaryData =
    type === "nurse"
      ? data?.refNurse || data?.nurse
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
        .nursing-schedule-selector {
          width: 100%;
          overflow: visible;
        }
        .booking-type-selector {
          background: #f8f9fc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }
        .booking-type-selector .btn-group {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .booking-type-selector .btn {
          flex: 1;
          max-width: 150px;
        }
        .shift-option-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          background-color: #f9f9f9;
        }
        .shift-buttons .btn {
          margin-right: 8px;
          margin-bottom: 8px;
          font-size: 12px;
          white-space: nowrap;
          flex-wrap: wrap;
        }
        .shift-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .selected-time-display {
          animation: fadeIn 0.3s ease-in;
        }
        .time-range-selector {
          margin-bottom: 20px;
        }
        .quick-select-options {
          margin-bottom: 20px;
        }
        .custom-time-input {
          margin-top: 20px;
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
                      <i className="fa-solid fa-arrow-left-long"></i> Back to Nurse List
                    </button>
                  </div>
                  <div className="booking-header">
                    <h4 className="booking-title">Select Available Slots</h4>
                  </div>
                  <div className="booking-date choose-date-book">
                    <div className="booking-type-selector mb-3">
                      <p className="mb-2">Booking Type</p>
                      <div className="btn-group" role="group">
                        <input
                          type="radio"
                          className="btn-check"
                          name="bookingType"
                          id="single"
                          value="single"
                          checked={formData.bookingType === "single"}
                          onChange={() => handleBookingTypeChange("single")}
                        />
                        <label className="btn btn-outline-primary" htmlFor="single">
                          Single Day
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="bookingType"
                          id="multiple"
                          value="multiple"
                          checked={formData.bookingType === "multiple"}
                          onChange={() => handleBookingTypeChange("multiple")}
                        />
                        <label className="btn btn-outline-primary" htmlFor="multiple">
                          Multiple Days
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="bookingType"
                          id="recurring"
                          value="recurring"
                          checked={formData.bookingType === "recurring"}
                          onChange={() => handleBookingTypeChange("recurring")}
                        />
                        <label className="btn btn-outline-primary" htmlFor="recurring">
                          Recurring
                        </label>
                      </div>
                    </div>

                    {formData.bookingType === "single" && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Choose Date</label>
                              <DatePicker
                                selected={new Date(formData.date)}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                                className="form-control"
                                minDate={new Date()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.bookingType === "multiple" && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Start Date</label>
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
                              <label className="form-label">Duration (Days)</label>
                              <select
                                className="form-control form-select"
                                value={formData.duration}
                                onChange={handleDurationChange}
                              >
                                {[...Array(30)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1} {i + 1 === 1 ? 'Day' : 'Days'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {formData.endDate && (
                          <div className="mt-2">
                            <div className="alert alert-info py-2">
                              <small>
                                <i className="fa fa-calendar"></i> End Date: {new Date(formData.endDate).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {formData.bookingType === "recurring" && (
                      <div>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label className="form-label">Start Date</label>
                              <DatePicker
                                selected={new Date(formData.date)}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                                className="form-control"
                                minDate={new Date()}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label className="form-label">Recurring Pattern</label>
                              <select
                                className="form-control form-select"
                                value={formData.recurringPattern}
                                onChange={handleRecurringPatternChange}
                              >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label className="form-label">Number of Sessions</label>
                              <select
                                className="form-control form-select"
                                value={formData.duration}
                                onChange={handleDurationChange}
                              >
                                {[...Array(52)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1} {i + 1 === 1 ? 'Session' : 'Sessions'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Summary */}
                  {(formData.bookingType !== "single" || formData.duration > 1) && (
                    <div className="booking-summary-card mb-4">
                      <div className="alert alert-info border-left-primary">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fa fa-info-circle text-primary me-2"></i>
                          <h6 className="mb-0">Booking Summary</h6>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <small><strong>Type:</strong> {formData.bookingType === "single" ? "Single Day" : formData.bookingType === "multiple" ? "Multiple Days" : "Recurring"}</small>
                          </div>
                          <div className="col-md-6">
                            <small><strong>Start Date:</strong> {new Date(formData.date).toLocaleDateString()}</small>
                          </div>
                          {formData.bookingType === "multiple" && (
                            <>
                              <div className="col-md-6">
                                <small><strong>Duration:</strong> {formData.duration} {formData.duration === 1 ? 'Day' : 'Days'}</small>
                              </div>
                              {formData.endDate && (
                                <div className="col-md-6">
                                  <small><strong>End Date:</strong> {new Date(formData.endDate).toLocaleDateString()}</small>
                                </div>
                              )}
                            </>
                          )}
                          {formData.bookingType === "recurring" && (
                            <>
                              <div className="col-md-6">
                                <small><strong>Pattern:</strong> {formData.recurringPattern}</small>
                              </div>
                              <div className="col-md-6">
                                <small><strong>Sessions:</strong> {formData.duration}</small>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body" style={{ minHeight: 'auto', padding: '20px' }}>
                      <div className="nursing-schedule-selector">
                        <h5 className="mb-4">Select Nursing Schedule</h5>
                        
                        {/* Time Range Selector */}
                        <div className="time-range-selector mb-4">
                          <h6>Choose Time Range</h6>
                          <Row>
                            <Col lg="6" md="6">
                              <div className="form-group mb-3">
                                <label className="form-label">Start Time</label>
                                <select 
                                  className="form-control form-select"
                                  value={formData.startTime || ""}
                                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                >
                                  <option value="">Select Start Time</option>
                                  {Array.from({ length: 24 }, (_, i) => {
                                    const hour = i.toString().padStart(2, '0');
                                    return (
                                      <option key={hour} value={`${hour}:00`}>
                                        {hour}:00 ({i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`})
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </Col>
                            <Col lg="6" md="6">
                              <div className="form-group mb-3">
                                <label className="form-label">Duration (Hours)</label>
                                <select 
                                  className="form-control form-select"
                                  value={formData.hourlyDuration || ""}
                                  onChange={(e) => {
                                    const hourlyDuration = parseInt(e.target.value);
                                    setFormData(prev => {
                                      const newData = { ...prev, hourlyDuration };
                                      // Auto-calculate end time
                                      if (prev.startTime) {
                                        const [startHour] = prev.startTime.split(':');
                                        const endHour = (parseInt(startHour) + hourlyDuration) % 24;
                                        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
                                        newData.endTime = endTime;
                                      }
                                      return newData;
                                    });
                                  }}
                                >
                                  <option value="">Select Duration</option>
                                  {Array.from({ length: 24 }, (_, i) => i + 1).map(hour => (
                                    <option key={hour} value={hour}>
                                      {hour} {hour === 1 ? 'Hour' : 'Hours'}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </Col>
                          </Row>
                          
                          {formData.startTime && formData.hourlyDuration && (
                            <div className="selected-time-display mt-3">
                              <div className="alert alert-success">
                                <i className="fa fa-clock"></i> 
                                <strong> Selected Schedule: </strong>
                                {formData.startTime} - {(() => {
                                  const [startHour] = formData.startTime.split(':');
                                  const endHour = (parseInt(startHour) + formData.hourlyDuration) % 24;
                                  return `${endHour.toString().padStart(2, '0')}:00`;
                                })()}
                                <span className="ms-2">({formData.hourlyDuration} {formData.hourlyDuration === 1 ? 'Hour' : 'Hours'})</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Select Options */}
                        <div className="quick-select-options">
                          <h6>Quick Select Common Shifts</h6>
                          <Row>
                            <Col lg="4" md="4">
                              <div className="shift-option-card">
                                <h6>Morning Shifts</h6>
                                <div className="shift-buttons">
                                  {[
                                    { label: "6 AM - 12 PM (6 hrs)", start: "06:00", duration: 6 },
                                    { label: "7 AM - 3 PM (8 hrs)", start: "07:00", duration: 8 },
                                    { label: "8 AM - 4 PM (8 hrs)", start: "08:00", duration: 8 },
                                    { label: "9 AM - 1 PM (4 hrs)", start: "09:00", duration: 4 },
                                  ].map((shift, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      className={`btn btn-outline-primary btn-sm mb-2 me-2 ${
                                        formData.startTime === shift.start && formData.hourlyDuration === shift.duration ? 'active' : ''
                                      }`}
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          startTime: shift.start,
                                          hourlyDuration: shift.duration,
                                          time: `${shift.start} - ${(() => {
                                            const [startHour] = shift.start.split(':');
                                            const endHour = (parseInt(startHour) + shift.duration) % 24;
                                            return `${endHour.toString().padStart(2, '0')}:00`;
                                          })()}`
                                        }));
                                      }}
                                    >
                                      {shift.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </Col>
                            
                            <Col lg="4" md="4">
                              <div className="shift-option-card">
                                <h6>Afternoon Shifts</h6>
                                <div className="shift-buttons">
                                  {[
                                    { label: "12 PM - 6 PM (6 hrs)", start: "12:00", duration: 6 },
                                    { label: "1 PM - 9 PM (8 hrs)", start: "13:00", duration: 8 },
                                    { label: "2 PM - 10 PM (8 hrs)", start: "14:00", duration: 8 },
                                    { label: "3 PM - 7 PM (4 hrs)", start: "15:00", duration: 4 },
                                  ].map((shift, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      className={`btn btn-outline-primary btn-sm mb-2 me-2 ${
                                        formData.startTime === shift.start && formData.hourlyDuration === shift.duration ? 'active' : ''
                                      }`}
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          startTime: shift.start,
                                          hourlyDuration: shift.duration,
                                          time: `${shift.start} - ${(() => {
                                            const [startHour] = shift.start.split(':');
                                            const endHour = (parseInt(startHour) + shift.duration) % 24;
                                            return `${endHour.toString().padStart(2, '0')}:00`;
                                          })()}`
                                        }));
                                      }}
                                    >
                                      {shift.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </Col>
                            
                            <Col lg="4" md="4">
                              <div className="shift-option-card">
                                <h6>Evening/Night Shifts</h6>
                                <div className="shift-buttons">
                                  {[
                                    { label: "6 PM - 12 AM (6 hrs)", start: "18:00", duration: 6 },
                                    { label: "7 PM - 7 AM (12 hrs)", start: "19:00", duration: 12 },
                                    { label: "10 PM - 6 AM (8 hrs)", start: "22:00", duration: 8 },
                                    { label: "11 PM - 7 AM (8 hrs)", start: "23:00", duration: 8 },
                                  ].map((shift, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      className={`btn btn-outline-primary btn-sm mb-2 me-2 ${
                                        formData.startTime === shift.start && formData.hourlyDuration === shift.duration ? 'active' : ''
                                      }`}
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          startTime: shift.start,
                                          hourlyDuration: shift.duration,
                                          time: `${shift.start} - ${(() => {
                                            const [startHour] = shift.start.split(':');
                                            const endHour = (parseInt(startHour) + shift.duration) % 24;
                                            return `${endHour.toString().padStart(2, '0')}:00`;
                                          })()}`
                                        }));
                                      }}
                                    >
                                      {shift.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* Custom Time Input */}
                        <div className="custom-time-input mt-4">
                          <h6>Or Enter Custom Time</h6>
                          <div className="form-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., 09:00 - 17:00 or 8 AM - 5 PM"
                              value={formData.customTime || ""}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                customTime: e.target.value,
                                time: e.target.value
                              }))}
                            />
                            <small className="text-muted">
                              Enter time in format: HH:MM - HH:MM or use AM/PM format
                            </small>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary   justify-content-center align-items-center"
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
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary   justify-content-center align-items-center"
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
                      <ConsultationType
                        formData={formData}
                        onConsultationTypeChange={handleConsultationTypeChange}
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      {loading ? <Spinner size="sm" /> : "Next"}{" "}
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
