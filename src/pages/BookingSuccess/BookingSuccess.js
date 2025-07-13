import React, { useEffect } from "react";
import {
  ArrowLeft,
  Home,
  MapPin,
  MessageCircle,
  Mic,
  Video,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
} from "react-feather";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const formatTime = (timeString) => {
  if (!timeString) return "Not specified";
  
  // Handle 24-hour format (HH:MM)
  if (timeString.includes(":") && timeString.length === 5) {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  
  return timeString;
};

const getBookingTypeDisplay = (bookingType) => {
  switch (bookingType) {
    case "single":
      return "Single Day";
    case "multiple":
      return "Multiple Days";
    case "recurring":
      return "Recurring";
    default:
      return "Single Day";
  }
};

const getRecurringPatternDisplay = (pattern) => {
  switch (pattern) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "biweekly":
      return "Bi-weekly";
    case "monthly":
      return "Monthly";
    default:
      return pattern;
  }
};

export default function BookingSuccess() {
  const location = useLocation();
  const type = location.state?.type || "doctor"; // Default to doctor if no type specified
  
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
    switch (type?.toLowerCase()) {
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
      case "consult":
        return (
          <>
            <Home size={15} /> Consult
          </>
        );
      case "lab":
        return (
          <>
            <MapPin size={15} /> Lab Visit
          </>
        );
      case "home collection":
        return (
          <>
            <Home size={15} /> Home Collection
          </>
        );
      default:
        return (
          <>
            <MessageCircle size={15} /> {type || "Consultation"}
          </>
        );
    }
  };

  // Get the correct professional data based on type
  const professionalData = type === "nurse" 
    ? (data?.refNurse || data?.nurse)
    : type === "pathology"
    ? (data?.refPathology || data?.pathology)
    : (data?.refDoctor || data?.doctor);

  const professionalTitle = type === "nurse" ? "Nurse" : type === "pathology" ? "Lab" : "Dr.";
  const listPageLink = type === "nurse" ? "/NurseProfile" : type === "pathology" ? "/pathologyprofile" : "/doctorList";
  const listPageText = type === "nurse" ? "Back to Nurses" : type === "pathology" ? "Back to Labs" : "Back to Doctors";

  return (
    <>
      <style jsx>{`
        .booking-receipt {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .receipt-header {
          background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .receipt-header h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .receipt-header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        .receipt-body {
          padding: 30px;
        }
        .professional-info {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fc;
          border-radius: 8px;
          border-left: 4px solid #4e73df;
        }
        .professional-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 20px;
          object-fit: cover;
        }
        .professional-details h4 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 20px;
        }
        .professional-details p {
          margin: 2px 0;
          color: #6c757d;
          font-size: 14px;
        }
        .booking-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .detail-card {
          background: #f8f9fc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #1cc88a;
        }
        .detail-card h6 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-card p {
          margin: 0;
          color: #495057;
          font-size: 16px;
          font-weight: 500;
        }
        .detail-card .icon {
          margin-right: 8px;
          color: #1cc88a;
        }
        .status-alert {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
        }
        .status-alert .icon {
          margin-right: 15px;
          color: #28a745;
        }
        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }
        .actions .btn {
          padding: 12px 30px;
          font-weight: 600;
          border-radius: 25px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .actions .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .receipt-footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #eee;
          color: #6c757d;
        }
        .back-home {
          text-align: center;
          margin-top: 20px;
        }
        .back-home a {
          color: #6c757d;
          text-decoration: none;
          font-size: 14px;
        }
        .back-home a:hover {
          color: #4e73df;
        }
      `}</style>
      <Header />
      <Breadcrumb />
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="back-link">
                <a href="#" onClick={() => navigate(-1)}>
                  <ArrowLeft /> Back
                </a>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="booking-receipt">
                <div className="receipt-header">
                  <div className="success-icon mb-3">
                    <CheckCircle size={48} />
                  </div>
                  <h3>Booking Confirmed!</h3>
                  <p>Your {type === "nurse" ? "nursing care" : type === "pathology" ? "lab test" : "appointment"} request has been submitted successfully</p>
                </div>

                <div className="receipt-body">
                  <div className="status-alert">
                    <CheckCircle size={24} className="icon" />
                    <div>
                      <strong>Request Submitted Successfully!</strong>
                      <br />
                      Once approved, we will let you know via email and SMS notification.
                    </div>
                  </div>

                  <div className="professional-info">
                    <img 
                      src={type === "pathology" ? (professionalData?.coverImage || user_img) : (professionalData?.profilePicture || user_img)} 
                      alt={`${professionalTitle} ${type === "pathology" ? professionalData?.labName : professionalData?.firstName}`}
                      className="professional-avatar"
                    />
                    <div className="professional-details">
                      <h4>
                        {type === "pathology" 
                          ? professionalData?.labName || `${professionalData?.firstName} ${professionalData?.lastName}` 
                          : `${professionalTitle} ${professionalData?.firstName} ${professionalData?.lastName}`
                        }
                      </h4>
                      {professionalData?.achievement && (
                        <p><strong>Qualification:</strong> {professionalData?.achievement}</p>
                      )}
                      {professionalData?.designation && (
                        <p><strong>Designation:</strong> {professionalData?.designation}</p>
                      )}
                      {professionalData?.experience && (
                        <p><strong>Experience:</strong> {professionalData?.experience} years</p>
                      )}
                      {professionalData?.address && (
                        <p><MapPin size={14} /> {professionalData?.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-card">
                      <h6><Calendar className="icon" />Booking Type</h6>
                      <p>{getBookingTypeDisplay(data?.bookingType)}</p>
                    </div>

                    <div className="detail-card">
                      <h6><Calendar className="icon" />Start Date</h6>
                      <p>{formatDate(data?.date)}</p>
                    </div>

                    {data?.endDate && (
                      <div className="detail-card">
                        <h6><Calendar className="icon" />End Date</h6>
                        <p>{formatDate(data?.endDate)}</p>
                      </div>
                    )}

                    {data?.bookingType === "multiple" && data?.duration && (
                      <div className="detail-card">
                        <h6><Calendar className="icon" />Duration</h6>
                        <p>{data?.duration} {data?.duration === 1 ? 'Day' : 'Days'}</p>
                      </div>
                    )}

                    {data?.bookingType === "recurring" && (
                      <>
                        <div className="detail-card">
                          <h6><Calendar className="icon" />Pattern</h6>
                          <p>{getRecurringPatternDisplay(data?.recurringPattern)}</p>
                        </div>
                        <div className="detail-card">
                          <h6><Calendar className="icon" />Sessions</h6>
                          <p>{data?.duration} {data?.duration === 1 ? 'Session' : 'Sessions'}</p>
                        </div>
                      </>
                    )}

                    {data?.time && (
                      <div className="detail-card">
                        <h6><Clock className="icon" />Time</h6>
                        <p>{data?.time}</p>
                      </div>
                    )}

                    {data?.startTime && (
                      <div className="detail-card">
                        <h6><Clock className="icon" />Start Time</h6>
                        <p>{formatTime(data?.startTime)}</p>
                      </div>
                    )}

                    {data?.endTime && (
                      <div className="detail-card">
                        <h6><Clock className="icon" />End Time</h6>
                        <p>{formatTime(data?.endTime)}</p>
                      </div>
                    )}

                    {data?.hourlyDuration && (
                      <div className="detail-card">
                        <h6><Clock className="icon" />Shift Duration</h6>
                        <p>{data?.hourlyDuration} {data?.hourlyDuration === 1 ? 'Hour' : 'Hours'}</p>
                      </div>
                    )}

                    <div className="detail-card">
                      <h6><MessageCircle className="icon" />Consultation Type</h6>
                      <p>{getConsultationType(data?.appointmentType)}</p>
                    </div>

                    <div className="detail-card">
                      <h6><User className="icon" />Patient</h6>
                      <p>{data?.appointmentFor === "Dependent" ? data?.appointmentPersonName : "Self"}</p>
                    </div>

                    {data?.testName && (
                      <div className="detail-card">
                        <h6><FileText className="icon" />Test Name</h6>
                        <p>{data?.testName}</p>
                      </div>
                    )}

                    {data?.reason && (
                      <div className="detail-card">
                        <h6><FileText className="icon" />{type === "nurse" ? "Care Needed" : type === "pathology" ? "Test Reason" : "Reason"}</h6>
                        <p>{data?.reason}</p>
                      </div>
                    )}

                    {data?.symptoms && (
                      <div className="detail-card">
                        <h6><FileText className="icon" />{type === "nurse" ? "Current Condition" : type === "pathology" ? "Symptoms/Concerns" : "Symptoms"}</h6>
                        <p>{data?.symptoms}</p>
                      </div>
                    )}

                    {data?.isInsurance && (
                      <div className="detail-card">
                        <h6><FileText className="icon" />Insurance</h6>
                        <p>Yes</p>
                      </div>
                    )}
                  </div>

                  <div className="actions">
                    <Link to={listPageLink} className="btn btn-primary">
                      {listPageText}
                    </Link>
                    <button
                      onClick={() => navigate("/patient?key=second")}
                      className="btn btn-secondary"
                    >
                      View My Appointments
                    </button>
                  </div>
                </div>

                <div className="receipt-footer">
                  <p>
                    <strong>Booking ID:</strong> {data?.appointmentId || getAppointmentId?.appointment_id}
                  </p>
                  <p>
                    <strong>Submitted:</strong> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="back-home">
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
