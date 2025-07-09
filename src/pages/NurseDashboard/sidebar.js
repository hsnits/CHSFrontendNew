import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import nurse_img from "../../assets/img/dr_profile.jpg";
import { callPutApi } from "../../_service";
import { STORAGE } from "../../constants";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { toastMessage } from "../../config/toast";

const Sidebar = ({ UserDetails }) => {
  const { firstName, lastName, designation, availability } = UserDetails?.profile || {};
  const [isAvailability, setAvailability] = useState(availability || false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (key) => {
    navigate(`${location.pathname}?key=${key}`);
  };

  const handleUpdate = async (isAvl) => {
    setAvailability(isAvl);
    try {
      const verifyResponse = await callPutApi(
        `/nurse/${UserDetails?._id}/availability`,
        { availability: isAvl }
      );

      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      toastMessage("success", "Your availability is updated now");

      const userProfile = getLocalStorage(STORAGE.USER_KEY);
      const profile = userProfile.profile;

      const updatedStorage = {
        ...userProfile,
        profile: {
          ...profile,
          availability: isAvl,
        },
      };

      setLocalStorage(STORAGE.USER_KEY, updatedStorage);
    } catch (error) {
      setAvailability(!isAvl);
      toastMessage("error", error.message || "Availability update process failed!");
    }
  };

  return (
    <div>
      <div className="profile-sidebar nurse-sidebar profile-sidebar-new">
        {/* Profile Header */}
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <Link to="#" className="booking-nurse-img">
              <img
                src={UserDetails?.coverImage || nurse_img}
                alt="User"
              />
            </Link>
            <div className="profile-det-info">
              <h3>
                <a href="#">
                  RN {`${firstName || ""} ${lastName || ""}`} 
                </a>
              </h3>
              <span className="badge nurse-role-badge">
                <i className="fa-solid fa-circle"></i>{" "}
                {designation || "Registered Nurse"}
              </span>
            </div>
          </div>
        </div>

        {/* Availability Switch */}
        <div className="nurse-available-head" style={{ margin:"0 20px 0 20px" }}>
          <div className="input-block input-block-new">
            <label className="form-label">
              Availability <span className="text-danger">*</span>
            </label>
            <select
              className="select form-control"
              value={isAvailability ? "true" : "false"}
              onChange={(e) => handleUpdate(e.target.value === "true")}
            >
              <option value="true">I am Available Now</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="dashboard-widget">
          <Nav variant="pills" className="flex-column dashboard-menu">
            <Nav.Item>
              <Nav.Link eventKey="first" onClick={() => handleTabClick("first")}>
                <i className="fa-solid fa-shapes"></i> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second" onClick={() => handleTabClick("second")}>
                <i className="fa-solid fa-calendar-days"></i> Requests
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third" onClick={() => handleTabClick("third")}>
                <i className="fa-solid fa-user-injured"></i> My Patients
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth" onClick={() => handleTabClick("fourth")}>
                <i className="fa-solid fa-calendar-check"></i> Appointments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="availability" onClick={() => handleTabClick("availability")}>
                <i className="fa-solid fa-clock"></i> Availability
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sixth" onClick={() => handleTabClick("sixth")}>
                <i className="fa-solid fa-user-pen"></i> Profile Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
