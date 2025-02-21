import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { callPostApi, callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";

const validationSchema = Yup.object().shape({
  heartRate: Yup.number()
    .min(30, "Heart rate should be at least 30 bpm")
    .max(200, "Heart rate should not exceed 200 bpm")
    .required("Heart rate is required"),

  bodyTemperature: Yup.number()
    .min(30, "Body temperature should be at least 30°C")
    .max(45, "Body temperature should not exceed 45°C")
    .required("Body temperature is required"),

  glucoseLevel: Yup.number()
    .min(50, "Glucose level should be at least 50 mg/dL")
    .max(500, "Glucose level should not exceed 500 mg/dL")
    .required("Glucose level is required"),

  spo2: Yup.number()
    .min(50, "SpO2 should be at least 50%")
    .max(100, "SpO2 should not exceed 100%")
    .required("SpO2 level is required"),

  bloodPressure: Yup.string().required("Blood pressure is required"),

  bmi: Yup.number()
    .required("BMI is required")
    .min(10, "BMI should be at least 10")
    .max(50, "BMI should not exceed 50"),
});

const EditReport = ({ isOpen, onClose, reportData, refreshData, userId }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      heartRate: reportData?.heartRate || "",
      bodyTemperature: reportData?.bodyTemperature || "",
      glucoseLevel: reportData?.glucoseLevel || "",
      spo2: reportData?.spo2 || "",
      bloodPressure: reportData?.bloodPressure || "",
      bmi: reportData?.bmi || "",
      lastVisit: reportData?.lastVisit || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await callPutApi(
          `/patient/update-health-report/${userId}`,
          values
        );
        if (response?.status) {
          toastMessage("success", "Health report updated successfully");
          refreshData();
          onClose();
        } else {
          toastMessage("error", "Failed to update report");
        }
      } catch (error) {
        console.error("Error updating report:", error);
        toastMessage("error", "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  const closeModel = () => {
    onClose();
    setLoading(false);
    formik.resetForm();
  };

  return (
    <Modal
      show={isOpen == "add" || isOpen == "edit"}
      onHide={closeModel}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isOpen == "add" ? "Add Health Report" : "Update Health Report"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Heart Rate (Bpm)</Form.Label>
            <Form.Control
              type="number"
              name="heartRate"
              value={formik.values.heartRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.heartRate && !!formik.errors.heartRate}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.heartRate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Body Temperature (°C)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              name="bodyTemperature"
              value={formik.values.bodyTemperature}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.bodyTemperature &&
                !!formik.errors.bodyTemperature
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.bodyTemperature}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Glucose Level</Form.Label>
            <Form.Control
              type="number"
              name="glucoseLevel"
              value={formik.values.glucoseLevel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.glucoseLevel && !!formik.errors.glucoseLevel
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.glucoseLevel}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>SpO2 (%)</Form.Label>
            <Form.Control
              type="number"
              name="spo2"
              value={formik.values.spo2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.spo2 && !!formik.errors.spo2}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.spo2}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Blood Pressure (SYS/DIA)</Form.Label>
            <Form.Control
              type="text"
              name="bloodPressure"
              value={formik.values.bloodPressure}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.bloodPressure && !!formik.errors.bloodPressure
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.bloodPressure}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>BMI</Form.Label>
            <Form.Control
              type="number"
              name="bmi"
              value={formik.values.bmi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.bmi && !!formik.errors.bmi}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.bmi}
            </Form.Control.Feedback>
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>Last Visit</Form.Label>
            <Form.Control
              type="date"
              name="lastVisit"
              value={formik.values.lastVisit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.lastVisit && !!formik.errors.lastVisit}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.lastVisit}
            </Form.Control.Feedback>
          </Form.Group> */}

          {/* Buttons */}
          <div className="d-flex justify-content-end ">
            <Button
              className="mr-3"
              variant="secondary"
              onClick={closeModel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : isOpen == "add" ? (
                "Add Report"
              ) : (
                "Update Report"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditReport;
