import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import biomedical_img from "../../assets/img/dr_profile.jpg";
import { callPutApi } from "../../_service";
import { STORAGE } from "../../constants";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { toastMessage } from "../../config/toast";

const Sidebar = ({ biomedicalDetails, getAllData }) => {
  const profile = biomedicalDetails?.profile || {};
  const { firstName, lastName, designation = "Biomedical Engineer", isAvailable = false } = profile;

  const [isAvailability, setAvailability] = useState(isAvailable);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current active key from URL
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first";

  // Update availability state when biomedicalDetails changes
  useEffect(() => {
    const currentAvailability = biomedicalDetails?.profile?.isAvailable ?? false;
    setAvailability(currentAvailability);
  }, [biomedicalDetails?.profile?.isAvailable]);

  const handleTabClick = (key) => {
    navigate(`${location.pathname}?key=${key}`);
  };

  const handleUpdate = async (isAvl) => {
    console.log("Updating availability to:", isAvl);
    console.log("biomedicalDetails:", biomedicalDetails);
    
    if (!biomedicalDetails?._id) {
      toastMessage("error", "Biomedical details not found");
      return;
    }
    
    setAvailability(isAvl);
    try {
      const verifyResponse = await callPutApi(
        `/biomedical/availability`,
        { isAvailable: isAvl }
      );

      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      toastMessage("success", "Biomedical engineer availability updated successfully");

      const userProfile = getLocalStorage(STORAGE.USER_KEY);
      const updatedStorage = {
        ...userProfile,
        profile: {
          ...userProfile.profile,
          isAvailable: isAvl,
        },
      };

      setLocalStorage(STORAGE.USER_KEY, updatedStorage);
      
      // Force a refresh of the user data
      if (getAllData) {
        await getAllData();
      }
    } catch (error) {
      console.error("Availability update error:", error);
      setAvailability(!isAvl);
      toastMessage("error", error.message || "Failed to update availability");
    }
  };

  return (
    <div>
      <div className="profile-sidebar biomedical-sidebar profile-sidebar-new">
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <Link to="#" className="booking-doc-img">
              <img 
                src={biomedicalDetails?.profile?.coverImage || biomedicalDetails?.coverImage || biomedical_img} 
                alt="Biomedical Engineer" 
              />
            </Link>
            <div className="profile-det-info">
              <h3>
                <a href="#">{`${firstName || ""} ${lastName || ""}`}</a>
              </h3>
              <span className="badge biomedical-role-badge">
                <i className="fa-solid fa-circle"></i> {designation}
              </span>
            </div>
          </div>
        </div>

        <div className="biomedical-available-head">
          <div className="input-block input-block-new">
            <label className="form-label">
              Service Availability <span className="text-danger">*</span>
            </label>
            <select
              className="select form-control"
              value={isAvailability ? "true" : "false"}
              onChange={(e) => handleUpdate(e.target.value === "true")}
            >
              <option value="true">Available for Service</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="dashboard-menu">
            <ul className="nav nav-pills flex-column">
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeKey === "first" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick("first");
                  }}
                >
                  <i className="fa-solid fa-chart-line"></i> Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeKey === "second" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick("second");
                  }}
                >
                  <i className="fa-solid fa-tools"></i> Service Requests
                </a>
              </li>
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeKey === "third" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick("third");
                  }}
                >
                  <i className="fa-solid fa-calendar-alt"></i> Availability
                </a>
              </li>
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeKey === "fourth" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick("fourth");
                  }}
                >
                  <i className="fa-solid fa-user-cog"></i> Profile Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 