import React from "react";
import { Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import user_img from "../../assets/img/profile-06.jpg";

const SideBar = ({ data }) => {
  return (
    <Col xl="3" lg="4" className="theiaStickySidebar">
      <div className="profile-sidebar patient-sidebar profile-sidebar-new">
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <Link to="#" className="booking-doc-img">
              <img src={data?.coverImage ?? user_img} alt="User Image" />
            </Link>
            <div className="profile-det-info">
              <h3>
                <Link href="#">{data?.profile?.firstName}</Link>
              </h3>
              <div className="patient-details">
                <h5 className="mb-0">Patient ID : {data?._id}</h5>
              </div>
              <span>
                {data?.profile?.gender} <i className="fa-solid fa-circle"></i>{" "}
                {data?.profile?.age}
              </span>
            </div>
          </div>
        </div>
        <div className="dashboard-widget">
          <Nav variant="pills" className="flex-column dashboard-menu">
            <Nav.Item>
              <Nav.Link eventKey="first">
                {" "}
                <i className="fa-solid fa-shapes"></i> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">
                {" "}
                <i className="fa-solid fa-calendar-days"></i> My Appointments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="six">
                {" "}
                <i className="fa-solid fa-calendar-days"></i> Symptoms
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">
                {" "}
                <i className="fa-solid fa-shield-halved"></i> Health Report
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth">
                {" "}
                <i className="fa-solid fa-user-pen"></i> Profile Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fifth">
                {" "}
                <i className="fa-solid fa-calendar-check"></i> Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </Col>
  );
};

export default SideBar;
