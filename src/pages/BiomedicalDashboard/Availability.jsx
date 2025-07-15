import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Card } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { callPutApi, callGetApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";

const Availability = ({ biomedicalDetails }) => {
  const [loading, setLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({
    isAvailable: true,
    workingHours: { start: "09:00", end: "18:00" },
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    emergencySupport: false,
    twentyFourHour: false,
    serviceArea: "",
    price: 0,
    weeklySchedule: {},
  });

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: availabilityData,
  });

  const watchedValues = watch();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await callGetApi("/biomedical/availability");
      if (response.success) {
        setAvailabilityData(response.data);
        Object.keys(response.data).forEach((key) => {
          setValue(key, response.data[key]);
        });
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toastMessage("error", "Failed to fetch availability data");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await callPutApi("/biomedical/availability", data);
      
      if (response.success || response.status) {
        toastMessage("success", "Availability updated successfully");
        setAvailabilityData(data);
      } else {
        throw new Error(response.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toastMessage("error", error.message || "Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const handleDayToggle = (day, checked) => {
    const currentDays = watchedValues.availableDays || [];
    let newDays;
    
    if (checked) {
      newDays = [...currentDays, day];
    } else {
      newDays = currentDays.filter(d => d !== day);
    }
    
    setValue("availableDays", newDays);
  };

  return (
    <div className="availability-container">
      <div className="dashboard-header">
        <h3>Availability Management</h3>
        <p className="text-muted">Manage your service availability and working hours</p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Service Availability */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-clock me-2"></i>
              Service Availability
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Status</Form.Label>
                  <Controller
                    name="isAvailable"
                    control={control}
                    render={({ field }) => (
                      <Form.Select 
                        {...field} 
                        value={field.value ? "true" : "false"} 
                        onChange={(e) => field.onChange(e.target.value === "true")}
                      >
                        <option value="true">Available for Service</option>
                        <option value="false">Not Available</option>
                      </Form.Select>
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Service Price (₹)</Form.Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="number"
                        min="0"
                        placeholder="Service price"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Service Area Coverage</Form.Label>
                  <Controller
                    name="serviceArea"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        as="textarea"
                        rows={3}
                        placeholder="Describe your service area coverage (e.g., 'Hospital Campus, Nearby Clinics, Emergency Response within 50km radius')"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Emergency Support Available"
                    checked={watchedValues.emergencySupport || false}
                    onChange={(e) => setValue("emergencySupport", e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Available for emergency biomedical services
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="24/7 Service Available"
                    checked={watchedValues.twentyFourHour || false}
                    onChange={(e) => setValue("twentyFourHour", e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Available round the clock for critical equipment
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Working Hours */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-clock me-2"></i>
              Working Hours
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Controller
                    name="workingHours.start"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="time"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Controller
                    name="workingHours.end"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="time"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Available Days */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-calendar me-2"></i>
              Available Days
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {daysOfWeek.map((day) => (
                <Col md={3} lg={2} key={day} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label={day}
                    checked={watchedValues.availableDays?.includes(day) || false}
                    onChange={(e) => handleDayToggle(day, e.target.checked)}
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Availability Summary */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-info-circle me-2"></i>
              Availability Summary
            </h5>
          </Card.Header>
          <Card.Body>
            <div className="availability-summary">
              <Row>
                <Col md={6}>
                  <div className="summary-item mb-3">
                    <strong>Status:</strong> 
                    <span className={`badge ms-2 ${watchedValues.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {watchedValues.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="summary-item mb-3">
                    <strong>Working Hours:</strong> 
                    <span className="ms-2">
                      {watchedValues.workingHours?.start || '09:00'} - {watchedValues.workingHours?.end || '18:00'}
                    </span>
                  </div>
                  <div className="summary-item mb-3">
                    <strong>Service Price:</strong> 
                    <span className="ms-2 text-success">
                      ₹{watchedValues.price || 0}
                    </span>
                  </div>
                  <div className="summary-item mb-3">
                    <strong>Available Days:</strong> 
                    <span className="ms-2">
                      {watchedValues.availableDays?.length || 0} days selected
                    </span>
                    <div className="mt-1">
                      {watchedValues.availableDays?.map(day => (
                        <span key={day} className="badge badge-primary me-1 mb-1">{day}</span>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="summary-item mb-3">
                    <strong>Emergency Support:</strong> 
                    <span className={`badge ms-2 ${watchedValues.emergencySupport ? 'badge-success' : 'badge-secondary'}`}>
                      {watchedValues.emergencySupport ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="summary-item mb-3">
                    <strong>24/7 Service:</strong> 
                    <span className={`badge ms-2 ${watchedValues.twentyFourHour ? 'badge-success' : 'badge-secondary'}`}>
                      {watchedValues.twentyFourHour ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="summary-item mb-3">
                    <strong>Service Area:</strong> 
                    <span className="ms-2">
                      {watchedValues.serviceArea ? (
                        <small className="text-muted">{watchedValues.serviceArea.substring(0, 100)}...</small>
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>

        {/* Submit Button */}
        <Card>
          <Card.Body className="text-center">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="me-2"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update Availability
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={fetchAvailability}
              size="lg"
            >
              <i className="fas fa-undo me-2"></i>
              Reset
            </Button>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default Availability; 