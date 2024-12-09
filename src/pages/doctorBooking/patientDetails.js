import React, { useState } from "react";
import { Plus } from "react-feather";
import { Link, useNavigate } from "react-router-dom";

export default function PatientDetails({
  formData,
  setFormData,
  onAppointmentChange,
  onFileChange,
  onReasonChange,
  onSymptomsChange,
  onInsuranceChange,
}) {
  return (
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
                <input
                  type="radio"
                  name="appointment"
                  value="myself"
                  checked={formData.isMySelf}
                  onChange={onAppointmentChange}
                />
                <span className="checkmark"></span> My Self
              </label>
              <label className="custom_radio">
                <input
                  type="radio"
                  name="appointment"
                  value="dependent"
                  checked={!formData.isMySelf}
                  onChange={onAppointmentChange}
                />
                <span className="checkmark"></span> Dependent
              </label>
            </div>

            {!formData.isMySelf && (
              <div className="forms-block">
                <div className="form-group-flex">
                  <label className="form-group-title">Choose Dependent</label>
                  <a href="javascript:void(0);" className="btn">
                    <Plus /> Add
                  </a>
                </div>
                <div className="paitent-dependent-select">
                  <select
                    className="select select2-hidden-accessible form-control"
                    aria-hidden="true"
                    value={formData.dependent}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        dependent: e.target.value,
                      }));
                    }}
                  >
                    <option data-select2-id="3">Select</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Wife</option>
                    <option>Children</option>
                    <option>Cousin</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            )}

            <div className="forms-block">
              <label className="form-group-title">Do you have insurance?</label>
              <label className="custom_radio me-4">
                <input
                  type="radio"
                  name="insurance"
                  value="yes"
                  checked={formData.isInsurance}
                  onChange={onInsuranceChange}
                />
                <span className="checkmark"></span> Yes
              </label>
              <label className="custom_radio">
                <input
                  type="radio"
                  name="insurance"
                  value="no"
                  checked={!formData.isInsurance}
                  onChange={onInsuranceChange}
                />
                <span className="checkmark"></span> No
              </label>
            </div>
            <div className="forms-block">
              <label className="form-group-title">Reason</label>
              <textarea
                className="form-control"
                placeholder="Enter Your Reason"
                value={formData.reason}
                onChange={onReasonChange}
              ></textarea>
              <p className="characters-text">400 Characters</p>
            </div>
            <div className="forms-block">
              <label className="form-group-title d-flex align-items-center">
                <i className="fa fa-paperclip me-2"></i> Attachment
              </label>
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg, application/pdf"
                onChange={onFileChange}
                className="form-control"
              />
              {formData.attachment && formData.attachment.type && (
                <div className="attachment-img">
                  <div className="attachment-icon">
                    {formData.attachment.type.includes("image") ? (
                      <i className="feather-image"></i>
                    ) : (
                      <i className="feather-file"></i>
                    )}
                  </div>
                  {/* <div className="attachment-content">
                    <p>{formData.attachment.name}</p>
                    <span>
                      {(formData.attachment.size / 1024).toFixed(2)} KB
                    </span>
                  </div> */}
                  <div className="attachment-close">
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          attachment: null,
                        }));
                      }}
                    >
                      <i className="feather-x"></i>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="forms-block">
              <label className="form-group-title">
                Symptoms <span>(Optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Skin Allergy"
                value={formData.symptoms}
                onChange={onSymptomsChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
