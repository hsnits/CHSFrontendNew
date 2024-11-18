import React from "react";
import { aboutData } from "../Data";
import { Container, Row, Col } from "react-bootstrap";

function About_Short() {
  const { images, experienceHeader, mainHeader, content, emergencyNumber, title } = aboutData;
  return (
    <section className="about-section">
      <Container>
        <Row className="align-items-center">
          <Col lg='6' md='12'>
            <div className="about-img-info">
             <Row>
               <Col md='6'>
                  <div className="about-inner-img">
                    <div className="about-img">
                      <img src={images.about_img1} className="img-fluid" alt="about-image"/>
                    </div>
                    <div className="about-img">
                      <img src={images.about_img2} className="img-fluid" alt="about-image"/>
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className="about-inner-img">
                    <div className="about-box">
                      <h4>{title}</h4>
                    </div>
                    <div className="about-img">
                      <img src={images.about_img3} className="img-fluid" alt="about-image"/>
                    </div>
                  </div>
               </Col>
              </Row>
            </div>
          </Col>
          <Col lg='6' md='12'>
            <div className="section-inner-header about-inner-header">
              <h6>{experienceHeader}</h6>
              <h2>{mainHeader}</h2>
            </div>
            <div className="about-content">
              <div className="about-content-details">
                <p className="text-justify">{content}</p>
              </div>
              <div className="about-contact">
                <div className="about-contact-icon">
                  <span><img src={images.phone_icon} alt="phone-image" /></span>
                </div>
                <div className="about-contact-text">
                  <p>Need Emergency?</p>
                  <h4>{emergencyNumber}</h4>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About_Short;
