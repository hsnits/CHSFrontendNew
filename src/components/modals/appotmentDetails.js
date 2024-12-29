import React from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import user_img from "../../assets/img/doctor-profile-img.jpg";

const AppointmentDetails = ({
  showModal,
  handleModalClose,
  selectedAppointment,
}) => {
  return (
    <div>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <div>
              {/* 1. Profile Details */}
              <section>
                <h5>Profile Details</h5>
                <Row className="mb-3">
                  <Col md={4}>
                    <Image
                      src={
                        selectedAppointment?.patientId?.coverImage || user_img
                      }
                      alt="Patient Image"
                      roundedCircle
                      fluid
                    />
                  </Col>
                  <Col md={8}>
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedAppointment?.appointmentPersonName ||
                        `${selectedAppointment?.patientId?.firstName} ${selectedAppointment?.patientId?.lastName}`}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedAppointment?.patientId?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedAppointment?.patientId?.phoneNumber}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedAppointment?.patientId?.address},
                      {selectedAppointment?.patientId?.city},{" "}
                      {selectedAppointment?.patientId?.state},
                      {selectedAppointment?.patientId?.country} -{" "}
                      {selectedAppointment?.patientId?.pinCode}
                    </p>
                  </Col>
                </Row>
              </section>

              <hr />

              {/* 2. Appointment Details */}
              <section>
                <h5>Appointment Details</h5>
                <p>
                  <strong>Appointment ID:</strong>{" "}
                  {getIdLastDigits(selectedAppointment?._id, "Ap")}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {selectedAppointment?.appointmentType || "General Visit"}
                </p>
                <p>
                  <strong>For:</strong>{" "}
                  {selectedAppointment?.appointmentFor || "Self"}
                </p>
                <p>
                  <strong>Reason:</strong>{" "}
                  {selectedAppointment?.reason || "N/A"}
                </p>
                {/* <p>
                  <strong>Referring Doctor ID:</strong>{" "}
                  {selectedAppointment?.refDoctor || "N/A"}
                </p> */}
                <p>
                  <strong>Date:</strong>{" "}
                  {getDateFormate(selectedAppointment?.date)}
                </p>
                <p>
                  <strong>Time:</strong> {selectedAppointment?.time}
                </p>
                {/* <p>
                  <strong>Status:</strong> {selectedAppointment?.status}
                </p> */}
              </section>

              <hr />

              {/* 3. Attachments and Symptoms */}
              <section>
                <h5>Attachments & Symptoms</h5>
                <p>
                  <strong>Symptoms:</strong>{" "}
                  {selectedAppointment?.symptoms || "N/A"}
                </p>
                {selectedAppointment?.attachment && (
                  <div>
                    <strong>Attachment:</strong>
                    <Image
                      src={selectedAppointment?.attachment}
                      alt="Attachment"
                      className="mt-2"
                      fluid
                    />
                  </div>
                )}
              </section>
            </div>
          ) : (
            <p>No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentDetails;
