import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { callGetApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await callGetApi(`/orders/${orderId}`);
      if (response.status) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toastMessage("error", "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const getStatusBadge = (status) => {
    const statusColors = {
      created: "primary",
      in_progress: "info",
      completed: "success",
      cancelled: "danger",
      refunded: "warning",
      returned: "secondary",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-4">
        <div className="text-center">Order not found</div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container fluid className="py-4 mt-120">
        <Button
          variant="outline-primary"
          style={{ marginTop: 85 }}
          className="mb-4 mt-80"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i> Back to Orders
        </Button>

        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Items</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item) => (
                      <tr key={item.productId._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.productId.image}
                              alt={item.productId.name}
                              style={{ width: "50px", marginRight: "10px" }}
                            />
                            <div>
                              <div>{item.productId.name}</div>
                              <small className="text-muted">
                                {item.productId.description}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div className="mb-3">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong> {getStatusBadge(order.status)}
                </div>
                <div className="mb-3">
                  <strong>Payment Status:</strong>{" "}
                  {getStatusBadge(order.paymentStatus)}
                </div>
                <div className="mb-3">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </div>
                <hr />
                <div className="mb-3">
                  <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h5 className="mb-0">Shipping Address</h5>
              </Card.Header>
              <Card.Body>
                <address className="mb-0">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                  <br />
                  {order.shippingAddress.country} -{" "}
                  {order.shippingAddress.zipCode}
                </address>
              </Card.Body>
            </Card>

            {order.trackingNumber && (
              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">Tracking Information</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <strong>Estimated Delivery:</strong>{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default OrderDetails;
