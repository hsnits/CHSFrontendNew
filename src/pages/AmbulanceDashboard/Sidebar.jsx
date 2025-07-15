import React, { useState, useEffect } from "react";
import { Nav, Card, Form, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { callPutApi, callGetApi } from "../../_service";
import { toast } from "react-toastify";

const Sidebar = ({ userData, profileData }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first";
  
  const [availability, setAvailability] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Load availability data when component mounts or profileData changes
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        // First try to get from profileData
        if (profileData?.availability !== undefined) {
          setAvailability(profileData.availability);
        } else {
          // Otherwise fetch from API
          const response = await callGetApi('/ambulance/availability');
          if (response?.success) {
            setAvailability(response.data.isAvailable);
          }
        }
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
  }, [profileData]);

  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      const newAvailability = !availability;
      
      // Get current availability data first
      const currentResponse = await callGetApi('/ambulance/availability');
      if (!currentResponse?.success) {
        throw new Error('Failed to get current availability');
      }

      // Update with new availability status
      const updateData = {
        ...currentResponse.data,
        isAvailable: newAvailability
      };

      const response = await callPutApi('/ambulance/availability', updateData);

      if (response?.success) {
        setAvailability(newAvailability);
        toast.success(
          `You are now ${newAvailability ? "available" : "unavailable"} for service requests`
        );
      } else {
        toast.error(response?.message || "Failed to update availability");
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
    <div className="ambulance-sidebar">
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
                <i className="fas fa-ambulance"></i>
              </div>
            )}
          </div>
          <h5 className="mb-2">
            {profileData?.firstName || userData?.name || "Ambulance Driver"}
          </h5>
          <p className="text-muted small mb-3">
            {profileData?.displayName || "Emergency Services"}
          </p>
          
          {/* Availability Toggle */}
          <div className="availability-toggle">
            <Form.Check
              type="switch"
              id="availability-switch"
              label={availability ? "Available" : "Unavailable"}
              checked={availability}
              onChange={toggleAvailability}
              disabled={updating}
              className={`availability-switch ${availability ? "available" : "unavailable"}`}
            />
            <small className="text-muted d-block mt-1">
              {availability ? "Ready for emergency calls" : "Currently offline"}
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
                <i className="fas fa-calendar-check me-2"></i>
                Service Requests
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
                <i className="fas fa-user-cog me-2"></i>
                Profile Settings
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
              <i className="fas fa-route"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Rides</span>
              <span className="stat-value">{profileData?.totalRides || 0}</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Rating</span>
              <span className="stat-value">
                {profileData?.rating || 0}/5
              </span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Response Time</span>
              <span className="stat-value">
                {profileData?.avgResponseTime || "N/A"}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sidebar; 