import React from "react";
import BookingSummary from "../../components/doctorBooking/BookingSummary";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import {
  ArrowLeft,
  Home,
  MessageCircle,
  Mic,
  User,
  Video,
} from "react-feather";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

export default function ConsultationType({
  formData,
  onConsultationTypeChange,
}) {
  return (
    <>
      <div className="row">
        <div className="col-lg-8 col-md-6">
          <div className="paitent-header">
            <h4 className="paitent-title">Type of Consultation</h4>
          </div>
          <div className="consultation-grid">
            <div className="consultation-info">
              <p>Online Consultation</p>
              <div className="consultation-list">
                <ul>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "video" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("video")}
                    >
                      <a href="#">
                        <Video /> &nbsp; Video Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "audio" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("audio")}
                    >
                      <a href="#">
                        <Mic /> &nbsp; Audio Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "chat" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("chat")}
                    >
                      <a href="#">
                        <MessageCircle /> &nbsp; Chat Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="consultation-info">
              {/* <p>Home Visit</p>
              <div
                className={`consultation-types ${
                  formData.appointmentType === "home" ? "active" : ""
                }`}
                onClick={() => onConsultationTypeChange("home")}
              >
                <ul>
                  <li>
                    <div className="consultation-types">
                      <a href="#">
                        <Home /> &nbsp; Home Visit
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div> */}
              {/* <ul>
                <li>
                  <div
                    className={`consultation-types ${
                      formData.appointmentType === "instant" ? "active" : ""
                    }`}
                    onClick={() => onConsultationTypeChange("instant")}
                  >
                    <a href="#">
                      <User /> &nbsp; Consult Instantly
                    </a>
                    <span>
                      <i className="fas fa-circle-check"></i>
                    </span>
                  </div>
                </li>
              </ul> */}
            </div>
          </div>
          {/* <div className="booking-btn">
                <Link
                  to="/BookingSuccess"
                  className="btn btn-primary   justify-content-center align-items-center"
                >
                  Next <i className="feather-arrow-right-circle"></i>
                </Link>
              </div> */}
        </div>
      </div>
    </>
  );
}
