import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {doctorsData, responsiveOptions} from '../../src/Data';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Team = () => {
  return (
    <>
      <div className='our-doctors-section'>
        <section className="clinics-section">
          <Container>
            <Row>
              <Col md='12'>
                <div className="section-heading">
                  <h2>Clinic & Specialities</h2>
                  <p>Access to expert physicians and surgeons, advanced technologies and top-quality surgery facilities right here.</p>
                </div>
              </Col>
            </Row>
            <Row>
              <OwlCarousel className='owl-theme' loop margin={10} dots={false} autoPlay={true} nav responsive={responsiveOptions}>
                {doctorsData.map((doctor) => (
                  <div key={doctor.id} className="item">
                    <div className="our-doctors-card">
                      <div className="doctors-header">
                      <Link to="/doctorlist"><img src={doctor.img} alt={doctor.name} className="img-fluid" /></Link>
                      </div>
                      <div className="doctors-body">
                        <Link to="/doctorlist">
                          <h4>{doctor.name}</h4>
                        </Link>
                        <p>{doctor.specialty}</p>
                        <div className="location d-flex">
                          <p><i className="fas fa-map-marker-alt"></i> {doctor.location}</p>
                          <p className="ms-auto"><i className="fas fa-user-md"></i> {doctor.consultations} Consultations</p>
                        </div>
                        <Row className="row-sm mt-1">
                          <Col xs='6'>
                            <Link to="/doctorlist" className="btn view-btn" tabIndex="0">View Profile</Link>
                          </Col>
                          <Col xs='6'>
                            <Link to="/doctorlist" className="btn book-btn" tabIndex="0">Book Now</Link>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                ))}
              </OwlCarousel>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Team;
