import React from "react";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { featuresData } from '../../src/Data';
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function FeatureCarousel() {
    const responsiveFeatures = {
        0: {
            items: 2,
        },
        600: {
            items: 3,
        },
        1000: {
            items: 5,
        },

    };
    return (
        <>
            <section className="clinic-features-section">
                <Container>
                    <Row>
                        <Col md='6'>
                            <div className="section-heading">
                                <h2>Availabe Features in Our Clinic</h2>
                                <p>Meet our Experts & Book Online</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='12'>
                            <OwlCarousel className='owl-theme' loop margin={10} nav dots={false} responsive={responsiveFeatures}>
                                {featuresData.map((feature) => (
                                    <div className="item" key={feature.id}>
                                        <div className="clinic-features">
                                            <div className="item" key={feature.id}>
                                                <img src={feature.feature_img} alt={feature.name} className="img-fluid" />
                                            </div>
                                            <div className="clinic-feature-overlay">
                                                <Link to="#" className="img-overlay">{feature.name}</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </OwlCarousel>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}