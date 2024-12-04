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
import { getAppointment } from "../../redux/slices/patientApi";
import DatePicker from "react-datepicker";
import { toastMessage } from "../../config/toast";
import PatientDetails from "./patientDetails";
import ConsultationType from "./consultationType";

export default function DoctorBooking() {
  // Appointment ID
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1); // Track the current step

  console.log(selectedDate, "s date");
  console.log(selectedTime, "s time");
  const data = useSelector(
    (state) => state.PATIENT.data?.user?.getAppointmentResult
  );

  useEffect(() => {
    dispatch(getAppointment(id));
  }, [dispatch, id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const validateForm = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isPastDate = selectedDate < currentDate;

    if (isPastDate) {
      toastMessage("error", "Selected date cannot be in the past.");
      return false;
    }

    if (!selectedTime) {
      toastMessage("error", "Please select a time slot.");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setStep(step + 1);
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
                        selected={selectedDate}
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
                                        selectedTime === time ? "active" : ""
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
                                        selectedTime === time ? "active" : ""
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
                                        selectedTime === time ? "active" : ""
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
                      <PatientDetails />
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
                      <ConsultationType />
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
