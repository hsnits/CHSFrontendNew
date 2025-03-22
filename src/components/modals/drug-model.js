import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DrugLicenseModal = ({ show, setShow }) => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateLicenseNumber = (number) => {
    // This is a simple validation example - adjust based on your actual requirements
    // For example, if license numbers should be exactly 10 digits
    const regex = /^\d{10}$/;
    return regex.test(number);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLicenseNumber(value);

    if (validateLicenseNumber(value)) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError("Please enter a valid 10-digit license number");
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      handleClose();
      navigate("/pharmacy?key=Wholesale");
    }
  };

  const handleClose = () => {
    setShow(false);
    setIsValid(false);
    setError("");
    setLicenseNumber("");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Drug License Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter license number"
                value={licenseNumber}
                onChange={handleInputChange}
                isInvalid={!!error}
              />
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrugLicenseModal;
