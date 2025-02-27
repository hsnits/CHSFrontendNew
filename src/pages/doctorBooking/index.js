import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";

import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Container, Card, CardBody } from "react-bootstrap";
import BookingSummary from "../../components/doctorBooking/BookingSummary";
import { ArrowDownRight } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointment,
  updateAppointment,
} from "../../redux/slices/patientApi";
import DatePicker from "react-datepicker";
import { toastMessage } from "../../config/toast";
import PatientDetails from "./patientDetails";
import ConsultationType from "./consultationType";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { uploadFile } from "../../redux/slices/userApi";
const formatDate = (date) => date.toISOString().split("T")[0];

export default function DoctorBooking() {
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
    appointmentType: "chat",
    isInsurance: false,
  });

  const [step, setStep] = useState(1);

  const data = useSelector(
    (state) =>
      state.PATIENT.data?.user?.getAppointmentResult ||
      state.PATIENT.data?.user?.createAppointmentResult
  );

  useEffect(() => {
    dispatch(getAppointment(id));
    console.log(id, "id Booking Summary");
  }, [dispatch, id]);

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date: date }));
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

  const validateStep1 = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const selectedDateOnly = new Date(formData.date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isPastDate = formData.date < currentDate;

    if (isPastDate) {
      toastMessage("error", "Selected date cannot be in the past.");
      return false;
    }

    if (!formData.time) {
      toastMessage("error", "Please select a time slot.");
      return false;
    }

    return true;
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
        const formData = new FormData();

        formData.append("file", file);

        setFormData((prev) => ({ ...prev, attachment: formData }));
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

  const handleConsultationTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, appointmentType: type }));
  };

  const validateStep2 = () => {
    if (!formData.reason) {
      toastMessage("error", "Please provide the reason for the appointment.");
      return false;
    }

    if (!formData.symptoms) {
      toastMessage("error", "Please describe your symptoms.");
      return false;
    }

    if (!formData.attachment) {
      toastMessage("error", "Please upload attachment.");
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
      console.log(formData);
      if (step === 3) {
        dispatch(uploadFile(formData?.attachment)).then((res) => {
          if (res?.meta?.requestStatus === "fulfilled") {
            const formattedData = {
              ...formData,
              refDoctor: data?.refDoctor?._id,
              id: getAppointmentId?.appointment_id,
              appointmentFor: formData?.isMySelf ? "" : formData?.dependent,
              attachment: res?.payload?.file,
            };
            dispatch(updateAppointment(formattedData)).then((res) => {
              if (res?.meta?.requestStatus === "fulfilled") {
                navigate("/BookingSuccess");
              }
            });
          }
        });
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content content-space">
        <Container>
          <Row>
            {step > 1 && (
              <div className="row">
                <div className="col-md-12">
                  <div className="back-link">
                    <a onClick={handleBack}>
                      <i className="fa-solid fa-arrow-left-long"></i> Back
                    </a>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <Col lg="8" md="12">
                  <div className="booking-header">
                    <h4 className="booking-title">Select Available Slots</h4>
                  </div>

                  <div className="booking-date choose-date-book">
                    <p>Choose Date</p>
                    <div className="booking-range">
                      <DatePicker
                        selected={formData.date}
                        onChange={handleDateChange}
                        dateFormat="MMMM d, yyyy"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body">
                      <Row>
                        <Col lg="4" md="4">
                          <div className="time-slot time-slot-blk">
                            <h4>Morning</h4>
                            <div className="time-slot-list">
                              <ul>
                                {/* Replace static times with dynamic time slots */}
                                {[
                                  "10:00 - 10:30",
                                  "10:30 - 11:30",
                                  "11:00 - 11:30",
                                ].map((time) => (
                                  <li key={time}>
                                    <a
                                      className={`timing ${
                                        formData.time === time ? "active" : ""
                                      }`}
                                      href="javascript:void(0);"
                                      onClick={() => handleTimeSelect(time)}
                                    >
                                      <span>
                                        <i className="feather-clock"></i> {time}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                                {/* <li>
                              <div className="load-more-timings load-more-morning">
                                <a href="javascript:void(0);">Load More</a>
                              </div>
                            </li> */}
                              </ul>
                            </div>
                          </div>
                        </Col>

                        {/* Repeat the above logic for Afternoon and Evening */}
                        {/* Afternoon */}
                        <Col lg="4" md="4">
                          <div className="time-slot time-slot-blk">
                            <h4>Afternoon</h4>
                            <div className="time-slot-list">
                              <ul>
                                {[
                                  "12:00 - 12:30",
                                  "01:00 - 01:30",
                                  "02:30 - 03:00",
                                ].map((time) => (
                                  <li key={time}>
                                    <a
                                      className={`timing ${
                                        formData.time === time ? "active" : ""
                                      }`}
                                      href="javascript:void(0);"
                                      onClick={() => handleTimeSelect(time)}
                                    >
                                      <span>
                                        <i className="feather-clock"></i> {time}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Col>

                        {/* Evening */}
                        <Col lg="4" md="4">
                          <div className="time-slot time-slot-blk">
                            <h4>Evening</h4>
                            <div className="time-slot-list">
                              <ul>
                                {[
                                  "03:00 - 03:30",
                                  "04:00 - 04:30",
                                  "05:00 - 05:30",
                                ].map((time) => (
                                  <li key={time}>
                                    <a
                                      className={`timing ${
                                        formData.time === time ? "active" : ""
                                      }`}
                                      href="javascript:void(0);"
                                      onClick={() => handleTimeSelect(time)}
                                    >
                                      <span>
                                        <i className="feather-clock"></i> {time}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary prime-btn justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={data?.refDoctor} />
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
                      className="btn btn-primary prime-btn justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={data?.refDoctor} />
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
                      className="btn btn-primary prime-btn justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={data?.refDoctor} />
              </>
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}
