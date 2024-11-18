import React from "react";
import { BrowseCategoryData, responsiveCategory } from "../Data";
import { Row, Col, Container } from "react-bootstrap";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Link } from "react-router-dom";

export default function BrowseCategory(){
   const heading='Browse by Category';
   const content='Schedule your appointment today and experience comprehensive, compassionate healthcare like never before';

    return (
        
        <section className="clinic-features-section">
            <Container>
            <div class="pharmacy-section-header">
                    <Row className="align-items-center">
                        <Col md='6'>
                            <div class="pharmacy-title">
                                <h4>{heading}</h4>
                            </div>
                        </Col>
                        <Col md='6'>
                            <div class="pharmacy-title-link">
                                <Link to="#">View All <i class="fa-solid fa-arrow-right"></i></ Link>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row>
                <div class="deals-list">
                    <ul class="nav">
                    <OwlCarousel className='owl-theme' loop margin={10} dots={false} autoPlay={true} nav responsive={responsiveCategory}>
                  {BrowseCategoryData.map((BrowseCategory) => (
                    <li key={BrowseCategory.id}>
                    <div class="deals-grid">
                        <div class="deals-box">
                            <img src={BrowseCategory.img} alt={BrowseCategory.name}/>
                        </div>
                        <div class="deals-content">
                            <Link to="#">{BrowseCategory.name}</Link>
                        </div>
                    </div>
                </li>
                     ))}
                     </OwlCarousel>
                     </ul>
                     
               </div>
            </Row>
            </Container>
        </section>

    );
}