import React from "react";
import BookingSummary from "./BookingSummary";
import Breadcrumb from "../Breadcrumb";
import Footer from "../Footer";
import { Plus } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";

export default function PatientDetails() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="back-link">
                <a onClick={() => navigate(-1)}>
                  <i className="fa-solid fa-arrow-left-long"></i> Back
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="paitent-header">
                <h4 className="paitent-title">Patient Details</h4>
              </div>
              <div className="paitent-appointment">
                <form action="#">
                  <div className="forms-block">
                    <label className="form-group-title">Appointment for</label>
                    <label className="custom_radio me-4">
                      <input type="radio" name="appointment" checked="" />
                      <span className="checkmark"></span> My Self
                    </label>
                    <label className="custom_radio">
                      <input type="radio" name="appointment" />
                      <span className="checkmark"></span> Dependent
                    </label>
                  </div>
                  <div className="forms-block">
                    <div className="form-group-flex">
                      <label className="form-group-title">
                        Choose Dependent
                      </label>
                      <a href="javascript:void(0);" className="btn">
                        <Plus /> Add
                      </a>
                    </div>
                    <div className="paitent-dependent-select">
                      <select
                        className="select select2-hidden-accessible form-control"
                        aria-hidden="true"
                      >
                        <option data-select2-id="3">Select</option>
                        <option>Dependent 01</option>
                        <option>Dependent 02</option>
                        <option>Dependent 03</option>
                        <option>Dependent 04</option>
                      </select>
                    </div>
                  </div>
                  <div className="forms-block">
                    <label className="form-group-title">
                      Do you have insurance?
                    </label>
                    <label className="custom_radio me-4">
                      <input type="radio" name="insurance" />
                      <span className="checkmark"></span> Yes
                    </label>
                    <label className="custom_radio">
                      <input type="radio" name="insurance" checked="" />
                      <span className="checkmark"></span> No
                    </label>
                  </div>
                  <div className="forms-block">
                    <label className="form-group-title">Reason</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Your Reason"
                    ></textarea>
                    <p className="characters-text">400 Characters</p>
                  </div>
                  <div className="forms-block">
                    <label className="form-group-title d-flex align-items-center">
                      <i className="fa fa-paperclip me-2"></i> Attachment
                    </label>
                    <div className="attachment-box">
                      <div className="attachment-img">
                        <div className="attachment-icon">
                          <i className="feather-image"></i>
                        </div>
                        <div className="attachment-content">
                          <p>Skin Allergy Image</p>
                          <span>12.30 mb</span>
                        </div>
                      </div>
                      <div className="attachment-close">
                        <a href="javascript:void(0);">
                          <i className="feather-x"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="forms-block">
                    <label className="form-group-title">
                      Symtoms <span>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Skin Allergy"
                    />
                  </div>
                  <div className="forms-block mb-0">
                    <div className="booking-btn">
                      <Link
                        to="/ConsultationType"
                        className="btn btn-primary prime-btn justify-content-center align-items-center"
                      >
                        Next <i className="feather-arrow-right-circle"></i>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <BookingSummary />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
