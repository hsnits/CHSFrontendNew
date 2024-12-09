import React, { useEffect } from "react";
import {
  ArrowLeft,
  Home,
  MapPin,
  MessageCircle,
  Mic,
  Video,
} from "react-feather";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getAppointment } from "../../redux/slices/patientApi";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BookingSuccess() {
  const data = useSelector(
    (state) => state?.PATIENT?.data?.user?.getAppointmentResult
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getAppointmentId = getLocalStorage(STORAGE.APPOINTMENT_KEY);

  useEffect(() => {
    dispatch(getAppointment(getAppointmentId?.appointment_id));
  }, []);

  const getConsultationType = (type) => {
    switch (type) {
      case "video":
        return (
          <>
            <Video size={15} /> Video Consulting
          </>
        );
      case "audio":
        return (
          <>
            <Mic size={15} /> Audio Consulting
          </>
        );
      case "chat":
        return (
          <>
            <MessageCircle size={15} /> Chat Consulting
          </>
        );
      case "home":
        return (
          <>
            <Home size={15} /> Home Visit
          </>
        );
      case "instant":
        return (
          <>
            <Home size={15} /> Consult Instantly
          </>
        );
      default:
        return (
          <>
            <Home size={15} /> Consult Instantly
          </>
        );
    }
  };
  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="back-link">
                <a href="/ConsultationType">
                  <ArrowLeft /> Back
                </a>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="success-content">
                <div className="success-icon">
                  <i className="fas fa-circle-check"></i>
                </div>
                <h4>Your Appointment Booked Succesfully</h4>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body booking-list-body">
                  <div className="booking-doctor-left booking-success-info">
                    <div className="booking-doctor-img">
                      <img src={user_img} alt="Dr name" className="img-fluid" />
                    </div>
                    <div className="booking-doctor-info">
                      <h4>Dr. {data?.refDoctor?.firstName}</h4>
                      <p>
                        {data?.refDoctor?.achievement},
                        {data?.refDoctor?.designation}
                      </p>
                      <p>{data?.refDoctor?.address}</p>
                    </div>
                  </div>
                  <div className="booking-list">
                    <div className="booking-date-list consultation-date-list">
                      <ul>
                        <li>
                          Booking Date: <span>{formatDate(data?.date)}</span>
                        </li>
                        <li>
                          Booking Time: <span>{data?.time}</span>
                        </li>
                        <li>
                          Type of Consultaion:{" "}
                          <span>
                            {getConsultationType(data?.appointmentType)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="success-btn">
                <Link
                  to="javascript:void(0);"
                  className="btn btn-primary prime-btn"
                >
                  Add to Google Calendar
                </Link>
                <div
                  onClick={() => navigate("/patient")}
                  className="btn btn-light"
                >
                  Appointment
                </div>
              </div>
              <div className="success-dashboard-link">
                <Link to="/">
                  <i className="fa-solid fa-arrow-left-long"></i> Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
