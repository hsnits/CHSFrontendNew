import React from "react";
import Serviceimg_1 from '../assets/img/services/1.png';
import Serviceimg_2 from '../assets/img/services/2.png';
import Serviceimg_3 from '../assets/img/services/3.png';
import Serviceimg_4 from '../assets/img/services/4.png';
import Serviceimg_5 from '../assets/img/services/5.png';
import Serviceimg_6 from '../assets/img/services/6.png';
import { Link } from 'react-router-dom';
import { ServiceDescriptionData } from '../Data';
import { Col, Container, Row } from "react-bootstrap";


export default function ServiceBanner() {

  const serviceBanner1 = {
    background: `url(${Serviceimg_1}) no-repeat`,
    backgroundSize: '100% auto',
  };
  const serviceBanner2 = {
    background: `url(${Serviceimg_2}) no-repeat`,
    backgroundSize: '100% auto',
  };
  const serviceBanner3 = {
    background: `url(${Serviceimg_3}) no-repeat`,
    backgroundSize: '100% auto',
  };
  const serviceBanner4 = {
    background: `url(${Serviceimg_4}) no-repeat`,
    backgroundSize: '100% auto',
  };
  const serviceBanner5 = {
    background: `url(${Serviceimg_5}) no-repeat`,
    backgroundSize: '100% auto',
  };
  const serviceBanner6 = {
    background: `url(${Serviceimg_6}) no-repeat`,
    backgroundSize: '100% auto',
  };
  return (
    <>
      <section className="service-banner">
      <Container>
         <Row>
           <Col lg='12'>
              <div className="service_section">
                <div className="carousel_service">
                  <div id="panel-1"  >
                    <Link to="/" className="panel" style={serviceBanner1}></Link>
                  </div>
                  <div id="panel-2">
                  <Link to="/LabTest" className="panel" style={serviceBanner2}></Link>
                  </div>
                  <div id="panel-3">
                  <Link to="/pharmacy" className="panel" style={serviceBanner3}></Link>
                  </div>
                  <div id="panel-4">
                  <Link to="/doctorList" className="panel" style={serviceBanner4}></Link>
                  </div>
                  <div id="panel-5">
                  <Link to="/VirtualConsultation" className="panel" style={serviceBanner5}></Link>
                  </div>
                  <div id="panel-6">
                  <Link to="/PrescriptionRefills" className="panel" style={serviceBanner6}></Link>
                  </div>
                  <div id="panel-7">
                  <Link to="/" className="panel" style={serviceBanner1}></Link>
                  </div>
                  <div id="panel-8">
                  <Link to="/LabTest" className="panel" style={serviceBanner2}></Link>
                  </div>
                  <div id="panel-9">
                  <Link to="/pharmacy" className="panel" style={serviceBanner3}></Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
       </Container>
      </section>

      <section className="home-tile-section">
        <Container fluid>
         <Row>
            <div className="m-auto col-md-9">
              <div className="section-header text-center aos aos-init aos-animate">
                <h2>Our Services</h2>
              </div>

              <Row>
                {ServiceDescriptionData.map((item) => (
                  <div className="col-lg-4" key={item.id}>
                    <div className="card box_shadow">
                      <div className="card-header p-0">
                        <img src={item.service_desc_img} className="img-fluid service_img" />
                      </div>
                      <div className="card-body text-center">
                        <h5>{item.service_heading}</h5>
                        <p>{item.service_desc}</p>
                        <div className="view-all-more text-center">
                          <Link to={item.path} className="btn btn-primary">View More</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Row>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}