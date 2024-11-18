import React from "react";
import {cardData} from "../Data";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


const Category = () => {
  const responsiveFeatures = {
    0: {
        items: 1,
        nav:true
    },
    600: {
        items: 3,
        nav:true
    },
    1000: {
        items: 3,
        nav:true,
    },

};
  return (
    <section className="section home-tile-section">
      <Container fluid>
        <Row>
          <Col md='9' className="m-auto">
            <div
              className="section-header text-center aos aos-init aos-animate"
              data-aos="fade-up"
            >
              <h2>What are you looking for?</h2>
            </div>
            <Row>
              <Col xl='12' lg='12' md='12'>
            <OwlCarousel className='owl-theme' loop margin={10} autoPlay={true} dots={false} nav={true} responsive={responsiveFeatures}>
              {cardData.map((card) => (
                <div
                  key={card.id}
                  className="mb-3 aos aos-init aos-animate"
                  data-aos="fade-up"
                >
                  <div className="card text-center doctor-book-card">
                    <img
                      src={card.imageSrc}
                      alt={card.alt}
                      className="img-fluid"
                    />
                    <div className="doctor-book-card-content tile-card-content-1">
                      <div>
                        <h3 className="card-title mb-0">{card.title}</h3>
                        <Link
                          to={card.link}
                          className="btn book-btn1 px-3 py-2 mt-3"
                          tabIndex="0"
                        >
                          {card.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </OwlCarousel>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Category;
