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

export default function ConsultationType() {
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
                    <div className="consultation-types active">
                      <a href="javascript:void(0);">
                        <Video /> &nbsp; Video Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="consultation-types">
                      <a href="javascript:void(0);">
                        <Mic /> &nbsp; Audio Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="consultation-types">
                      <a href="javascript:void(0);">
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
              <p>Home Visit</p>
              <div className="consultation-list">
                <ul>
                  <li>
                    <div className="consultation-types">
                      <a href="javascript:void(0);">
                        <Home /> &nbsp; Home Visit
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="consultation-types">
                      <a href="javascript:void(0);">
                        <User /> &nbsp; Consult Instatly
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* <div className="booking-btn">
                <Link
                  to="/BookingSuccess"
                  className="btn btn-primary prime-btn justify-content-center align-items-center"
                >
                  Next <i className="feather-arrow-right-circle"></i>
                </Link>
              </div> */}
        </div>
      </div>
    </>
  );
}
