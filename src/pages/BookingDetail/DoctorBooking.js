import React from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { Row, Col, Container, Card, CardBody } from "react-bootstrap";
import BookingSummary from "../../components/doctorBooking/BookingSummary";
import { ArrowDownRight } from "react-feather";

export default function DoctorBooking() {
  return (
    <>
      <Header />
      <Breadcrumb />
      <div class="content content-space">
        <Container>
          <Row>
            <Col lg="8" md="12">
              <div class="booking-header">
                <h4 class="booking-title">Select Available Slots</h4>
              </div>
              <div class="booking-date choose-date-book">
                <p>Choose Date</p>
                {/* <div class="booking-range">
                                    <div class="bookingrange btn">
                                        <img src="assets/img/icons/today-icon.svg" alt="calendar-mage"/>
                                            <span></span>
                                            <i class="fas fa-chevron-down"></i>
                                    </div>
                                </div> */}
              </div>
              <Card class="booking-card">
                <CardBody class="time-slot-card-body">
                  <Row>
                    <Col lg="4" md="4">
                      <div class="time-slot time-slot-blk">
                        <h4>Morning</h4>
                        <div class="time-slot-list">
                          <ul>
                            <li>
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 10:00 - 10:30
                                </span>
                              </a>
                            </li>
                            <li>
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 10:30 - 11:30
                                </span>
                              </a>
                            </li>
                            <li class="time-slot-open time-slot-morning">
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 11:00 - 11:30
                                </span>
                              </a>
                            </li>
                            <li>
                              <div class="load-more-timings load-more-morning">
                                <a href="javascript:void(0);">Load More</a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col lg="4" md="4">
                      <div class="time-slot time-slot-blk">
                        <h4>Afternoon</h4>
                        <div class="time-slot-list">
                          <ul>
                            <li>
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 12:00 - 12:30
                                </span>
                              </a>
                            </li>
                            <li>
                              <a
                                class="timing active"
                                href="javascript:void(0);"
                              >
                                <span>
                                  <i class="feather-clock"></i> 01:00 - 01:30
                                </span>
                              </a>
                            </li>
                            <li class="time-slot-open time-slot-afternoon">
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 02:30 - 03:00
                                </span>
                              </a>
                            </li>
                            <li>
                              <div class="load-more-timings load-more-afternoon">
                                <a href="javascript:void(0);">Load More</a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col lg="4" md="4">
                      <div class="time-slot time-slot-blk">
                        <h4>Evening</h4>
                        <div class="time-slot-list">
                          <ul>
                            <li>
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 03:00 - 03:30
                                </span>
                              </a>
                            </li>
                            <li>
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 04:00 - 04:30
                                </span>
                              </a>
                            </li>
                            <li class="time-slot-open time-slot-evening">
                              <a class="timing" href="javascript:void(0);">
                                <span>
                                  <i class="feather-clock"></i> 05:00 - 05:30
                                </span>
                              </a>
                            </li>
                            <li>
                              <div class="load-more-timings load-more-evening">
                                <a href="javascript:void(0);">Load More</a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <div class="booking-btn">
                <Link
                  to="/PatientDetails"
                  class="btn btn-primary prime-btn justify-content-center align-items-center"
                >
                  Next <ArrowDownRight />
                </Link>
              </div>
            </Col>
            <BookingSummary />
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}
