import React from "react";
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../../assets/img/pharmacy_banner.png';
import { Container, Row, Col } from "react-bootstrap";

export default function PharmacySlider() {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col lg='12' className="p-0">
                        <Carousel>
                            <Carousel.Item interval={1000}>
                                <img src={ExampleCarouselImage} className="img-fluid" />
                            </Carousel.Item>
                            <Carousel.Item interval={500}>
                                <img src={ExampleCarouselImage} className="img-fluid" />
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
            </Container>
        </>
    )
}