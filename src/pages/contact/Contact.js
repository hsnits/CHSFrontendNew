import React from 'react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import { Mail, MapPin, PhoneCall } from 'react-feather';
import {email_address, phone_no, address} from '../../components/CompanyName';
import { Container, Row, Col, Button, CardBody, Form, Card } from 'react-bootstrap';
import { Input, Label } from 'reactstrap';
const Contact = () => {

    return (
        <>
        <Header/>
        <Breadcrumb/>
        <section className="contact-section">
            <Container>
                <Row>
                    <Col lg='5' md='12'>
                        <div className="section-inner-header contact-inner-header">
                            <h6>Get in touch</h6>
                            <h3>Have Any Question?</h3>
                        </div>
                        <Card className="contact-card">
                        <CardBody>
                                <div className="contact-icon">
                                    <MapPin/>
                                </div>
                                <div className="contact-details">
                                    <h4>Address</h4>
                                    <p>{address}</p>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="contact-card">
                        <CardBody>
                                <div className="contact-icon">
                                   <PhoneCall/>
                                </div>
                                <div className="contact-details">
                                    <h4>Phone Number</h4>
                                    <p>{phone_no}</p>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="contact-card">
                           <CardBody>
                                <div className="contact-icon">
                               <Mail/>
                                </div>
                                <div className="contact-details">
                                    <h4>Email Address</h4>
                                    <p>{email_address}</p>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg='7' md='12' className="d-flex">
                        <Card className="contact-form-card w-100">
                           <CardBody>
                                <Form>
                                    <Row>
                                        <Col md='6'>
                                            <div className="mb-3">
                                                <Label className="mb-2">Name</Label>
                                                <Input type="text" className="form-control" placeholder="Enter Your Name"/>
                                            </div>
                                        </Col>
                                        <Col md='6'>
                                            <div className="mb-3">
                                                <Label className="mb-2">Email Address</Label>
                                                <Input type="text" className="form-control" placeholder="Enter Email Address"/>
                                            </div>
                                        </Col>
                                        <Col md='6'>
                                            <div className="mb-3">
                                                <Label className="mb-2">Phone Number</Label>
                                                <Input type="text" className="form-control" placeholder="Enter Phone Number"/>
                                            </div>
                                        </Col>
                                        <Col md='6'>
                                            <div className="mb-3">
                                                <Label className="mb-2">Services</Label>
                                                <Input type="text" className="form-control" placeholder="Enter Services"/>
                                            </div>
                                        </Col>
                                        <Col md='12'>
                                            <div className="mb-3">
                                                <Label className="mb-2">Message</Label>
                                                <textarea className="form-control" placeholder="Enter your comments"></textarea>
                                            </div>
                                        </Col>
                                        <Col md='12'>
                                            <div className="form-group-btn mb-0">
                                                <Button type="submit" className="btn btn-primary prime-btn">Send Message</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
        <Footer/>
        </>
    );
};

export default Contact;
