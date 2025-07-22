import React from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from "react-bootstrap";
import { 
  MapPin, Phone, Mail, Clock, Award, Users, User, Activity, 
  Heart, Shield, Calendar, Globe, Star, Home, Package, 
  Briefcase, Truck, Zap, CheckCircle 
} from "react-feather";

import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";
import { createAppointment } from "../../redux/slices/patientApi";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import user_img from "../../assets/img/doctor-profile-img.jpg";

function HospitalProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apLoading = useSelector(
    (state) => state.PATIENT?.loading?.user?.createAppointmentLoading
  );

  const { data, getAllData } = useGetMountData(
    userId ? `/user/${userId}` : null
  );

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

  const handleBookAppointment = async (data) => {
    if (userProfileId?.role?.toLowerCase() === "hospital") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to book hospital services."
      );
      return;
    }
    const formattedData = {
      refHospital: data?.profile?._id,
      id: userProfileId?.profile?._id,
      status: "Created",
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
        navigate(`/hospitalbooking/${res?.payload?._id}`);
      }
    });
  };

  if (!data) {
    return (
      <>
        <Header />
        <Breadcrumb />
        <div className="content">
          <Container>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const hospitalProfile = data?.profile || {};
  const hospitalDetails = hospitalProfile?.hospitalDetails || {};
  const availabilityDetails = hospitalProfile?.availabilityDetails || {};
  const emergencyServices = availabilityDetails?.emergencyServices || {};
  const bedData = hospitalDetails?.bedData || {};

  // Calculate bed occupancy percentage
  const getBedOccupancy = (occupied, total) => {
    if (!total) return 0;
    return Math.round((occupied / total) * 100);
  };

  return (
    <>
      <style jsx>{`
        .profile-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .back-link {
          margin-bottom: 20px;
        }

        .back-link a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .back-link a:hover {
          text-decoration: underline;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .profile-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.05) 10px,
            rgba(255,255,255,0.05) 20px
          );
          animation: slide 20s linear infinite;
        }

        @keyframes slide {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .profile-image {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .profile-name {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .profile-type {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          font-weight: 500;
        }

        .profile-contact-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .profile-contact-info .info-value {
          display: flex;
          align-items: center;
          font-size: 1.1rem;
          color: white;
          margin: 0;
        }

        .profile-contact-info .icon {
          color: white;
          opacity: 0.9;
        }

        .profile-location {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
          font-size: 1.1rem;
        }

        .profile-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 20px;
          position: relative;
          z-index: 1;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          display: block;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .availability-status {
          display: inline-block;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 600;
          position: relative;
          z-index: 1;
          font-size: 1.1rem;
        }

        .availability-status.available {
          background-color: rgba(40, 167, 69, 0.2);
          color: #28a745;
          border: 2px solid rgba(40, 167, 69, 0.4);
        }

        .availability-status.unavailable {
          background-color: rgba(220, 53, 69, 0.2);
          color: #dc3545;
          border: 2px solid rgba(220, 53, 69, 0.4);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .info-card h4 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.3rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          padding: 10px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .info-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .info-item .icon {
          color: #6c757d;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .info-value {
          font-weight: 600;
          color: #2c3e50;
        }

        .badge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 15px;
        }

        .service-badge {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
        }

        .service-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .department-badge {
          background: #f8f9fa;
          color: #495057;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          border: 2px solid #dee2e6;
          transition: all 0.3s ease;
        }

        .department-badge:hover {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .emergency-services {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .emergency-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 10px;
          font-weight: 500;
        }

        .emergency-item.available {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .emergency-item.unavailable {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .bed-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .bed-stat-item {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          border: 2px solid #dee2e6;
        }

        .bed-number {
          font-size: 2rem;
          font-weight: 700;
          color: #007bff;
          display: block;
          margin-bottom: 5px;
        }

        .bed-label {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .action-buttons .btn {
          min-width: 200px;
          padding: 15px 35px;
          font-weight: 700;
          border-radius: 30px;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .action-buttons .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .full-width-card {
          grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 15px;
          }
          
          .profile-header {
            padding: 25px;
          }
          
          .profile-name {
            font-size: 2rem;
          }
          
          .profile-stats {
            gap: 20px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <div className="profile-container">
            <div className="back-link">
              <a href="/bookappointment">
                <i className="fa-solid fa-arrow-left-long"></i> Back to Service List
              </a>
            </div>

            <div className="profile-header text-center d-flex flex-column align-items-center">
              <img
                src={data?.coverImage || hospitalProfile?.coverImage || user_img}
                alt={hospitalProfile?.displayName || "Hospital Profile"}
                className="profile-image"
              />
              <h1 className="profile-name">
                {hospitalProfile?.displayName || data?.name || "Hospital Name"}
              </h1>
              <p className="profile-type">
                {hospitalDetails?.hospitalType || "General Hospital"}
              </p>
              <div className="profile-contact-info">
                <p className="info-value">
                  <Phone size={16} className="icon" style={{marginRight: '8px'}} />
                  {data?.phoneNumber || hospitalProfile?.phoneNumber || 'Phone number not available'}
                </p>
                <p className="info-value">
                  <Mail size={16} className="icon" style={{marginRight: '8px'}} />
                  {data?.email || hospitalProfile?.email || 'Email not available'}
                </p>
                {hospitalProfile?.address && (
                  <div className="profile-location">
                    <MapPin size={18} />
                    {hospitalProfile.address}
                    {hospitalProfile?.city && `, ${hospitalProfile.city}`}
                    {hospitalProfile?.state && `, ${hospitalProfile.state}`}
                  </div>
                )}
              </div>

              {/* Rest of the profile header content */}
              <div className="profile-stats">
                {hospitalDetails?.totalDoctors > 0 && (
                  <div className="stat-item">
                    <span className="stat-number">{hospitalDetails.totalDoctors}</span>
                    <span className="stat-label">Doctors</span>
                  </div>
                )}
                {hospitalDetails?.bedCapacity > 0 && (
                  <div className="stat-item">
                    <span className="stat-number">{hospitalDetails.bedCapacity}</span>
                    <span className="stat-label">Beds</span>
                  </div>
                )}
                {hospitalDetails?.establishedYear && (
                  <div className="stat-item">
                    <span className="stat-number">{new Date().getFullYear() - hospitalDetails.establishedYear}</span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                )}
              </div>

              <div className={`availability-status ${hospitalProfile?.availability ? 'available' : 'unavailable'}`}>
                {hospitalProfile?.availability ? (
                  <>
                    <CheckCircle size={16} style={{marginRight: '8px'}} />
                    Currently Available
                  </>
                ) : (
                  'Currently Unavailable'
                )}
              </div>
            </div>

            <div className="info-grid">
              {/* Contact Information */}
              <Card className="info-card">
                <h4>
                  <Phone size={24} />
                  Contact Information
                </h4>
                <div className="info-item">
                  <Phone size={16} className="icon" />
                  <span className="info-value">{hospitalProfile?.phoneNumber || 'Not available'}</span>
                </div>
                <div className="info-item">
                  <Mail size={16} className="icon" />
                  <span className="info-value">{hospitalProfile?.email || 'Not available'}</span>
                </div>
                {hospitalProfile?.emergencyNumber && (
                  <div className="info-item">
                    <Truck size={16} className="icon" />
                    <span className="info-value">Emergency: {hospitalProfile.emergencyNumber}</span>
                  </div>
                )}
                {hospitalProfile?.website && (
                  <div className="info-item">
                    <Globe size={16} className="icon" />
                    <span className="info-value">{hospitalProfile.website}</span>
                  </div>
                )}
              </Card>

              {/* Hospital Information */}
              <Card className="info-card">
                <h4>
                  <Home size={24} />
                  Hospital Details
                </h4>
                {hospitalDetails?.hospitalType && (
                  <div className="info-item">
                    <Briefcase size={16} className="icon" />
                    <span className="info-value">Type: {hospitalDetails.hospitalType}</span>
                  </div>
                )}
                {hospitalDetails?.establishedYear && (
                  <div className="info-item">
                    <Calendar size={16} className="icon" />
                    <span className="info-value">Established: {hospitalDetails.establishedYear}</span>
                  </div>
                )}
                {hospitalDetails?.licenseNumber && (
                  <div className="info-item">
                    <Award size={16} className="icon" />
                    <span className="info-value">License: {hospitalDetails.licenseNumber}</span>
                  </div>
                )}
                {hospitalDetails?.totalStaff > 0 && (
                  <div className="info-item">
                    <Users size={16} className="icon" />
                    <span className="info-value">Total Staff: {hospitalDetails.totalStaff}</span>
                  </div>
                )}
                {hospitalDetails?.totalDoctors > 0 && (
                  <div className="info-item">
                    <User size={16} className="icon" />
                    <span className="info-value">Total Doctors: {hospitalDetails.totalDoctors}</span>
                  </div>
                )}
                {hospitalDetails?.totalNurses > 0 && (
                  <div className="info-item">
                    <User size={16} className="icon" />
                    <span className="info-value">Total Nurses: {hospitalDetails.totalNurses}</span>
                  </div>
                )}
                {hospitalDetails?.operationTheaters > 0 && (
                  <div className="info-item">
                    <Activity size={16} className="icon" />
                    <span className="info-value">Operation Theaters: {hospitalDetails.operationTheaters}</span>
                  </div>
                )}
              </Card>

              {/* Availability Details */}
              {availabilityDetails && (
                <Card className="info-card">
                  <h4>
                    <Clock size={24} />
                    Availability Details
                  </h4>
                  <div className="info-item">
                    <CheckCircle size={16} className="icon" />
                    <span className="info-value">
                      24/7 Service: {availabilityDetails.twentyFourHour ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="info-item">
                    <CheckCircle size={16} className="icon" />
                    <span className="info-value">
                      Emergency Services: {availabilityDetails.emergencyServices ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="info-item">
                    <CheckCircle size={16} className="icon" />
                    <span className="info-value">
                      Appointment Booking: {availabilityDetails.appointmentBooking ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  {availabilityDetails.price > 0 && (
                    <div className="info-item">
                      <CheckCircle size={16} className="icon" />
                      <span className="info-value">
                        Consultation Fee: ₹{availabilityDetails.price}
                      </span>
                    </div>
                  )}
                </Card>
              )}

              {/* Additional Contact Details */}
              <Card className="info-card">
                <h4>
                  <Phone size={24} />
                  Additional Contact Details
                </h4>
                <div className="info-item">
                  <MapPin size={16} className="icon" />
                  <span className="info-value">
                    {hospitalProfile?.address || 'Address not available'}
                    {hospitalProfile?.landmark && `, Near ${hospitalProfile.landmark}`}
                    {hospitalProfile?.city && `, ${hospitalProfile.city}`}
                    {hospitalProfile?.state && `, ${hospitalProfile.state}`}
                    {hospitalProfile?.pincode && ` - ${hospitalProfile.pincode}`}
                  </span>
                </div>
                {hospitalProfile?.emergencyNumber && (
                  <div className="info-item">
                    <Phone size={16} className="icon" />
                    <span className="info-value">Emergency: {hospitalProfile.emergencyNumber}</span>
                  </div>
                )}
                {hospitalProfile?.languages && (
                  <div className="info-item">
                    <Globe size={16} className="icon" />
                    <span className="info-value">Languages: {hospitalProfile.languages}</span>
                  </div>
                )}
                {hospitalProfile?.website && (
                  <div className="info-item">
                    <Globe size={16} className="icon" />
                    <span className="info-value">
                      <a href={hospitalProfile.website} target="_blank" rel="noopener noreferrer">
                        {hospitalProfile.website}
                      </a>
                    </span>
                  </div>
                )}
              </Card>

              {/* Emergency Services */}
              {Object.keys(emergencyServices).length > 0 && (
                <Card className="info-card">
                  <h4>
                    <Zap size={24} />
                    Emergency Services
                  </h4>
                  <div className="emergency-services">
                    {emergencyServices?.ambulanceService !== undefined && (
                      <div className={`emergency-item ${emergencyServices.ambulanceService ? 'available' : 'unavailable'}`}>
                        <Truck size={16} />
                        <span>Ambulance</span>
                      </div>
                    )}
                    {emergencyServices?.trauma_center !== undefined && (
                      <div className={`emergency-item ${emergencyServices.trauma_center ? 'available' : 'unavailable'}`}>
                        <Heart size={16} />
                        <span>Trauma Center</span>
                      </div>
                    )}
                    {emergencyServices?.blood_bank !== undefined && (
                      <div className={`emergency-item ${emergencyServices.blood_bank ? 'available' : 'unavailable'}`}>
                        <Activity size={16} />
                        <span>Blood Bank</span>
                      </div>
                    )}
                    {emergencyServices?.pharmacy !== undefined && (
                      <div className={`emergency-item ${emergencyServices.pharmacy ? 'available' : 'unavailable'}`}>
                        <Shield size={16} />
                        <span>Pharmacy</span>
                      </div>
                    )}
                    {emergencyServices?.laboratory !== undefined && (
                      <div className={`emergency-item ${emergencyServices.laboratory ? 'available' : 'unavailable'}`}>
                        <Briefcase size={16} />
                        <span>Laboratory</span>
                      </div>
                    )}
                    {emergencyServices?.radiology !== undefined && (
                      <div className={`emergency-item ${emergencyServices.radiology ? 'available' : 'unavailable'}`}>
                        <Activity size={16} />
                        <span>Radiology</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Bed Availability */}
              {(bedData?.totalBeds > 0 || hospitalDetails?.bedCapacity > 0) && (
                <Card className="info-card">
                  <h4>
                    <Package size={24} />
                    Bed Availability
                  </h4>
                  <div className="bed-stats">
                    {hospitalDetails?.bedCapacity > 0 && (
                      <div className="bed-stat-item">
                        <span className="bed-number">{hospitalDetails.bedCapacity}</span>
                        <span className="bed-label">Total Beds</span>
                      </div>
                    )}
                    {bedData?.availableBeds >= 0 && (
                      <div className="bed-stat-item">
                        <span className="bed-number">{bedData.availableBeds}</span>
                        <span className="bed-label">Available</span>
                      </div>
                    )}
                    {hospitalDetails?.icuBeds > 0 && (
                      <div className="bed-stat-item">
                        <span className="bed-number">{hospitalDetails.icuBeds}</span>
                        <span className="bed-label">ICU Beds</span>
                      </div>
                    )}
                    {hospitalDetails?.emergencyBeds > 0 && (
                      <div className="bed-stat-item">
                        <span className="bed-number">{hospitalDetails.emergencyBeds}</span>
                        <span className="bed-label">Emergency Beds</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Departments */}
              {hospitalDetails?.departments && hospitalDetails.departments.length > 0 && (
                <Card className="info-card full-width-card">
                  <h4>
                    <Briefcase size={24} />
                    Departments
                  </h4>
                  <div className="badge-grid">
                    {hospitalDetails.departments.map((dept, index) => (
                      <Badge key={index} className="department-badge">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Specialties */}
              {hospitalDetails?.specialties && hospitalDetails.specialties.length > 0 && (
                <Card className="info-card full-width-card">
                  <h4>
                    <Star size={24} />
                    Specialties
                  </h4>
                  <div className="badge-grid">
                    {hospitalDetails.specialties.map((specialty, index) => (
                      <Badge key={index} className="department-badge">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Services */}
              {hospitalProfile?.services && hospitalProfile.services.length > 0 && (
                <Card className="info-card full-width-card">
                  <h4>
                    <Activity size={24} />
                    Services Offered
                  </h4>
                  <div className="badge-grid">
                    {hospitalProfile.services.map((service, index) => (
                      <div key={index} className="service-badge">
                        {service}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Facilities */}
              {hospitalDetails?.facilities && hospitalDetails.facilities.length > 0 && (
                <Card className="info-card full-width-card">
                  <h4>
                    <Home size={24} />
                    Facilities
                  </h4>
                  <div className="badge-grid">
                    {hospitalDetails.facilities.map((facility, index) => (
                      <Badge key={index} className="department-badge">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="action-buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleBookAppointment(data)}
                disabled={apLoading || !hospitalProfile?.availability}
              >
                {apLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar size={20} style={{marginRight: '10px'}} />
                    Book Hospital Service
                  </>
                )}
              </Button>
              
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => window.history.back()}
              >
                <MapPin size={20} style={{marginRight: '10px'}} />
                Back to List
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default HospitalProfile; 