import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { callPostApi, callPutApi } from "../../../_service";
import { Upload, X, CheckCircle } from "lucide-react";
import "./callSuccess.css";
import { toastMessage } from "../../../config/toast";

const AppointmentFormModal = ({ appointmentId, onClose, onSubmit }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      testName: "",
      reason: "",
      testDate: new Date().toISOString().substr(0, 10),
      testComments: "",
      healthStatus: "Normal",
      prescriptionText: "",
      prescriptionFile: null,
    },
    validationSchema: Yup.object({
      testName: Yup.string().required("Test name is required"),
      reason: Yup.string().required("Reason is required"),
      testDate: Yup.date().required("Date is required"),
      testComments: Yup.string().required("Test comments are required"),
      healthStatus: Yup.string()
        .oneOf(["Normal", "High", "Low", "Medium"])
        .required("Test status is required"),
      prescriptionText: Yup.string().nullable(),
      prescriptionFile: Yup.mixed()
        .nullable()
        .test("fileSize", "File size is too large", (value) => {
          if (!value) return true; // File is optional
          return value.size <= 5242880; // 5MB
        })
        .test("fileType", "Unsupported file type", (value) => {
          if (!value) return true; // File is optional
          return [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
          ].includes(value.type);
        }),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Handle file upload first if there's a file
        let prescriptionFileUrl = null;
        let prescriptionFileKey = null;

        if (values.prescriptionFile) {
          const formData = new FormData();
          formData.append("file", values.prescriptionFile);

          toastMessage("success", "Prescription report is uploading...");
          // ✅ Upload File
          const fileUploadResponse = await callPostApi(
            "user/upload-file",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (!fileUploadResponse?.data?.location) {
            throw new Error("Invalid response from server.");
          }

          prescriptionFileUrl = fileUploadResponse?.data?.location;
          prescriptionFileKey = fileUploadResponse?.data?.key;
        }
        // Update appointment with completed status and prescription details
        let res = await callPutApi(`patient/appointment/${appointmentId}`, {
          status: "Completed",
          testName: values.testName,
          reason: values.reason,
          prescriptionDate: values.testDate,
          comments: values.testComments,
          healthStatus: values.healthStatus,
          prescriptionText: values.prescriptionText,
          prescriptionFile: prescriptionFileUrl || null,
          prescriptionFileKey: prescriptionFileKey || null,
        });

        // Notify parent component
        if (!res?.status) {
          toastMessage("error", "Test report submission error!");
          return;
        }
        formik.resetForm();
        onSubmit(values);
      } catch (error) {
        console.error("Error submitting appointment details:", error);
        toastMessage("Failed to submit appointment details. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("prescriptionFile", file);

      // Create a preview URL for the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    formik.setFieldValue("prescriptionFile", null);
    setFilePreview(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Complete Appointment</h2>
          {/* <button className="close-button" onClick={onClose}>
            ×
          </button> */}
        </div>

        <div className="modal-body">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="testName">Test Name</label>
                <input
                  id="testName"
                  name="testName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.testName}
                  placeholder="Enter test name"
                />
                {formik.touched.testName && formik.errors.testName ? (
                  <div className="error-message">{formik.errors.testName}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="testDate">Date</label>
                <input
                  id="testDate"
                  name="testDate"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.testDate}
                />
                {formik.touched.testDate && formik.errors.testDate ? (
                  <div className="error-message">{formik.errors.testDate}</div>
                ) : null}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <input
                id="reason"
                name="reason"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reason}
                placeholder="Enter reason for appointment"
              />
              {formik.touched.reason && formik.errors.reason ? (
                <div className="error-message">{formik.errors.reason}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="testComments">Test Comments</label>
              <textarea
                id="testComments"
                name="testComments"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.testComments}
                placeholder="Enter test comments and observations"
                rows="3"
              />
              {formik.touched.testComments && formik.errors.testComments ? (
                <div className="error-message">
                  {formik.errors.testComments}
                </div>
              ) : null}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="healthStatus">Health Status</label>
                <select
                  id="healthStatus"
                  name="healthStatus"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.healthStatus}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {formik.touched.healthStatus && formik.errors.healthStatus ? (
                  <div className="error-message">
                    {formik.errors.healthStatus}
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="prescriptionFile">
                  Prescription File (Optional)
                </label>
                <div className="file-upload-container">
                  <input
                    id="prescriptionFile"
                    name="prescriptionFile"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="prescriptionFile"
                    className="file-upload-button"
                  >
                    <Upload size={16} />
                    <span>Upload Prescription (PDF/Image)</span>
                  </label>
                  {filePreview && (
                    <div className="file-preview">
                      <div className="file-preview-name">
                        {formik.values.prescriptionFile.name}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="remove-file-btn"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <small className="text-muted">
                  Supported formats: PDF, JPG, JPEG, PNG
                </small>
                {formik.touched.prescriptionFile &&
                formik.errors.prescriptionFile ? (
                  <div className="error-message">
                    {formik.errors.prescriptionFile}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prescriptionText">Prescription Text</label>
                <textarea
                  id="prescriptionText"
                  name="prescriptionText"
                  value={formik.values.prescriptionText || ""}
                  onChange={formik.handleChange}
                  className="form-control"
                  rows="4"
                  placeholder="Enter prescription details here..."
                />
              </div>
            </div>
            <div className="form-actions">
              {/* <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button> */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFormModal;
