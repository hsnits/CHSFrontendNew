import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import lab_img from "../../assets/img/dr_profile.jpg";
import { updateLabAvailability } from "../../redux/slices/pathologyApi";
import { STORAGE } from "../../constants";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { toastMessage } from "../../config/toast";

const Sidebar = ({ labDetails, getAllData }) => {
  const dispatch = useDispatch();
  const profile = labDetails?.profile || {};
  const { firstName, lastName, designation = "Lab Technician", available = false } = profile;

  const [isAvailability, setAvailability] = useState(available);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current active key from URL
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first";
  
  // Debug logging
  console.log("Sidebar - Current activeKey:", activeKey);
  console.log("Sidebar - Location:", location.pathname + location.search);
  console.log("Sidebar - labDetails:", labDetails);
  console.log("Sidebar - Profile image sources:", {
    profileCoverImage: labDetails?.profile?.coverImage,
    coverImage: labDetails?.coverImage,
    fallback: lab_img
  });

  // Update availability state when labDetails changes
  useEffect(() => {
    const currentAvailability = labDetails?.profile?.available ?? false;
    setAvailability(currentAvailability);
  }, [labDetails?.profile?.available]);

  const handleTabClick = (key) => {
    navigate(`${location.pathname}?key=${key}`);
  };

  const handleUpdate = async (isAvl) => {
    console.log("Updating availability to:", isAvl);
    console.log("labDetails:", labDetails);
    
    if (!labDetails?._id) {
      toastMessage("error", "Lab details not found");
      return;
    }
    
    setAvailability(isAvl);
    try {
      const resultAction = await dispatch(updateLabAvailability({
        userId: labDetails._id,
        available: isAvl
      }));

      console.log("API result:", resultAction);

      if (updateLabAvailability.fulfilled.match(resultAction)) {
        toastMessage("success", "Lab availability updated successfully");

        const userProfile = getLocalStorage(STORAGE.USER_KEY);
        const updatedStorage = {
          ...userProfile,
          profile: {
            ...userProfile.profile,
            available: isAvl,
          },
        };

        setLocalStorage(STORAGE.USER_KEY, updatedStorage);
        
        // Force a refresh of the user data
        if (getAllData) {
          await getAllData("/user");
        }
      } else {
        console.error("API call failed:", resultAction.error);
        throw new Error(resultAction.error?.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Availability update error:", error);
      setAvailability(!isAvl);
      toastMessage("error", error.message || "Failed to update availability");
    }
  };

  return (
    <div>
      <div className="profile-sidebar pathology-sidebar profile-sidebar-new">
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <Link to="#" className="booking-doc-img">
              <img 
                src={labDetails?.profile?.coverImage || labDetails?.coverImage || lab_img} 
                alt="Lab" 
              />
            </Link>
            <div className="profile-det-info">
              <h3>
                <a href="#">{`${firstName || ""} ${lastName || ""}`}</a>
              </h3>
              <span className="badge lab-role-badge">
                <i className="fa-solid fa-circle"></i> {designation}
              </span>
            </div>
          </div>
        </div>

        <div className="lab-available-head">
          <div className="input-block input-block-new">
            <label className="form-label">
              Lab Availability <span className="text-danger">*</span>
            </label>
            <select
              className="select form-control"
              value={isAvailability ? "true" : "false"}
              onChange={(e) => handleUpdate(e.target.value === "true")}
            >
              <option value="true">Lab is Available Now</option>
              <option value="false">Lab is Closed</option>
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
                  <i className="fa-solid fa-flask"></i> Test Appointments
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
                  <i className="fa-solid fa-file-medical"></i> Test Results
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
                  <i className="fa-solid fa-chart-bar"></i> Analytics
                </a>
              </li>
              <li className="nav-item">
                <a 
                  href="#" 
                  className={`nav-link ${activeKey === "fifth" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick("fifth");
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
