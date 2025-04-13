import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { callPostApi } from "../../../_service";
import { Upload, X, CheckCircle } from "lucide-react";
import "./callSuccess.css";

const AppointmentFormModal = ({ appointmentId, onClose, onSubmit }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      testName: "",
      reason: "",
      testDate: new Date().toISOString().substr(0, 10),
      testComments: "",
      testStatus: "Normal",
      prescriptionFile: null,
    },
    validationSchema: Yup.object({
      testName: Yup.string().required("Test name is required"),
      reason: Yup.string().required("Reason is required"),
      testDate: Yup.date().required("Date is required"),
      testComments: Yup.string().required("Test comments are required"),
      testStatus: Yup.string().oneOf(["Normal", "High"]).required("Test status is required"),
      prescriptionFile: Yup.mixed(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Handle file upload first if there's a file
        let prescriptionFileUrl = null;
        if (values.prescriptionFile) {
          const formData = new FormData();
          formData.append("file", values.prescriptionFile);
          
          // Assuming you have an endpoint for file uploads
          const fileUploadResponse = await callPostApi("upload/prescription", formData);
          prescriptionFileUrl = fileUploadResponse.fileUrl;
        }

        // Update appointment with completed status and prescription details
        await callPostApi(`appointment/${appointmentId}`, {
          status: "Completed",
          testName: values.testName,
          reason: values.reason,
          prescriptionDate: values.testDate,
          comments: values.testComments,
          testStatus: values.testStatus,
          prescriptionFile: prescriptionFileUrl || null,
        });

        // Notify parent component
        onSubmit(values);
      } catch (error) {
        console.error("Error submitting appointment details:", error);
        alert("Failed to submit appointment details. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
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

  const removeFile = () => {
    formik.setFieldValue("prescriptionFile", null);
    setFilePreview(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Complete Appointment</h2>
          <button className="close-button" onClick={onClose}>×</button>
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
                <div className="error-message">{formik.errors.testComments}</div>
              ) : null}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="testStatus">Test Status</label>
                <select
                  id="testStatus"
                  name="testStatus"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.testStatus}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
                {formik.touched.testStatus && formik.errors.testStatus ? (
                  <div className="error-message">{formik.errors.testStatus}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="prescriptionFile">Prescription File</label>
                <div className="file-upload-container">
                  <input
                    id="prescriptionFile"
                    name="prescriptionFile"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                  />
                  <label htmlFor="prescriptionFile" className="file-upload-button">
                    <Upload size={16} />
                    <span>Upload Prescription</span>
                  </label>
                  
                  {filePreview && (
                    <div className="file-preview">
                      <div className="file-preview-name">
                        {formik.values.prescriptionFile.name}
                      </div>
                      <button type="button" onClick={removeFile} className="remove-file-btn">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Complete Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFormModal;