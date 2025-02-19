import React from "react";
import PharmacyTopBar from "./PharmacyTopBar";
import PharmacySearchBar from "./PharmacySearchBar";
import Breadcrumb from "../Breadcrumb";
import { Card, Container, Row, Col, CardHeader, CardBody, Table, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Input, Label } from "reactstrap";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import Footer from "../Footer";

export default function Checkout() {
    return (
        <>
        <PharmacyTopBar/>
        <PharmacySearchBar/>
        {/* <PharmacyMenu/> */}
        <Breadcrumb/>
            <div className="content">
                <Container>
                    <Row>
                        <Col md='6' lg='7'>
                            <Card>
                               <Card.Header>
                                    <h3 className="card-title">Billing details</h3>
                                </Card.Header>
                                <CardBody>
                                  <Form>
                                        <div className="info-widget">
                                            <h4 className="card-title">Personal Information</h4>
                                           <Row>
                                                <Col md='6' sm='12'>
                                                    <div className="mb-3 card-label">
                                                        <Label className="mb-2">First Name</Label>
                                                        <Input className="form-control" type="text"/>
                                                    </div>
                                                </Col>
                                                <Col md='6' sm='12'>
                                                    <div className="mb-3 card-label">
                                                        <Label className="mb-2">Last Name</Label>
                                                        <Input className="form-control" type="text"/>
                                                    </div>
                                                </Col>
                                                <Col md='6' sm='12'>
                                                    <div className="mb-3 card-label">
                                                        <Label className="mb-2">Email</Label>
                                                        <Input className="form-control" type="email"/>
                                                    </div>
                                                </Col>
                                                <Col md='6' sm='12'>
                                                    <div className="mb-3 card-label">
                                                        <Label className="mb-2">Phone</Label>
                                                        <Input className="form-control" type="number"/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>


                                        <div className="info-widget">
                                            <h4 className="card-title">Shipping Details</h4>
                                            <div className="mb-3 card-label">
                                                <Label className="ps-0 ms-0 mb-2">Address</Label>
                                                <textarea rows="5" className="form-control" name="shipping"></textarea>
                                            </div>
                                        </div>

                                        <div className="payment-widget">
                                            <h4 className="card-title">Payment Method</h4>

                                            <div className="payment-list">
                                                <Label className="payment-radio credit-card-option">
                                                    <input type="radio" name="radio" checked/>
                                                        <span className="checkmark"></span>
                                                        Credit card
                                                </Label>
                                               <Row>
                                                <Col md='6' sm='12'>
                                                        <div className="mb-3 card-label">
                                                            <Label for="card_name">Name on Card</Label>
                                                            <Input className="form-control" type="text"/>
                                                        </div>
                                                    </Col>
                                                    <Col md='6' sm='12'>
                                                        <div className="mb-3 card-label">
                                                            <Label for="card_number">Card Number</Label>
                                                            <Input className="form-control" type="text"  placeholder="1234 5678 9876 5432"/>
                                                          
                                                        </div>
                                                    </Col>
                                                    <Col md='6' sm='12'>
                                                        <div className="mb-3 card-label">
                                                            <Label for="expiry_month">Expiry Month</Label>
                                                            <Input className="form-control" id="expiry_month" placeholder="MM" type="text"/>
                                                        </div>
                                                    </Col>
                                                    <Col md='6' sm='12'>
                                                        <div className="mb-3 card-label">
                                                            <Label for="expiry_year">Expiry Year</Label>
                                                            <Input className="form-control" id="expiry_year" placeholder="YY" type="text"/>
                                                        </div>
                                                    </Col>
                                                    <Col md='6' sm='12'>
                                                        <div className="mb-3 card-label">
                                                            <Label for="cvv">CVV</Label>
                                                            <Input className="form-control" id="cvv" type="text"/>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>


                                            <div className="payment-list">
                                                <Label className="payment-radio paypal-option">
                                                    <Input type="radio" name="radio"/>
                                                        <span className="checkmark"></span>
                                                        Cash On Delivery
                                                </Label>
                                            </div>


                                            <div className="terms-accept">
                                                <div className="custom-checkbox">
                                                    <Input type="checkbox" id="terms_accept1"/>
                                                        <Label for="terms_accept1"> &nbsp; I have read and accept <Link to="#">Terms &amp; Conditions</Link></Label>
                                                </div>
                                            </div>

                                            <div className="submit-section mt-4">
                                                <Link to='/OrderSuccess' className="btn btn-primary submit-btn">Confirm and Pay</Link>
                                            </div>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='6' lg='5' className="theiaStickySidebar">
                            <Card className="booking-card">
                               <CardHeader>
                                    <h3 className="card-title">Your Order</h3>
                                </CardHeader>
                              <CardBody>
                                    <div className="table-responsive">
                                       <Table>
                                            <tr>
                                                <th>Product</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                            <tbody>
                                                <tr>
                                                    <td>Safi Natural Blood Purifier Syrup 200 ml Manufactured By Hamdard (Wakf) Laboratories</td>
                                                    <td className="text-end">200</td>
                                                </tr>
                                                <tr>
                                                    <td>Safi Natural Blood Purifier Syrup 200 ml</td>
                                                    <td className="text-end">200</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="booking-summary pt-5">
                                        <div className="booking-item-wrap">
                                            <ul className="booking-date d-block pb-0">
                                                <li>Subtotal <span>5,877.00</span></li>
                                                <li>Shipping <span>25.00</span></li>
                                            </ul>
                                            <ul className="booking-fee">
                                                <li>Tax <span>0.00</span></li>
                                            </ul>
                                            <div className="booking-total">
                                                <ul className="booking-total-list">
                                                    <li>
                                                        <span>Total</span>
                                                        <span className="total-cost">160</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer/>
        </>
    );
}