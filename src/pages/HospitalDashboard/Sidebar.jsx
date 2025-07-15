import React, { useState } from "react";
import { Nav, Card, Form, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { callPutApi } from "../../_service";
import { toast } from "react-toastify";

const Sidebar = ({ userData }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first";
  
  const [availability, setAvailability] = useState(
    typeof userData?.profile?.availability === 'boolean'
      ? userData.profile.availability
      : (typeof userData?.profile?.acceptingPatients === 'boolean'
          ? userData.profile.acceptingPatients
          : (userData?.profile?.availabilityDetails?.appointmentBooking ?? true))
  );
  const [updating, setUpdating] = useState(false);

  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      const newAvailability = !availability;
      
      const response = await callPutApi(`/hospital/availability`, {
        acceptingPatients: newAvailability,
      });

      if (response?.success || response?.status) {
        setAvailability(newAvailability);
        toast.success(
          `Hospital is now ${newAvailability ? "available" : "unavailable"} for admissions`
        );
      } else {
        toast.error("Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    } finally {
      setUpdating(false);
    }
  };

  const getNavLink = (key) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("key", key);
    return `${location.pathname}?${currentParams.toString()}`;
  };

  return (
    <div className="hospital-sidebar">
      {/* Profile Card */}
      <Card className="profile-card mb-4">
        <Card.Body className="text-center">
          <div className="profile-avatar mb-3">
            {userData?.coverImage ? (
              <img
                src={userData.coverImage}
                alt="Profile"
                className="rounded-circle"
                width="80"
                height="80"
              />
            ) : (
              <div className="default-avatar">
                <i className="fas fa-hospital"></i>
              </div>
            )}
          </div>
          <h5 className="mb-2">
            {userData?.profile?.firstName || userData?.name || "Hospital"}
          </h5>
          <p className="text-muted small mb-3">
            {userData?.profile?.displayName || "Healthcare Facility"}
          </p>
          
          {/* Availability Toggle */}
          <div className="availability-toggle">
            <Form.Check
              type="switch"
              id="availability-switch"
              label={availability ? "Accepting Patients" : "Not Accepting"}
              checked={availability}
              onChange={toggleAvailability}
              disabled={updating}
              className={`availability-switch ${availability ? "available" : "unavailable"}`}
            />
            <small className="text-muted d-block mt-1">
              {availability ? "Currently accepting new admissions" : "Not accepting new patients"}
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Navigation Menu */}
      <Card className="navigation-card">
        <Card.Header>
          <h6 className="mb-0">Dashboard Menu</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Nav variant="pills" className="flex-column sidebar-nav">
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={getNavLink("first")}
                active={activeKey === "first"}
                className="sidebar-nav-link"
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={getNavLink("second")}
                active={activeKey === "second"}
                className="sidebar-nav-link"
              >
                <i className="fas fa-bed me-2"></i>
                Admissions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={getNavLink("third")}
                active={activeKey === "third"}
                className="sidebar-nav-link"
              >
                <i className="fas fa-clock me-2"></i>
                Availability
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={getNavLink("fourth")}
                active={activeKey === "fourth"}
                className="sidebar-nav-link"
              >
                <i className="fas fa-hospital-user me-2"></i>
                Hospital Profile
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Body>
      </Card>

      {/* Quick Stats */}
      <Card className="stats-card">
        <Card.Header>
          <h6 className="mb-0">Quick Stats</h6>
        </Card.Header>
        <Card.Body>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-bed"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Beds</span>
              <span className="stat-value">
                {(() => {
                  const bedCount = userData?.profile?.hospitalDetails?.bedCapacity || 
                                  userData?.profile?.totalBeds || 
                                  userData?.profile?.bedCapacity ||
                                  0;
                  console.log("🛏️ Sidebar bed count calculation:", {
                    userData: JSON.stringify(userData, null, 2),
                    finalValue: bedCount
                  });
                  return bedCount;
                })()}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Doctors</span>
              <span className="stat-value">
                {userData?.profile?.hospitalDetails?.totalDoctors || 
                 userData?.profile?.doctorCount || 0}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-user-nurse"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Nurses</span>
              <span className="stat-value">
                {userData?.profile?.hospitalDetails?.totalNurses || 
                 userData?.profile?.nurseCount || 0}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Rating</span>
              <span className="stat-value">
                {userData?.profile?.rating || 0}/5
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Emergency Contact */}
      <Card className="emergency-card">
        <Card.Header>
          <h6 className="mb-0">Emergency Contact</h6>
        </Card.Header>
        <Card.Body>
          <div className="emergency-info">
            <div className="emergency-number">
              <i className="fas fa-phone-alt me-2"></i>
              <span>{userData?.profile?.emergencyNumber || "Not Available"}</span>
            </div>
            <small className="text-muted d-block mt-2">
              24/7 Emergency Services
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sidebar; 