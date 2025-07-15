import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Badge, Modal, Tab, Nav } from "react-bootstrap";
import { callPutApi, callGetApi } from "../../_service";
import { toast } from "react-toastify";

const Profile = ({ userData, refreshData }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newFacility, setNewFacility] = useState("");
  
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    displayName: "",
    hospitalName: "",
    email: "",
    phoneNumber: "",
    emergencyNumber: "",
    website: "",
    
    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    
    // Hospital Details
    hospitalType: "",
    establishedYear: "",
    totalBeds: "",
    icuBeds: "",
    emergencyBeds: "",
    operationTheaters: "",
    
    // Staff Information
    totalDoctors: "",
    totalNurses: "",
    totalStaff: "",
    
    // Registration & Certification
    registrationNumber: "",
    nabh_accredited: false,
    jci_accredited: false,
    iso_certified: false,
    
    // Services & Departments
    departments: [],
    facilities: [],
    emergencyServices: true,
    ambulanceService: true,
    pharmacyService: true,
    laboratoryService: true,
    
    // Working Hours
    workingHours: {
      monday: { isOpen: true, start: "00:00", end: "23:59" },
      tuesday: { isOpen: true, start: "00:00", end: "23:59" },
      wednesday: { isOpen: true, start: "00:00", end: "23:59" },
      thursday: { isOpen: true, start: "00:00", end: "23:59" },
      friday: { isOpen: true, start: "00:00", end: "23:59" },
      saturday: { isOpen: true, start: "00:00", end: "23:59" },
      sunday: { isOpen: true, start: "00:00", end: "23:59" },
    },
    
    // Availability
    isAvailable: true,
    acceptingPatients: true,
  });

  const hospitalTypes = [
    "General Hospital",
    "Multi-Specialty Hospital",
    "Super Specialty Hospital",
    "Teaching Hospital",
    "Trauma Center",
    "Children's Hospital",
    "Maternity Hospital",
    "Mental Health Hospital",
    "Rehabilitation Center",
    "Cancer Center",
  ];

  const commonDepartments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Oncology",
    "Emergency Medicine",
    "Internal Medicine",
    "Surgery",
    "Anesthesiology",
    "Radiology",
    "Pathology",
    "ICU",
    "Maternity",
  ];

  const commonFacilities = [
    "24/7 Emergency Services",
    "ICU/CCU",
    "Operation Theaters",
    "Blood Bank",
    "Pharmacy",
    "Laboratory",
    "Radiology",
    "CT Scan",
    "MRI",
    "Ultrasound",
    "X-Ray",
    "Dialysis Center",
    "Ambulance Service",
    "Cafeteria",
    "Parking",
  ];

  const daysOfWeek = [
    "monday", "tuesday", "wednesday", "thursday", 
    "friday", "saturday", "sunday"
  ];

  // Function to fetch hospital profile data
  const fetchHospitalProfile = async () => {
    try {
      console.log("🔄 Fetching hospital profile data...");
      const response = await callGetApi("hospital/profile");
      
      if (response.success && response.data) {
        const profileData = response.data;
        console.log("📊 Hospital profile data received:", profileData);
        
        // Convert numeric values to strings for form inputs
        const formDataToSet = {
          // Basic Information
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          displayName: profileData.displayName || "",
          hospitalName: profileData.hospitalName || "",
          email: profileData.email || userData?.email || "",
          phoneNumber: profileData.phoneNumber ? profileData.phoneNumber.toString() : (userData?.phoneNumber || ""),
          emergencyNumber: profileData.emergencyNumber || "",
          website: profileData.website || "",
          
          // Address Information
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          pincode: profileData.pincode || "",
          landmark: profileData.landmark || "",
          
          // Hospital Details
          hospitalType: profileData.hospitalType || "",
          establishedYear: profileData.establishedYear ? profileData.establishedYear.toString() : "",
          totalBeds: profileData.totalBeds ? profileData.totalBeds.toString() : "",
          icuBeds: profileData.icuBeds ? profileData.icuBeds.toString() : "",
          emergencyBeds: profileData.emergencyBeds ? profileData.emergencyBeds.toString() : "",
          operationTheaters: profileData.operationTheaters ? profileData.operationTheaters.toString() : "",
          
          // Staff Information
          totalDoctors: profileData.totalDoctors ? profileData.totalDoctors.toString() : "",
          totalNurses: profileData.totalNurses ? profileData.totalNurses.toString() : "",
          totalStaff: profileData.totalStaff ? profileData.totalStaff.toString() : "",
          
          // Registration & Certification
          registrationNumber: profileData.registrationNumber || "",
          nabh_accredited: profileData.nabh_accredited || false,
          jci_accredited: profileData.jci_accredited || false,
          iso_certified: profileData.iso_certified || false,
          
          // Services & Departments
          departments: Array.isArray(profileData.departments) ? profileData.departments : [],
          facilities: Array.isArray(profileData.facilities) ? profileData.facilities : [],
          emergencyServices: profileData.emergencyServices ?? true,
          ambulanceService: profileData.ambulanceService ?? true,
          pharmacyService: profileData.pharmacyService ?? true,
          laboratoryService: profileData.laboratoryService ?? true,
          
          // Working Hours - handle Map or Object
          workingHours: profileData.workingHours && typeof profileData.workingHours === 'object' ? 
            (profileData.workingHours instanceof Map ? Object.fromEntries(profileData.workingHours) : profileData.workingHours) : {
            monday: { isOpen: true, start: "00:00", end: "23:59" },
            tuesday: { isOpen: true, start: "00:00", end: "23:59" },
            wednesday: { isOpen: true, start: "00:00", end: "23:59" },
            thursday: { isOpen: true, start: "00:00", end: "23:59" },
            friday: { isOpen: true, start: "00:00", end: "23:59" },
            saturday: { isOpen: true, start: "00:00", end: "23:59" },
            sunday: { isOpen: true, start: "00:00", end: "23:59" },
          },
          
          // Availability
          isAvailable: profileData.isAvailable ?? true,
          acceptingPatients: profileData.acceptingPatients ?? true,
        };
        
        console.log("🔄 Setting form data from API:", formDataToSet);
        setFormData(formDataToSet);
        
        return true;
      } else {
        console.warn("❌ No hospital profile data found, using fallback data");
        return false;
      }
    } catch (error) {
      console.error("❌ Error fetching hospital profile:", error);
      toast.error("Failed to load profile data");
      return false;
    }
  };

  useEffect(() => {
    console.log("🔄 Profile component mounted/updated");
    
    // Try to fetch profile data from API first
    fetchHospitalProfile();
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child, subChild] = name.split(".");
      if (subChild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: type === "checkbox" ? checked : value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !formData.departments.includes(newDepartment.trim())) {
      setFormData((prev) => ({
        ...prev,
        departments: [...(prev.departments || []), newDepartment.trim()],
      }));
      setNewDepartment("");
      setShowDepartmentModal(false);
      toast.success("Department added successfully!");
      console.log("✅ Department added:", newDepartment.trim());
    } else if (formData.departments.includes(newDepartment.trim())) {
      toast.warning("This department is already added!");
      console.log("⚠️ Department already exists:", newDepartment.trim());
    } else {
      toast.error("Please enter a department name!");
      console.log("❌ Empty department name");
    }
  };

  const handleRemoveDepartment = (index) => {
    setFormData((prev) => ({
      ...prev,
      departments: (prev.departments || []).filter((_, i) => i !== index),
    }));
    toast.success("Department removed successfully!");
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...(prev.facilities || []), newFacility.trim()],
      }));
      setNewFacility("");
      setShowFacilityModal(false);
      toast.success("Facility added successfully!");
    } else if (formData.facilities.includes(newFacility.trim())) {
      toast.warning("This facility is already added!");
    } else {
      toast.error("Please enter a facility name!");
    }
  };

  const handleRemoveFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facilities: (prev.facilities || []).filter((_, i) => i !== index),
    }));
    toast.success("Facility removed successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Form submission started");
    
    // Basic validation
    if (!formData.hospitalName?.trim()) {
      toast.error("Hospital Name is required!");
      return;
    }
    
    if (!formData.email?.trim()) {
      toast.error("Email is required!");
      return;
    }
    
    if (!formData.phoneNumber?.toString().trim()) {
      toast.error("Phone Number is required!");
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Submitting form data:", formData);
      console.log("📋 Required fields check:", {
        hospitalName: formData.hospitalName || "MISSING",
        email: formData.email || "MISSING", 
        phoneNumber: formData.phoneNumber || "MISSING"
      });
      
      const response = await callPutApi(`/hospital/profile`, formData);

      console.log("API Response:", response);

      if (response?.status === true || response?.success === true) {
        toast.success("Hospital profile updated successfully!");
        console.log("✅ SUCCESS: Hospital profile updated successfully!");
        console.log("💾 Saved data structure:", response.data);
        
        if (refreshData) {
          console.log("🔄 Refreshing data to verify save...");
          await refreshData();
          
          // Add a small delay to ensure data is refreshed
          setTimeout(() => {
            console.log("🔍 Post-save verification complete");
          }, 1000);
        }
      } else {
        console.error("Update failed:", response);
        toast.error(response?.message || "Failed to update profile");
        console.log("❌ ERROR:", response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-profile">
      <Row className="mb-4">
        <Col>
          <h4 className="mb-0">
            <i className="fas fa-hospital-user me-2"></i>
            Hospital Profile Management
          </h4>
          <p className="text-muted">Manage your hospital information and settings</p>
          
          {/* Debug Information */}
          <div className="alert alert-info mt-3" style={{ fontSize: '12px' }}>
            <strong>Debug Info:</strong><br/>
            Hospital Name: "{formData.hospitalName}"<br/>
            Display Name: "{formData.displayName}"<br/>
            Email: "{formData.email}"<br/>
            Phone: "{formData.phoneNumber}"<br/>
            Form Data Keys: {Object.keys(formData).length} fields loaded<br/>
            userData.profile exists: {userData?.profile ? 'Yes' : 'No'}
          </div>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col lg={3}>
            <Card className="profile-tabs-card mb-4">
              <Card.Header>
                <h6 className="mb-0">Profile Sections</h6>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column profile-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="basic" className="profile-nav-link">
                      <i className="fas fa-info-circle me-2"></i>
                      Basic Information
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="details" className="profile-nav-link">
                      <i className="fas fa-hospital me-2"></i>
                      Hospital Details
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="services" className="profile-nav-link">
                      <i className="fas fa-cogs me-2"></i>
                      Services & Departments
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="hours" className="profile-nav-link">
                      <i className="fas fa-clock me-2"></i>
                      Working Hours
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={9}>
            <Form onSubmit={handleSubmit} noValidate>
              <Tab.Content>
                {/* Basic Information Tab */}
                <Tab.Pane eventKey="basic">
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        Basic Information
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Hospital Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="hospitalName"
                              value={formData.hospitalName || ""}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter hospital name"
                            />
                            {!formData.hospitalName && (
                              <small className="text-muted">
                                Debug: hospitalName = "{formData.hospitalName}"
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Display Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="displayName"
                              value={formData.displayName || ""}
                              onChange={handleInputChange}
                              placeholder="How you want to be displayed"
                            />
                            <small className="text-muted">
                              Debug: displayName = "{formData.displayName}"
                            </small>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Person First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Person Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number *</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Emergency Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="emergencyNumber"
                              value={formData.emergencyNumber}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://example.com"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Address Information */}
                      <hr />
                      <h6 className="mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Address Information
                      </h6>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                              type="text"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Landmark</Form.Label>
                            <Form.Control
                              type="text"
                              name="landmark"
                              value={formData.landmark}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Hospital Details Tab */}
                <Tab.Pane eventKey="details">
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="fas fa-hospital me-2"></i>
                        Hospital Details & Infrastructure
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Hospital Type</Form.Label>
                            <Form.Select
                              name="hospitalType"
                              value={formData.hospitalType}
                              onChange={handleInputChange}
                            >
                              <option value="">Select Hospital Type</option>
                              {hospitalTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Established Year</Form.Label>
                            <Form.Control
                              type="number"
                              name="establishedYear"
                              value={formData.establishedYear}
                              onChange={handleInputChange}
                              min="1800"
                              max={new Date().getFullYear()}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Total Beds</Form.Label>
                            <Form.Control
                              type="number"
                              name="totalBeds"
                              value={formData.totalBeds}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>ICU Beds</Form.Label>
                            <Form.Control
                              type="number"
                              name="icuBeds"
                              value={formData.icuBeds}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Emergency Beds</Form.Label>
                            <Form.Control
                              type="number"
                              name="emergencyBeds"
                              value={formData.emergencyBeds}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Operation Theaters</Form.Label>
                            <Form.Control
                              type="number"
                              name="operationTheaters"
                              value={formData.operationTheaters}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <hr />
                      <h6 className="mb-3">
                        <i className="fas fa-users me-2"></i>
                        Staff Information
                      </h6>

                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Total Doctors</Form.Label>
                            <Form.Control
                              type="number"
                              name="totalDoctors"
                              value={formData.totalDoctors}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Total Nurses</Form.Label>
                            <Form.Control
                              type="number"
                              name="totalNurses"
                              value={formData.totalNurses}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Total Staff</Form.Label>
                            <Form.Control
                              type="number"
                              name="totalStaff"
                              value={formData.totalStaff}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <hr />
                      <h6 className="mb-3">
                        <i className="fas fa-certificate me-2"></i>
                        Registration & Accreditation
                      </h6>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Registration Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="registrationNumber"
                              value={formData.registrationNumber}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <div className="mt-4">
                            <Form.Check
                              type="checkbox"
                              name="nabh_accredited"
                              label="NABH Accredited"
                              checked={formData.nabh_accredited}
                              onChange={handleInputChange}
                              className="mb-2"
                            />
                            <Form.Check
                              type="checkbox"
                              name="jci_accredited"
                              label="JCI Accredited"
                              checked={formData.jci_accredited}
                              onChange={handleInputChange}
                              className="mb-2"
                            />
                            <Form.Check
                              type="checkbox"
                              name="iso_certified"
                              label="ISO Certified"
                              checked={formData.iso_certified}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Services & Departments Tab */}
                <Tab.Pane eventKey="services">
                  <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <i className="fas fa-cogs me-2"></i>
                        Departments
                      </h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowDepartmentModal(true)}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add Department
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {formData.departments.length > 0 ? (
                        <div className="tags-container">
                          {formData.departments.map((dept, index) => (
                            <Badge
                              key={index}
                              bg="primary"
                              className="tag-badge me-2 mb-2"
                            >
                              {dept}
                              <Button
                                variant="link"
                                size="sm"
                                className="tag-remove"
                                onClick={() => handleRemoveDepartment(index)}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No departments added yet.</p>
                      )}
                    </Card.Body>
                  </Card>

                  <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <i className="fas fa-building me-2"></i>
                        Facilities
                      </h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowFacilityModal(true)}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add Facility
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {formData.facilities.length > 0 ? (
                        <div className="tags-container">
                          {formData.facilities.map((facility, index) => (
                            <Badge
                              key={index}
                              bg="success"
                              className="tag-badge me-2 mb-2"
                            >
                              {facility}
                              <Button
                                variant="link"
                                size="sm"
                                className="tag-remove"
                                onClick={() => handleRemoveFacility(index)}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No facilities added yet.</p>
                      )}
                    </Card.Body>
                  </Card>

                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="fas fa-plus-square me-2"></i>
                        Available Services
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Check
                            type="checkbox"
                            name="emergencyServices"
                            label="24/7 Emergency Services"
                            checked={formData.emergencyServices}
                            onChange={handleInputChange}
                            className="mb-3"
                          />
                          <Form.Check
                            type="checkbox"
                            name="ambulanceService"
                            label="Ambulance Service"
                            checked={formData.ambulanceService}
                            onChange={handleInputChange}
                            className="mb-3"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="checkbox"
                            name="pharmacyService"
                            label="In-house Pharmacy"
                            checked={formData.pharmacyService}
                            onChange={handleInputChange}
                            className="mb-3"
                          />
                          <Form.Check
                            type="checkbox"
                            name="laboratoryService"
                            label="Laboratory Services"
                            checked={formData.laboratoryService}
                            onChange={handleInputChange}
                            className="mb-3"
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Working Hours Tab */}
                <Tab.Pane eventKey="hours">
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="fas fa-clock me-2"></i>
                        Working Hours & Availability
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-4">
                        <Col md={6}>
                          <Form.Check
                            type="checkbox"
                            name="isAvailable"
                            label="Hospital is Currently Available"
                            checked={formData.isAvailable}
                            onChange={handleInputChange}
                            className="mb-3"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="checkbox"
                            name="acceptingPatients"
                            label="Currently Accepting New Patients"
                            checked={formData.acceptingPatients}
                            onChange={handleInputChange}
                            className="mb-3"
                          />
                        </Col>
                      </Row>

                      <hr />
                      
                      <h6 className="mb-3">Weekly Schedule</h6>
                      {daysOfWeek.map((day) => (
                        <Row key={day} className="align-items-center mb-3">
                          <Col md={2}>
                            <Form.Check
                              type="checkbox"
                              name={`workingHours.${day}.isOpen`}
                              label={day.charAt(0).toUpperCase() + day.slice(1)}
                              checked={formData.workingHours[day]?.isOpen}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="time"
                              name={`workingHours.${day}.start`}
                              value={formData.workingHours[day]?.start || "00:00"}
                              onChange={handleInputChange}
                              disabled={!formData.workingHours[day]?.isOpen}
                            />
                          </Col>
                          <Col md={1} className="text-center">
                            <span>to</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="time"
                              name={`workingHours.${day}.end`}
                              value={formData.workingHours[day]?.end || "23:59"}
                              onChange={handleInputChange}
                              disabled={!formData.workingHours[day]?.isOpen}
                            />
                          </Col>
                        </Row>
                      ))}
                      
                      <div className="mt-4 p-3 bg-light rounded">
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Note: For 24/7 hospitals, set start time to 00:00 and end time to 23:59. 
                          Emergency services are typically available round the clock regardless of these settings.
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>

                    {/* Submit Button */}
      <div className="d-flex justify-content-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="submit-btn"
          onClick={(e) => {
            console.log("Submit button clicked");
            // The form onSubmit will handle the actual submission
          }}
        >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update Hospital Profile
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Tab.Container>

      {/* Department Modal */}
      <Modal show={showDepartmentModal} onHide={() => setShowDepartmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select from common departments:</Form.Label>
            <Form.Select
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            >
              <option value="">Choose a department</option>
              {commonDepartments
                .filter((dept) => !formData.departments.includes(dept))
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Or enter custom department:</Form.Label>
            <Form.Control
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDepartment();
                }
              }}
              placeholder="Enter department name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepartmentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Facility Modal */}
      <Modal show={showFacilityModal} onHide={() => setShowFacilityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Facility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select from common facilities:</Form.Label>
            <Form.Select
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
            >
              <option value="">Choose a facility</option>
              {commonFacilities
                .filter((facility) => !formData.facilities.includes(facility))
                .map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Or enter custom facility:</Form.Label>
            <Form.Control
              type="text"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFacility();
                }
              }}
              placeholder="Enter facility name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFacilityModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddFacility}>
            Add Facility
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile; 