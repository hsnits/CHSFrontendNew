import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, ProgressBar, Alert } from "react-bootstrap";

import useGetMountData from "../../helpers/getDataHook";
import { callPutApi } from "../../_service";
import { toast } from "react-toastify";

const Availability = ({ userData, refreshData }) => {
  const [globalAvailability, setGlobalAvailability] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { data: hospitalData, getAllData } = useGetMountData(
    `/hospital/availability`
  );

  const [bedData, setBedData] = useState({
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    icuBeds: { total: 0, occupied: 0, available: 0 },
    emergencyBeds: { total: 0, occupied: 0, available: 0 },
    generalBeds: { total: 0, occupied: 0, available: 0 },
  });



  useEffect(() => {
    // Use userData first if available (faster than waiting for API)
    if (userData?.profile) {
      console.log("👤 Using userData for bed data:", userData.profile);
      
      const userBedData = {
        totalBeds: userData.profile.totalBeds || userData.profile.hospitalDetails?.bedCapacity || 0,
        occupiedBeds: 0, // Default to 0 for now
        availableBeds: userData.profile.totalBeds || userData.profile.hospitalDetails?.bedCapacity || 0,
        icuBeds: { 
          total: userData.profile.icuBeds || userData.profile.hospitalDetails?.icuBeds || 0, 
          occupied: 0, 
          available: userData.profile.icuBeds || userData.profile.hospitalDetails?.icuBeds || 0 
        },
        emergencyBeds: { 
          total: userData.profile.emergencyBeds || userData.profile.hospitalDetails?.emergencyBeds || 0, 
          occupied: 0, 
          available: userData.profile.emergencyBeds || userData.profile.hospitalDetails?.emergencyBeds || 0 
        },
        generalBeds: { 
          total: Math.max(0, (userData.profile.totalBeds || 0) - (userData.profile.icuBeds || 0) - (userData.profile.emergencyBeds || 0)), 
          occupied: 0, 
          available: Math.max(0, (userData.profile.totalBeds || 0) - (userData.profile.icuBeds || 0) - (userData.profile.emergencyBeds || 0))
        },
      };
      
      setBedData(userBedData);
      console.log("🛏️ Bed data set from userData:", userBedData);
      setGlobalAvailability(
        typeof userData.profile.availability === 'boolean'
          ? userData.profile.availability
          : (userData.profile.isAvailable ?? true)
      );
    }
    
    // Also update when hospitalData from API is available
    if (hospitalData) {
      console.log("🏥 Hospital data received from API:", hospitalData);
      
      // Set bed data from the API response (this will override userData if available)
      if (hospitalData.bedData) {
        setBedData(hospitalData.bedData);
        console.log("🛏️ Bed data updated from API:", hospitalData.bedData);
      }
      
      // Set availability status
      setGlobalAvailability(
        typeof hospitalData.availability === 'boolean'
          ? hospitalData.availability
          : (hospitalData.isAvailable ?? true)
      );
      
      console.log("✅ Hospital availability component updated from API");
    }
  }, [hospitalData, userData]);

  const toggleGlobalAvailability = async () => {
    try {
      setUpdating(true);
      const newAvailability = !globalAvailability;
      
      const response = await callPutApi(`/hospital/availability`, {
        isAvailable: newAvailability,
      });

      if (response?.success || response?.status) {
        setGlobalAvailability(newAvailability);
        toast.success(
          `Hospital is now ${newAvailability ? "available" : "unavailable"} for new admissions`
        );
        getAllData();
        
        // Also refresh parent data
        if (refreshData) {
          refreshData();
        }
      } else {
        toast.error("Failed to update hospital availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update hospital availability");
    } finally {
      setUpdating(false);
    }
  };



  const updateBedCount = async (bedType, action) => {
    try {
      console.log("🛏️ Updating bed count:", { bedType, action, currentBedData: bedData });
      
      const newBedData = { ...bedData };
      
      if (bedType === "total") {
        if (action === "increase") {
          newBedData.totalBeds += 1;
          newBedData.availableBeds += 1;
        } else if (action === "decrease" && newBedData.availableBeds > 0) {
          newBedData.totalBeds -= 1;
          newBedData.availableBeds -= 1;
        }
      } else {
        // Handle specific bed types (icu, emergency, general)
        if (action === "occupy" && newBedData[bedType]?.available > 0) {
          newBedData[bedType].occupied += 1;
          newBedData[bedType].available -= 1;
          newBedData.occupiedBeds += 1;
          newBedData.availableBeds -= 1;
        } else if (action === "release" && newBedData[bedType]?.occupied > 0) {
          newBedData[bedType].occupied -= 1;
          newBedData[bedType].available += 1;
          newBedData.occupiedBeds -= 1;
          newBedData.availableBeds += 1;
        }
      }

      console.log("🛏️ New bed data to save:", newBedData);

      const response = await callPutApi(`/hospital/bed-management`, {
        bedData: newBedData,
      });

      console.log("📡 Bed management API response:", response);

      if (response?.success || response?.status) {
        setBedData(newBedData);
        toast.success("Bed count updated successfully");
        
        // Refresh the data to get updated values
        if (getAllData) {
          getAllData();
        }
        
        // Also refresh parent data for sidebar update
        if (refreshData) {
          refreshData();
        }
      } else {
        console.error("Bed update failed:", response);
        toast.error(response?.message || "Failed to update bed count");
      }
    } catch (error) {
      console.error("Error updating bed count:", error);
      toast.error(`Failed to update bed count: ${error.message}`);
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 80) return "danger";
    if (capacity >= 60) return "warning";
    return "success";
  };

  const occupancyRate = bedData.totalBeds > 0 
    ? Math.round((bedData.occupiedBeds / bedData.totalBeds) * 100)
    : 0;

  return (
    <div className="hospital-availability">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-0">
            <i className="fas fa-heartbeat me-2"></i>
            Hospital Availability Management
          </h4>
          <p className="text-muted">Monitor and manage hospital capacity, departments, and services</p>
        </Col>
      </Row>

      {/* Global Availability Toggle */}
      <Row className="mb-4">
        <Col>
          <Card className="availability-toggle-card">
            <Card.Body className="text-center">
              <div className="availability-status">
                <i className={`fas ${globalAvailability ? 'fa-hospital' : 'fa-hospital-symbol'} me-2`}></i>
                {globalAvailability ? "Hospital is AVAILABLE" : "Hospital is UNAVAILABLE"}
              </div>
              <p className="availability-description">
                {globalAvailability 
                  ? "Currently accepting new patients and admissions" 
                  : "Not accepting new patients at this time"}
              </p>
              <Button
                variant={globalAvailability ? "outline-light" : "light"}
                className="toggle-availability-btn"
                onClick={toggleGlobalAvailability}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className={`fas ${globalAvailability ? 'fa-times' : 'fa-check'} me-2`}></i>
                    {globalAvailability ? "Mark Unavailable" : "Mark Available"}
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bed Capacity Overview */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="capacity-overview">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-bed me-2"></i>
                Bed Capacity Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <div className="capacity-stat">
                    <div className="capacity-number text-primary">{bedData.totalBeds}</div>
                    <div className="capacity-label">Total Beds</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="capacity-stat">
                    <div className="capacity-number text-success">{bedData.availableBeds}</div>
                    <div className="capacity-label">Available</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="capacity-stat">
                    <div className="capacity-number text-warning">{bedData.occupiedBeds}</div>
                    <div className="capacity-label">Occupied</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="capacity-stat">
                    <div className="capacity-number text-info">{occupancyRate}%</div>
                    <div className="capacity-label">Occupancy Rate</div>
                  </div>
                </Col>
              </Row>
              
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Overall Capacity</span>
                  <span>{bedData.occupiedBeds}/{bedData.totalBeds}</span>
                </div>
                <ProgressBar 
                  now={occupancyRate} 
                  variant={getCapacityColor(occupancyRate)}
                  style={{ height: '10px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="quick-actions">
            <Card.Header>
              <h6 className="mb-0">Quick Bed Management</h6>
            </Card.Header>
            <Card.Body>
              <div className="bed-action-item">
                <span>ICU Beds: {bedData.icuBeds?.available || 0} available</span>
                <div className="btn-group btn-group-sm">
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => updateBedCount("icuBeds", "release")}
                  >
                    +
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => updateBedCount("icuBeds", "occupy")}
                  >
                    -
                  </Button>
                </div>
              </div>
              
              <div className="bed-action-item">
                <span>Emergency: {bedData.emergencyBeds?.available || 0} available</span>
                <div className="btn-group btn-group-sm">
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => updateBedCount("emergencyBeds", "release")}
                  >
                    +
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => updateBedCount("emergencyBeds", "occupy")}
                  >
                    -
                  </Button>
                </div>
              </div>
              
              <div className="bed-action-item">
                <span>General: {bedData.generalBeds?.available || 0} available</span>
                <div className="btn-group btn-group-sm">
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => updateBedCount("generalBeds", "release")}
                  >
                    +
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => updateBedCount("generalBeds", "occupy")}
                  >
                    -
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>



      {/* Alerts & Notifications */}
      {occupancyRate >= 90 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" className="capacity-alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Critical Capacity Alert:</strong> Hospital is at {occupancyRate}% capacity. 
              Consider activating overflow protocols or redirecting non-emergency cases.
            </Alert>
          </Col>
        </Row>
      )}

      {occupancyRate >= 80 && occupancyRate < 90 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning" className="capacity-alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              <strong>High Capacity Warning:</strong> Hospital is at {occupancyRate}% capacity. 
              Monitor closely for potential overflow situations.
            </Alert>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Availability; 