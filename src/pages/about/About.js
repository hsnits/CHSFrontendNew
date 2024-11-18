import React from "react";
import { aboutData } from "../../Data";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { Col, Container, Row } from "react-bootstrap";
import '../about/About.css';
import vision_img from '../../assets/img/icons/vision-icon.png';
import mission_img from '../../assets/img/icons/mission-icon.png';


function About() {
  const { images, experienceHeader, mainHeader, content, emergencyNumber } = aboutData;
  return (
    <>
      <Header />
      <Breadcrumb />
      <section className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col lg='6' md='12'>
              <div className="about-img-info">
                <Row>
                  <Col md='6'>
                    <div className="about-inner-img">
                      <div className="about-img">
                        <img src={images.about_img1} className="img-fluid" alt="about-image1" />
                      </div>
                      <div className="about-img">
                        <img src={images.about_img2} className="img-fluid" alt="about-image2" />
                      </div>
                    </div>
                  </Col>
                  <Col md='6'>
                    <div className="about-inner-img">
                      <div className="about-box">
                        <h4>{experienceHeader}</h4>
                      </div>
                      <div className="about-img">
                        <img src={images.about_img3} className="img-fluid" alt="about-image" />
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




          <section className="section_about">
            <Container>
              <Row className="border-radius-6">
              <Col md={6} className="text-left bg-blue text-white p-4">
                  <img src={vision_img} alt="Chs Vision" className="mb-3" height="100" />
                  <h2 className="mb-4 text-white">Vision</h2>
                  <p className="text-white">CareSmart envisions a future where healthcare transcends boundaries. We see a world where every individual, regardless of their location or socioeconomic status, can access high-quality medical services.</p>
                </Col>
                <Col md={6} className="text-left bg-green text-white p-4">
                  <img src={mission_img} alt="Chs Mission" className="mb-3" height="100" />
                  <h2 className="mb-4 text-white">Mission</h2>
                  <ul className="chs-list">
                    <li>Affordability: Quality healthcare shouldn't break the bank. We offer
                      cost-effective solutions.</li>
                    <li>Accessibility: Rural, semi-urban, or urban—we're there for you.</li>
                    <li>Technology-Driven: Our platform leverages cutting-edge tech for
                      seamless experiences.</li>
                    <li>Compassion: We treat patients like family.</li>
                  </ul>

                </Col>
              </Row>
            </Container>
          </section>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default About;
