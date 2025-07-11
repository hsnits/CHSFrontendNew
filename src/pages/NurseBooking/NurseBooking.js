import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import defaultAvatar from "../../assets/img/profile-06.jpg";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";


function NurseBooking() {
  const { userId } = useParams();
  const [nurse, setNurse] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    appointmentDate: "",
    timeSlot: "",
    notes: "",
  });

  useEffect(() => {
    const fetchNurseData = async () => {
      try {
        const response = await axios.get(`/nurse/${userId}`);
        const profile = response.data.profile || response.data;
        setNurse({
          id: response.data._id,
          fullName:
            profile.displayName ||
            `${profile.firstName || ""} ${profile.lastName || ""}`,
          designation: profile.designation || "RN",
          hourlyRate: profile.availabilityDetails?.price || 15,
          email: profile.email,
        });
      } catch (err) {
        console.error("Failed to fetch nurse data:", err);
      }
    };

    fetchNurseData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // NurseBooking.js (submit handler)
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', {
        forWhom: formData.patientName,
        reason: formData.notes,
        services: [], // fill as needed
        nurseId: userId, // from useParams()
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
      }, {
        // If you use authentication, add headers here
        // headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking confirmed!");
      // Optionally, redirect or reset form here
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  };
  


  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Row>
            {/* LEFT SIDE: Patient Form */}
            <Col md={7}>
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-4">Book Appointment</h4>
                  <Form onSubmit={handleBookingSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Appointment Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Preferred Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Additional Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Button  onSubmit={handleBookingSubmit} type="submit" className="btn btn-primary">
                      Confirm Appointment
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* RIGHT SIDE: Booking Summary */}
            <Col md={5}>
              <Card className="booking-summary">
                <Card.Body>
                  <h5 className="mb-3">Appointment Summary</h5>
                  {nurse ? (
                    <>
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={defaultAvatar}
                          alt="Nurse"
                          className="rounded-circle"
                          width="60"
                          height="60"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0">{nurse.fullName}</h6>
                          <small>{nurse.designation}</small>
                        </div>
                      </div>
                      <p>
                        <strong>Email:</strong> {nurse.email}
                      </p>
                      <p>
                        <strong>Rate:</strong> ${nurse.hourlyRate} / hour
                      </p>
                      <hr />
                      <p>
                        <strong>Patient:</strong> {formData.patientName || "-"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {formData.appointmentDate || "-"}
                      </p>
                      <p>
                        <strong>Time:</strong> {formData.timeSlot || "-"}
                      </p>
                    </>
                  ) : (
                    <p>Loading summary...</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default NurseBooking;
