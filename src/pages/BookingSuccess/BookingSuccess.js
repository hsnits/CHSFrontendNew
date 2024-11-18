import React from "react";
import { ArrowLeft, MapPin, Video } from "react-feather";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import user_img from "../../assets/img/doctor-profile-img.jpg";

export default function BookingSuccess() {
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="doctor-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="back-link">
                                <a href="/ConsultationType"><ArrowLeft /> Back</a>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                            <div className="success-content">
                                <div className="success-icon">
                                    <i className="fas fa-circle-check"></i>
                                </div>
                                <h4>Your Appointment Booked Succesfully</h4>
                            </div>
                            <div className="card booking-card">
                                <div className="card-body booking-card-body booking-list-body">
                                    <div className="booking-doctor-left booking-success-info">
                                        <div className="booking-doctor-img">
                                                <img src={user_img} alt="John Doe" className="img-fluid" />
                                        </div>
                                        <div className="booking-doctor-info">
                                            <h4>Dr. John Doe</h4>
                                            <p>MBBS, Dentist</p>
                                            <div className="booking-doctor-location">
                                                <p><MapPin size={15}/> Newyork, USA</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="booking-list">
                                        <div className="booking-date-list consultation-date-list">
                                            <ul>
                                                <li>Booking Date: <span>Sun, 30 Aug 2023</span></li>
                                                <li>Booking Time: <span>10.00AM to 11:00AM</span></li>
                                                <li>Type of Consultaion: <span><Video size={15}/> &nbsp; Video Consulting</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="success-btn">
                                <Link to="javascript:void(0);" className="btn btn-primary prime-btn">
                                    Add to Google Calendar
                                </Link>
                                <Link to="javascript:void(0);" className="btn btn-light">
                                    Appointment
                                </Link>
                            </div>
                            <div className="success-dashboard-link">
                                <Link to="/">
                                    <i className="fa-solid fa-arrow-left-long"></i> Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}