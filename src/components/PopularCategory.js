import React from "react";
import {PopularCategoryData} from '../Data';
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PopularCategory() {
    return (
        <section class="section categorie-section">
            <Container>
                <div class="pharmacy-section-header">
                    <Row>
                        <Col md='12'>
                            <div class="pharmacy-title mb-0">
                                <h4>Shop Popular Categories</h4>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="categorie-info">
                    <Row>
                        {PopularCategoryData.map((item, key)=>(
                        <Col xl='2' lg='3' md='4' xs='6' className="d-flex" key={item.id}>
                            <div className="categorie-grid flex-fill">
                                <div className="categorie-img">
                                <Link to="#">
                                        <img src={item.img} alt={item.category_name} />
                                    </Link>
                                </div>
                                <div className="categorie-content">
                                    <h5>
                                        <Link to="#">{item.category_name}</Link>
                                    </h5>
                                    <p>{item.number}</p>
                                </div>
                            </div>
                        </Col>
                             )
                            )}
                    </Row>
                    <div class="view-all-more text-center"><button type="button" class="btn btn-primary btn btn-primary">View More</button></div>
                </div>
            </Container>
        </section>
    );
}