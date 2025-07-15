import React from "react";
import { Col, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import user_img from "../../assets/img/dr_profile.jpg";

const SideBar = ({ data }) => {
  const location = useLocation(); // Get current URL location

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
                <Link to="#">{data?.profile?.firstName}</Link>
              </h3>
              <div className="patient-details">
                <h5 className="mb-0">Patient ID : {data?._id}</h5>
              </div>
              <span>
              <i className="fa-solid fa-circle"></i>{" "}
                {data?.profile?.gender} 
                /{data?.profile?.age || ""}
              </span>
            </div>
          </div>
        </div>
        <div className="dashboard-widget">
          <Nav variant="pills" className="flex-column dashboard-menu">
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=first`} eventKey="first">
                <i className="fa-solid fa-shapes"></i> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=second`} eventKey="second">
                <i className="fa-solid fa-calendar-days"></i> My Appointments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=six`} eventKey="six">
                <i className="fa-solid fa-heart-pulse"></i> Symptoms
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=seven`} eventKey="seven">
                <i className="fa-solid fa-file-medical"></i> Symptom Reports
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=third`} eventKey="third">
                <i className="fa-solid fa-shield-halved"></i> Health Reports
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=orders`} eventKey="orders">
                <i className="fa-solid fa-box"></i> My Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=subscription`} eventKey="subscription">
                <i className="fa-solid fa-crown"></i> My Subscription
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${location.pathname}?key=fourth`} eventKey="fourth">
                <i className="fa-solid fa-user-pen"></i> Profile Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </Col>
  );
};

export default SideBar;
