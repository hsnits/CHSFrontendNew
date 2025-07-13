import React from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MapPin, Phone, Mail, Clock, Award, Users, User } from "react-feather";

import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";
import { createAppointment } from "../../redux/slices/patientApi";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import user_img from "../../assets/img/doctor-profile-img.jpg";

function PathologyProfile() {
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
    if (userProfileId?.role?.toLowerCase() === "pathology") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to book lab tests."
      );
      return;
    }
    const formattedData = {
      refPathology: data?.profile?._id,
      id: userProfileId?.profile?._id,
      status: "Created",
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
        navigate(`/pathologybooking/${res?.payload?._id}`);
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

  const labProfile = data?.profile || {};

  return (
    <>
      <style jsx>{`
        .profile-container {
          padding: 40px 0;
        }
        .profile-header {
          background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
          color: white;
          padding: 40px 0;
          border-radius: 15px;
          margin-bottom: 30px;
        }
        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          object-fit: cover;
          margin-bottom: 20px;
        }
        .profile-name {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .profile-designation {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 15px;
        }
        .profile-location {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }
        .profile-location .icon {
          margin-right: 8px;
        }
        .info-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e3e6f0;
        }
        .info-card h5 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 20px;
          border-bottom: 2px solid #4e73df;
          padding-bottom: 10px;
        }
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fc;
          border-radius: 8px;
        }
        .info-item .icon {
          margin-right: 12px;
          color: #4e73df;
        }
        .info-item strong {
          color: #2c3e50;
          margin-right: 8px;
        }
        .tests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 15px;
        }
        .test-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          text-align: center;
          border: 1px solid #bbdefb;
        }
        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }
        .action-buttons .btn {
          padding: 12px 30px;
          font-weight: 600;
          border-radius: 25px;
          transition: all 0.3s ease;
        }
        .action-buttons .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .availability-status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 10px;
        }
        .availability-status.available {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .availability-status.unavailable {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .back-link {
          margin-bottom: 20px;
        }
        .back-link a {
          color: #6c757d;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        .back-link a:hover {
          color: #4e73df;
        }
        .back-link i {
          margin-right: 8px;
        }
      `}</style>

      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <div className="profile-container">
            <div className="back-link">
              <a href="/bookappointment">
                <i className="fa-solid fa-arrow-left-long"></i> Back to Lab List
              </a>
            </div>

            <div className="profile-header text-center">
              <img
                src={labProfile?.coverImage || user_img}
                alt={labProfile?.labName || labProfile?.firstName}
                className="profile-image"
              />
              <h1 className="profile-name">
                {labProfile?.labName || `${labProfile?.firstName} ${labProfile?.lastName}` || "Lab Name"}
              </h1>
              <p className="profile-designation">
                {labProfile?.designation || "Pathology Laboratory"}
              </p>
              {labProfile?.address && (
                <div className="profile-location">
                  <MapPin size={16} className="icon" />
                  {labProfile.address}
                </div>
              )}
              <div className={`availability-status ${labProfile?.available ? 'available' : 'unavailable'}`}>
                {labProfile?.available ? 'Available' : 'Currently Unavailable'}
              </div>
            </div>

            <Row>
              <Col lg="6" md="6">
                <Card className="info-card">
                  <h5>Contact Information</h5>
                  
                  {labProfile?.contactPerson && (
                    <div className="info-item">
                      <User size={18} className="icon" />
                      <strong>Contact Person:</strong> {labProfile.contactPerson}
                    </div>
                  )}
                  
                  {labProfile?.phoneNumber && (
                    <div className="info-item">
                      <Phone size={18} className="icon" />
                      <strong>Phone:</strong> {labProfile.phoneNumber}
                    </div>
                  )}
                  
                  {labProfile?.email && (
                    <div className="info-item">
                      <Mail size={18} className="icon" />
                      <strong>Email:</strong> {labProfile.email}
                    </div>
                  )}
                  
                  {labProfile?.address && (
                    <div className="info-item">
                      <MapPin size={18} className="icon" />
                      <strong>Address:</strong> {labProfile.address}
                    </div>
                  )}
                  
                  {labProfile?.city && (
                    <div className="info-item">
                      <MapPin size={18} className="icon" />
                      <strong>City:</strong> {labProfile.city}, {labProfile?.state} {labProfile?.pinCode}
                    </div>
                  )}
                </Card>
              </Col>

              <Col lg="6" md="6">
                <Card className="info-card">
                  <h5>Laboratory Information</h5>
                  
                  {labProfile?.labId && (
                    <div className="info-item">
                      <Award size={18} className="icon" />
                      <strong>Lab ID:</strong> {labProfile.labId}
                    </div>
                  )}
                  
                  {labProfile?.labLicenseNumber && (
                    <div className="info-item">
                      <Award size={18} className="icon" />
                      <strong>License Number:</strong> {labProfile.labLicenseNumber}
                    </div>
                  )}
                  
                  <div className="info-item">
                    <Clock size={18} className="icon" />
                    <strong>Working Hours:</strong> 8:00 AM - 8:00 PM
                  </div>
                  
                  <div className="info-item">
                    <Users size={18} className="icon" />
                    <strong>Services:</strong> Sample Collection, Home Collection, Reports
                  </div>
                </Card>
              </Col>
            </Row>

            {labProfile?.testsOffered && labProfile.testsOffered.length > 0 && (
              <Row>
                <Col lg="12">
                  <Card className="info-card">
                    <h5>Available Tests</h5>
                    <div className="tests-grid">
                      {labProfile.testsOffered.map((test, index) => (
                        <div key={index} className="test-tag">
                          {test}
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            <div className="action-buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleBookAppointment(data)}
                disabled={apLoading || !labProfile?.available}
              >
                {apLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Booking...
                  </>
                ) : (
                  "Book Lab Test"
                )}
              </Button>
              
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default PathologyProfile; 