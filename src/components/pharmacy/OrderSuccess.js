import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Button } from "react-bootstrap";
import { CheckCircle, XCircle } from "react-feather";
import "./OrderStatus.css"; // For custom styling

export default function OrderStatus() {
  const navigate = useNavigate();
  const location = useLocation();

  const { status, orderId, amount } = location.state || {};

  // Redirect to home if no valid data is present
  useEffect(() => {
    if (!status || !orderId || !amount) {
      navigate("/", { replace: true });
    }
  }, [status, orderId, amount, navigate]);

  // Determine content based on payment status
  const isSuccess = status === "success";
  const message = isSuccess ? "Payment Successful!" : "Payment Failed!";
  const icon = isSuccess ? (
    <CheckCircle size={80} color="#28a745" />
  ) : (
    <XCircle size={80} color="#dc3545" />
  );

  const description = isSuccess
    ? `Your payment of ₹${amount} was successful. Your order is being processed!`
    : `Your payment of ₹${amount} failed. Please try again.`;

  return (
    <div className="order-status-container">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={10} xs={12}>
            <Card className={`status-card ${isSuccess ? "success" : "failure"}`}>
              <CardBody className="text-center">
                <div className="status-icon">{icon}</div>
                <h3 className="status-title">{message}</h3>
                <p className="status-description">{description}</p>

                <div className="order-details">
                  <p className="order-id">Order ID: <strong>{orderId}</strong></p>
                  <p className="order-amount">Amount: <strong>₹{amount}</strong></p>
                </div>

                <div className="btn-group">
                  <Button
                    variant="primary"
                    className="bubble-btn"
                    onClick={() => navigate("/")}
                  >
                    Go To Home
                  </Button>

                  <Button
                    variant="secondary"
                    className="bubble-btn"
                    onClick={() => navigate(-1)}
                  >
                    Go Back
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
