import React from "react";
import work_img from '../assets/img/work-img.png';
import {Howitworks} from '../Data';
import { Col, Container, Row } from "react-bootstrap";

export default function HowItWorks() {
    const sub_heading='How it Works';
    const main_heading='4 easy steps to get your solution';
    return (
        <section className="work-section">
            <Container>
                <Row>
                    <Col lg='4' md='12' className="work-img-info">
                        <div className="work-img">
                            <img src={work_img} className="img-fluid" alt={sub_heading}/>
                        </div>
                    </Col>
                    <Col lg='8' md='12' className="work-details">
                        <div className="section-header-one">
                            <h5>{sub_heading}</h5>
                            <h2 className="section-title">{main_heading}</h2>
                        </div>
                        <Row>
                           {Howitworks.map((item, index)=>(
                            <Col lg='6' md='6' key={index}>
                                <div className="work-info">
                                    <div className="work-icon">
                                        <span><img src={item.icon} alt={item.main_heading}/></span>
                                    </div>
                                    <div className="work-content">
                                        <h5>{item.main_heading}</h5>
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                            </Col>
                             ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}