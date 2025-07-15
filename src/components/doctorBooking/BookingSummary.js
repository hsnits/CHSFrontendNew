import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import message from "../../assets/img/icons/device-message.svg";
import { Card, CardBody, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BookingSummary({ data, type }) {
  // Debug logging to see what data and type we're receiving
  console.log("BookingSummary - type:", type);
  console.log("BookingSummary - data:", data);

  // Determine the title prefix based on the type or designation
  const getTitlePrefix = () => {
    if (type === "nurse") {
      return ""; // No prefix for nurses
    }
    if (type === "pathology") {
      return ""; // No prefix for pathology labs
    }
    if (type === "biomedical") {
      return ""; // No prefix for biomedical engineers
    }
    if (type === "hospital") {
      return ""; // No prefix for hospitals
    }
    if (type === "ambulance") {
      return ""; // No prefix for ambulance services
    }
    if (data?.designation && data.designation.toLowerCase().includes("nurse")) {
      return ""; // No prefix for nurses
    }
    return "Dr. "; // Default to Dr. for doctors
  };

  // Get the full name
  const getFullName = () => {
    if (data?.displayName) {
      return data.displayName;
    }
    if (data?.firstName && data?.lastName) {
      return `${data.firstName} ${data.lastName}`;
    }
    if (data?.firstName) {
      return data.firstName;
    }
    if (data?.name) {
      return data.name; // Fallback for different data structures
    }
    if (data?.hospitalName) {
      return data.hospitalName; // For hospital type
    }
    if (data?.companyName) {
      return data.companyName; // For biomedical/ambulance type
    }
    return getDefaultName();
  };

  // Get default name based on type
  const getDefaultName = () => {
    switch (type) {
      case "biomedical":
        return "Biomedical Service";
      case "hospital":
        return "Hospital Service";
      case "ambulance":
        return "Ambulance Service";
      case "pathology":
        return "Pathology Lab";
      case "nurse":
        return "Nursing Service";
      default:
        return "Healthcare Provider";
    }
  };

  // Get default designation based on type
  const getDefaultDesignation = () => {
    switch (type) {
      case "biomedical":
        return "Biomedical Engineer";
      case "hospital":
        return "Hospital Service";
      case "ambulance":
        return "Emergency Service";
      case "pathology":
        return "Pathology Lab";
      case "nurse":
        return "Registered Nurse";
      default:
        return "Doctor";
    }
  };

  return (
    <>
      <Col lg="4" md="12">
        <div className="booking-header">
          <h4 className="booking-title">Booking Summary</h4>
        </div>
        <Card className="booking-card">
          <CardBody className="booking-card-body">
            <div className="booking-doctor-details">
              <div className="booking-doctor-left">
                <div className="booking-doctor-img">
                  <Link to="#">
                    <img src={data?.coverImage || user_img} alt={getFullName()} />
                  </Link>
                </div>
                <div className="booking-doctor-info">
                  <h4>
                    <Link to="#">{getTitlePrefix()}{getFullName()}</Link>
                  </h4>
                  <p>{data?.designation || getDefaultDesignation()}</p>
                  <p>{data?.languages && data?.languages?.join(",")}</p>
                </div>
              </div>
              {/* <div className="booking-doctor-right">
                <p>
                  <i className="fas fa-check-circle"></i>
                  <Link to="#">Edit</Link>
                </p>
              </div> */}
            </div>
          </CardBody>
        </Card>
        <Card className="booking-card">
          <CardBody className="booking-card-body">
            <div className="booking-doctor-details">
              <div className="booking-device">
                <div className="booking-device-img">
                  <img src={message} alt="device-message" />
                </div>
                <div className="booking-doctor-info">
                  <h3>We can help you</h3>
                  <p className="device-text">
                    Contact us in <b>info@chshealthcare.in</b> (or) chat with our customer support
                    team.
                  </p>
                  <Link to="/contact" className="btn">
                  Contact us
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
