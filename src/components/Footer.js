import React from "react";
import ChsLogo from "../assets/img/chs_logo.png";
import { company_name, email_address, phone_no, address } from "./CompanyName";
import { Col, Container, Row } from "react-bootstrap";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Twitter,
} from "react-feather";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="footer-widget footer-about">
                <div className="footer-logo">
                  <img src={ChsLogo} alt="logo" />
                </div>
                <div className="footer-about-content">
                  <div className="social-icon">
                    <ul>
                      <li>
                        <Link to="#">
                          <Facebook />{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Twitter />{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Linkedin />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <Instagram />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" xs="6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">About Us</h2>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg="3" md="6" xs="6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Doctors</h2>
                <ul>
                  <li>
                    <Link to="/doctorlist">Appointments</Link>
                  </li>
                  <li>
                    <Link to="#">Chat</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="footer-widget footer-contact">
                <h2 className="footer-title">Contact Us</h2>
                <div className="footer-contact-info">
                  <div className="footer-address">
                    <span>
                      <MapPin />
                    </span>
                    <p>{address} </p>
                  </div>
                  <div className="footer-address">
                    <span>
                      <PhoneCall />
                    </span>
                    <p> {phone_no}</p>
                  </div>
                  <div className="footer-address">
                    <span>
                      {" "}
                      <Mail />
                    </span>
                    <p className="mb-0">{email_address}</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <div className="copyright">
            <Row>
              <Col sm="8" md="8">
                <div className="copyright-text">
                  <p className="mb-0">
                    © 2024 {company_name}. All rights reserved. Designed by{" "}
                    <Link
                      to="https://softtrixsoftware.com/"
                      target="_blank"
                      className="text-white"
                    >
                      Softtrix Software Pvt. Ltd.
                    </Link>
                  </p>
                </div>
              </Col>
              <Col sm="4" md="4">
                <div className="copyright-menu">
                  <ul className="policy-menu">
                    <li>
                      <Link to="#">Terms and Conditions</Link>
                    </li>
                    <li>
                      <Link to="#">Policy</Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </footer>
  );
}
