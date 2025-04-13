import React from "react";
import { CheckCircle, ArrowLeft, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./callSuccess.css";

const AppointmentSuccessModal = ({ isDoctor, appointmentId, onClose }) => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (isDoctor) {
      navigate("/DoctorDashboard?key=first", { replace: true });
    } else {
      navigate("/patient", { replace: true });
    }
  };

  const goBack = () => {
    if (isDoctor) {
      navigate("/DoctorDashboard?key=fourth", { replace: true });
    } else {
      navigate("/patient?key=second", { replace: true });
    }
  };

  return (
    <div className="modal-overlay success-overlay">
      <div className="success-modal">
        <div className="success-icon">
          <CheckCircle size={60} color="#4CAF50" strokeWidth={1.5} />
        </div>

        <h2 className="success-title">Appointment Completed</h2>

        {isDoctor ? (
          <p className="success-message">
            You have successfully completed the appointment. The patient has
            been notified and the prescription details have been saved.
          </p>
        ) : (
          <p className="success-message">
            Your appointment has been successfully completed. You can view the
            prescription and details in your appointments history.
          </p>
        )}

        <div className="appointment-id">
          <span>Appointment ID:</span> {appointmentId}
        </div>

        <div className="success-buttons">
          <button className="back-btn" onClick={goBack}>
            <ArrowLeft size={18} />
            <span>Back to Appointments</span>
          </button>
          <button className="dashboard-btn" onClick={goToDashboard}>
            <LayoutDashboard size={18} />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessModal;
