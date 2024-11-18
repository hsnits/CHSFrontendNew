import React from "react";
import doctor_img from '../../assets/img/doctor-profile-img.jpg';
import user_img from '../../assets/img/profile-06.jpg';
import Header from "../../components/Header";
import { Container, Nav, Row, Tab, Col } from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Calendar, Image, LogOut, Search } from "react-feather";
import { Link } from "react-router-dom";

function DoctorDashboard() {
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="content">
                <Container>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col lg='4' xl='3' className="theiaStickySidebar">
                                <div className="profile-sidebar doctor-sidebar profile-sidebar-new">
                                    <div className="widget-profile pro-widget-content">
                                        <div className="profile-info-widget">
                                            <Link to="#" className="booking-doc-img">
                                                <img src={doctor_img} alt="User Image" />
                                            </Link>
                                            <div className="profile-det-info">
                                                <h3><a href="#">Dr Edalin Hendry</a></h3>
                                                <div className="patient-details">
                                                    <h5 className="mb-0">BDS, MDS - Oral & Maxillofacial Surgery</h5>
                                                </div>
                                                <span className="badge doctor-role-badge"><i className="fa-solid fa-circle"></i>Dentist</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="doctor-available-head">
                                        <div className="input-block input-block-new">
                                            <label className="form-label">Availability <span className="text-danger">*</span></label>
                                            <select className="select form-control">
                                                <option>I am Available Now</option>
                                                <option>Not Available</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="dashboard-widget">
                                        <Nav variant="pills" className="flex-column dashboard-menu">

                                            <Nav.Item>
                                                <Nav.Link eventKey="first"> <i className="fa-solid fa-shapes"></i> Dashboard</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">  <Calendar /> Requests</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="third">  <i className="fa-solid fa-user-injured"></i> My Patients</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="fourth">  <Calendar /> Appointments</Nav.Link>
                                            </Nav.Item>
                                            {/* 
                                            <Nav.Item>
                                                <Nav.Link eventKey="fifth">  <MessageCircle /> Message</Nav.Link>
                                            </Nav.Item> */}
                                            <Nav.Item>
                                                <Nav.Link eventKey="fifth"> <i className="fa-solid fa-user-pen"></i> Profile Settings   </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="six"><LogOut /> Logout  </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                </div>

                            </Col>
                            <Col lg='8' xl='9'>

                                <Tab.Content>

                                    <Tab.Pane eventKey="first">
                                        <div className="dashboard-header">
                                            <h3>Dashboard</h3>
                                        </div>

                                        <div className="row">
                                            <div className="col-xl-4 d-flex">
                                                <div className="dashboard-box-col w-100">
                                                    <div className="dashboard-widget-box">
                                                        <div className="dashboard-content-info">
                                                            <h6>Total Patient</h6>
                                                            <h4>978</h4>
                                                            <span className="text-success"><i className="fa-solid fa-arrow-up"></i>15% From Last Week</span>
                                                        </div>
                                                        <div className="dashboard-widget-icon">
                                                            <span className="dash-icon-box"><i className="fa-solid fa-user-injured"></i></span>
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-widget-box">
                                                        <div className="dashboard-content-info">
                                                            <h6>Patients Today</h6>
                                                            <h4>80</h4>
                                                            <span className="text-danger"><i className="fa-solid fa-arrow-up"></i>15% From Yesterday</span>
                                                        </div>
                                                        <div className="dashboard-widget-icon">
                                                            <span className="dash-icon-box"><i className="fa-solid fa-user-clock"></i></span>
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-widget-box">
                                                        <div className="dashboard-content-info">
                                                            <h6>Appointments Today</h6>
                                                            <h4>50</h4>
                                                            <span className="text-success"><i className="fa-solid fa-arrow-up"></i>20% From Yesterday</span>
                                                        </div>
                                                        <div className="dashboard-widget-icon">
                                                            <span className="dash-icon-box"><i className="fa-solid fa-calendar-days"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-8 d-flex">
                                                <div className="dashboard-card w-100">
                                                    <div className="dashboard-card-head">
                                                        <div className="header-title">
                                                            <h5>Appointment</h5>
                                                        </div>
                                                        <div className="dropdown header-dropdown">
                                                            <a className="dropdown-toggle nav-tog" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                                Last 7 Days
                                                            </a>
                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                <a href="javascript:void(0);" className="dropdown-item">
                                                                    Today
                                                                </a>
                                                                <a href="javascript:void(0);" className="dropdown-item">
                                                                    This Month
                                                                </a>
                                                                <a href="javascript:void(0);" className="dropdown-item">
                                                                    Last 7 Days
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-card-body">
                                                        <div className="table-responsive">
                                                            <table className="table dashboard-table appoint-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="patient-info-profile">
                                                                                <a href="#" className="table-avatar">
                                                                                    <img src={user_img} alt="Img" />
                                                                                </a>
                                                                                <div className="patient-name-info">
                                                                                    <span>#Apt0001</span>
                                                                                    <h5><a href="#">Adrian Marshall</a></h5>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="appointment-date-created">
                                                                                <h6>11 Nov 2024 10.45 AM</h6>
                                                                                <span className="badge table-badge">General</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="apponiment-actions d-flex align-items-center">
                                                                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                                                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="patient-info-profile">
                                                                                <a href="#" className="table-avatar">
                                                                                    <img src={user_img} alt="Img" />
                                                                                </a>
                                                                                <div className="patient-name-info">
                                                                                    <span>#Apt0002</span>
                                                                                    <h5><a href="#">Kelly Stevens</a></h5>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="appointment-date-created">
                                                                                <h6>10 Nov 2024 11.00 AM</h6>
                                                                                <span className="badge table-badge">Clinic Consulting</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="apponiment-actions d-flex align-items-center">
                                                                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                                                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="patient-info-profile">
                                                                                <a href="#" className="table-avatar">
                                                                                    <img src={user_img} alt="Img" />
                                                                                </a>
                                                                                <div className="patient-name-info">
                                                                                    <span>#Apt0003</span>
                                                                                    <h5><a href="#">Samuel Anderson</a></h5>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="appointment-date-created">
                                                                                <h6>03 Nov 2024 02.00 PM</h6>
                                                                                <span className="badge table-badge">General</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="apponiment-actions d-flex align-items-center">
                                                                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                                                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="patient-info-profile">
                                                                                <a href="#" className="table-avatar">
                                                                                    <img src={user_img} alt="Img" />
                                                                                </a>
                                                                                <div className="patient-name-info">
                                                                                    <span>#Apt0004</span>
                                                                                    <h5><a href="#">Catherine Griffin</a></h5>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="appointment-date-created">
                                                                                <h6>01 Nov 2024 04.00 PM</h6>
                                                                                <span className="badge table-badge">Clinic Consulting</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="apponiment-actions d-flex align-items-center">
                                                                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                                                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="patient-info-profile">
                                                                                <a href="#" className="table-avatar">
                                                                                    <img src={user_img} alt="Img" />
                                                                                </a>
                                                                                <div className="patient-name-info">
                                                                                    <span>#Apt0005</span>
                                                                                    <h5><a href="#">Robert Hutchinson</a></h5>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="appointment-date-created">
                                                                                <h6>28 Oct 2024 05.30 PM</h6>
                                                                                <span className="badge table-badge">General</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="apponiment-actions d-flex align-items-center">
                                                                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                                                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-7 d-flex">
                                                <div className="dashboard-main-col w-100">
                                                    <div className="upcoming-appointment-card">
                                                        <div className="title-card">
                                                            <h5>Upcoming Appointment</h5>
                                                        </div>
                                                        <div className="upcoming-patient-info">
                                                            <div className="info-details">
                                                                <span className="img-avatar"><img src={user_img} alt="Img" /></span>
                                                                <div className="name-info">
                                                                    <span>#Apt0001</span>
                                                                    <h6>Adrian Marshall</h6>
                                                                </div>
                                                            </div>
                                                            <div className="date-details">
                                                                <span>General visit</span>
                                                                <h6>Today, 10:45 AM</h6>
                                                            </div>
                                                            <div className="circle-bg">
                                                                <img src="assets/img/bg/dashboard-circle-bg.png" alt='' />
                                                            </div>
                                                        </div>
                                                        <div className="appointment-card-footer">
                                                            <h5><i className="fa-solid fa-video"></i>Video Appointment</h5>
                                                            <div className="btn-appointments">
                                                                <a href="chat-doctor.html" className="btn">Chat Now</a>
                                                                <a href="doctor-appointment-start.html" className="btn">Start Appointment</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-5 d-flex">
                                                <div className="dashboard-card w-100">
                                                    <div className="dashboard-card-head">
                                                        <div className="header-title">
                                                            <h5>Clinics & Availability</h5>
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-card-body">
                                                        <div className="clinic-available">
                                                            <div className="clinic-head">
                                                                <div className="clinic-info">
                                                                    <span className="clinic-img">
                                                                        <img src={user_img} alt="Img" />
                                                                    </span>
                                                                    <h6>Sofi’s Clinic</h6>
                                                                </div>
                                                                <div className="clinic-charge">
                                                                    <span>$900</span>
                                                                </div>
                                                            </div>
                                                            <div className="available-time">
                                                                <ul>
                                                                    <li>
                                                                        <span>Tue :</span>
                                                                        07:00 AM - 09:00 PM
                                                                    </li>
                                                                    <li>
                                                                        <span>Wed : </span>
                                                                        07:00 AM - 09:00 PM
                                                                    </li>
                                                                </ul>
                                                                <div className="change-time">
                                                                    <a href="#">Change </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="second">
                                        <div class="dashboard-header">
                                            <h3>Requests</h3>
                                            <ul>
                                                <li>
                                                    <div class="dropdown header-dropdown">
                                                        <a class="dropdown-toggle nav-tog" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                            Last 7 Days
                                                        </a>
                                                        <div class="dropdown-menu dropdown-menu-end">
                                                            <a href="javascript:void(0);" class="dropdown-item">
                                                                Today
                                                            </a>
                                                            <a href="javascript:void(0);" class="dropdown-item">
                                                                This Month
                                                            </a>
                                                            <a href="javascript:void(0);" class="dropdown-item">
                                                                Last 7 Days
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="appointment-wrap">
                                            <ul>
                                                <li>
                                                    <div class="patinet-information">
                                                        <a href="#">
                                                            <img src={user_img} alt="User Image" />
                                                        </a>
                                                        <div class="patient-info">
                                                            <p>#Apt0001</p>
                                                            <h6><a href="#">Adrian</a><span class="badge new-tag">New</span></h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="appointment-info">
                                                    <p><i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                                                    <p class="md-text">General Visit</p>
                                                </li>
                                                <li class="appointment-type">
                                                    <p class="md-text">Type of Appointment</p>
                                                    <p><i class="fa-solid fa-video text-blue"></i>Video Call</p>
                                                </li>
                                                <li>
                                                    <ul class="request-action">
                                                        <li>
                                                            <a href="#" class="accept-link" data-bs-toggle="modal" data-bs-target="#accept_appointment"><i class="fa-solid fa-check"></i>Accept</a>
                                                        </li>
                                                        <li>
                                                            <a href="#" class="reject-link" data-bs-toggle="modal" data-bs-target="#cancel_appointment"><i class="fa-solid fa-xmark"></i>Reject</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>


                                        <div class="appointment-wrap">
                                            <ul>
                                                <li>
                                                    <div class="patinet-information">
                                                        <a href="#">
                                                            <img src={user_img} alt="User Image" />
                                                        </a>
                                                        <div class="patient-info">
                                                            <p>#Apt0002</p>
                                                            <h6><a href="#">Kelly</a></h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="appointment-info">
                                                    <p><i class="fa-solid fa-clock"></i>10 Nov 2024 02.00 PM</p>
                                                    <p class="md-text">General Visit</p>
                                                </li>
                                                <li class="appointment-type">
                                                    <p class="md-text">Type of Appointment</p>
                                                    <p><i class="fa-solid fa-building text-green"></i>Direct Visit <i class="fa-solid fa-circle-info" data-bs-toggle="tooltip" aria-label="Clinic Location Sofia’s Clinic" data-bs-original-title="Clinic Location Sofia’s Clinic"></i></p>
                                                </li>
                                                <li>
                                                    <ul class="request-action">
                                                        <li>
                                                            <a href="#" class="accept-link" data-bs-toggle="modal" data-bs-target="#accept_appointment"><i class="fa-solid fa-check"></i>Accept</a>
                                                        </li>
                                                        <li>
                                                            <a href="#" class="reject-link" data-bs-toggle="modal" data-bs-target="#cancel_appointment"><i class="fa-solid fa-xmark"></i>Reject</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>


                                        <div class="appointment-wrap">
                                            <ul>
                                                <li>
                                                    <div class="patinet-information">
                                                        <a href="#">
                                                            <img src={user_img} alt="User Image" />
                                                        </a>
                                                        <div class="patient-info">
                                                            <p>#Apt0003</p>
                                                            <h6><a href="#">Samuel</a></h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="appointment-info">
                                                    <p><i class="fa-solid fa-clock"></i>08 Nov 2024 08.30 AM</p>
                                                    <p class="md-text">Consultation for Cardio</p>
                                                </li>
                                                <li class="appointment-type">
                                                    <p class="md-text">Type of Appointment</p>
                                                    <p><i class="fa-solid fa-phone text-indigo"></i>Audio Call</p>
                                                </li>
                                                <li>
                                                    <ul class="request-action">
                                                        <li>
                                                            <a href="#" class="accept-link" data-bs-toggle="modal" data-bs-target="#accept_appointment"><i class="fa-solid fa-check"></i>Accept</a>
                                                        </li>
                                                        <li>
                                                            <a href="#" class="reject-link" data-bs-toggle="modal" data-bs-target="#cancel_appointment"><i class="fa-solid fa-xmark"></i>Reject</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="third">
                                        <div class="dashboard-header">
                                            <h3>My Patients</h3>
                                            <ul class="header-list-btns">
                                                <li>
                                                    <div class="input-block dash-search-input">
                                                        <input type="text" class="form-control" placeholder="Search" />
                                                        <span class="search-icon"><Search size={18} /></span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="row">

                                            <div class="col-xl-4 col-lg-6 col-md-6 d-flex">
                                                <div class="appointment-wrap appointment-grid-wrap">
                                                    <ul>
                                                        <li>
                                                            <div class="appointment-grid-head">
                                                                <div class="patinet-information">
                                                                    <a href="#">
                                                                        <img src={user_img} alt="User Image" />
                                                                    </a>
                                                                    <div class="patient-info">
                                                                        <p>#Apt0001</p>
                                                                        <h6><a href="#">Adrian</a></h6>
                                                                        <ul>
                                                                            <li>Age : 42</li>
                                                                            <li>Male</li>
                                                                            <li>AB+</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li class="appointment-info">
                                                            <p><i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                                                            <p class="mb-0"><i class="fa-solid fa-location-dot"></i>Alabama, USA</p>
                                                        </li>
                                                        <li class="appointment-action">
                                                            <div class="patient-book">
                                                                <p><i class="fa-solid fa-calendar-days"></i>Last Booking <span>27 Feb 2024</span></p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey='fourth'>
                                        <div class="dashboard-header">
                                            <h3>Appointments</h3>
                                        </div>
                                        <div class="appointment-tab-head">
                                            <div class="appointment-tabs">
                                                <ul class="nav nav-pills inner-tab " id="pills-tab" role="tablist">
                                                    <li class="nav-item" role="presentation">
                                                        <button class="nav-link active" id="pills-upcoming-tab" data-bs-toggle="pill" data-bs-target="#pills-upcoming" type="button" role="tab" aria-controls="pills-upcoming" aria-selected="true">Upcoming<span>21</span></button>
                                                    </li>
                                                    <li class="nav-item" role="presentation">
                                                        <button class="nav-link" id="pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#pills-cancel" type="button" role="tab" aria-controls="pills-cancel" aria-selected="false" tabindex="-1">Cancelled<span>16</span></button>
                                                    </li>
                                                    <li class="nav-item" role="presentation">
                                                        <button class="nav-link" id="pills-complete-tab" data-bs-toggle="pill" data-bs-target="#pills-complete" type="button" role="tab" aria-controls="pills-complete" aria-selected="false" tabindex="-1">Completed<span>214</span></button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="tab-content appointment-tab-content">
                                            <div class="tab-pane fade show active" id="pills-upcoming" role="tabpanel" aria-labelledby="pills-upcoming-tab">

                                                <div class="appointment-wrap">
                                                    <ul>
                                                        <li>
                                                            <div class="patinet-information">
                                                                <a href="#">
                                                                    <img src={user_img} alt="User Image" />
                                                                </a>
                                                                <div class="patient-info">
                                                                    <p>#Apt0001</p>
                                                                    <h6><a href="#">Dr Edalin</a></h6>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li class="appointment-info">
                                                            <p><i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                                                            <ul class="d-flex apponitment-types">
                                                                <li>General Visit</li>
                                                                <li>Video Call</li>
                                                            </ul>
                                                        </li>
                                                        <li class="mail-info-patient">
                                                            <ul>
                                                                <li><i class="fa-solid fa-envelope"></i>edalin@example.com</li>
                                                                <li><i class="fa-solid fa-phone"></i>+1 504 368 6874</li>
                                                            </ul>
                                                        </li>
                                                        <li class="appointment-action">
                                                            <ul>
                                                                <li>
                                                                    <a href="#"><i class="fa-solid fa-eye"></i></a>
                                                                </li>
                                                                <li>
                                                                    <a href="#"><i class="fa-solid fa-comments"></i></a>
                                                                </li>
                                                                <li>
                                                                    <a href="#"><i class="fa-solid fa-xmark"></i></a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li class="appointment-detail-btn">
                                                            <a href="#" class="start-link"><i class="fa-solid fa-calendar-check me-1"></i>Attend</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="tab-pane fade" id="pills-cancel" role="tabpanel" aria-labelledby="pills-cancel-tab">

                                                <div class="appointment-wrap">
                                                    <ul>
                                                        <li>
                                                            <div class="patinet-information">
                                                                <a href="#">
                                                                    <img src={user_img} alt="User Image" />
                                                                </a>
                                                                <div class="patient-info">
                                                                    <p>#Apt00011</p>
                                                                    <h6><a href="#">Dr Edalin</a></h6>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li class="appointment-info">
                                                            <p><i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                                                            <ul class="d-flex apponitment-types">
                                                                <li>General Visit</li>
                                                                <li>Video Call</li>
                                                            </ul>
                                                        </li>
                                                        <li class="appointment-detail-btn">
                                                            <a href="#" class="start-link">View Details<i class="fa-regular fa-circle-right ms-1"></i></a>
                                                        </li>
                                                    </ul>
                                                </div>

                                            </div>
                                            <div class="tab-pane fade" id="pills-complete" role="tabpanel" aria-labelledby="pills-complete-tab">

                                                <div class="appointment-wrap">
                                                    <ul>
                                                        <li>
                                                            <div class="patinet-information">
                                                                <a href="#">
                                                                    <img src={user_img} alt="User Image" />
                                                                </a>
                                                                <div class="patient-info">
                                                                    <p>#Apt0001</p>
                                                                    <h6><a href="#">Dr Edalin</a></h6>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li class="appointment-info">
                                                            <p><i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                                                            <ul class="d-flex apponitment-types">
                                                                <li>General Visit</li>
                                                                <li>Video Call</li>
                                                            </ul>
                                                        </li>
                                                        <li class="appointment-detail-btn">
                                                            <a href="#" class="start-link">View Details<i class="fa-regular fa-circle-right ms-1"></i></a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey='fifth'>

                                            <div className="dashboard-header">
                                                <h3>Profile Settings</h3>
                                            </div>

                                            <div className="setting-title">
                                                <h5>Profile</h5>
                                            </div>
                                            <form>
                                                <div className="setting-card">
                                                    <div className="change-avatar img-upload">
                                                        <div className="profile-img">
                                                            <Image/>
                                                        </div>
                                                        <div className="upload-img">
                                                            <h5>Profile Image</h5>
                                                            <div className="imgs-load d-flex align-items-center">
                                                                <div className="change-photo">
                                                                    Upload New
                                                                    <input type="file" className="upload"/>
                                                                </div>
                                                                <Link to='#' className="upload-remove">Remove</Link>
                                                            </div>
                                                            <p className="form-text">Your Image should Below 4 MB, Accepted format jpg,png,svg</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="setting-title">
                                                    <h5>Information</h5>
                                                </div>
                                                <div className="setting-card">
                                                    <Row>
                                                        <Col lg='4' md='6'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">First Name <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control"/>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' md='6'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">Last Name <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control"/>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' md='6'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">Display Name <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control"/>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' md='6'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">Designation <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control"/>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' md='6'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">Phone Numbers <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control"/>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' md='6'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">Email Address <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control"/>
                                                            </div>
                                                        </Col>
                                                        <Col lg='12' md='12'>
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">Known Languages <span className="text-danger">*</span></label>
                                                                <div className="input-block input-block-new mb-0">
                                                                    <div className="bootstrap-tagsinput"><span className="tag badge badge-info">English German<span data-role="remove"></span></span> <span class="tag badge badge-info">Portugese<span data-role="remove"></span></span> <input type="text" placeholder="Type New"/></div>
                                                                        <a href="#" className="input-text save-btn">Save</a>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </form>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Container>
            </div>
            <Footer />
        </>
    )
}

export default DoctorDashboard