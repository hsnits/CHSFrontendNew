import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import message from "../../assets/img/icons/device-message.svg";
import { Card, CardBody, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BookingSummary({ data }) {
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
                    <img src={user_img} alt="John Doe" />
                  </Link>
                </div>
                <div className="booking-doctor-info">
                  <h4>
                    <Link to="#">Dr.{data?.firstName}</Link>
                  </h4>
                  <p>
                    {data?.achievement}, {data?.designation}
                  </p>
                </div>
              </div>
              <div className="booking-doctor-right">
                <p>
                  <i className="fas fa-check-circle"></i>
                  <Link to="#">Edit</Link>
                </p>
              </div>
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
                    Call us +1 888-888-8888 (or) chat with our customer support
                    team.
                  </p>
                  <Link to="#" className="btn">
                    Chat With Us
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
