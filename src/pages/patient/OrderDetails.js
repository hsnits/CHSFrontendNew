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
      <Badge bg={statusColors[status] || "secondary"} className="status-badge">
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-4 mt-120">
          <div className="text-center loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading order details...</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <Container className="py-4 mt-120">
          <div className="text-center not-found-container">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4>Order not found</h4>
            <p className="text-muted">The order you're looking for doesn't exist or has been removed.</p>
            <Button variant="primary" onClick={() => navigate("/patient/orders")}>
              Go to My Orders
            </Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        .order-details-container {
          padding-top: 120px;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .back-button {
          background: linear-gradient(45deg, #007bff, #0056b3);
          border: none;
          padding: 12px 24px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          margin-bottom: 24px;
        }

        .back-button:hover {
          background: linear-gradient(45deg, #0056b3, #003d82);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .order-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .order-card .card-header {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 16px 24px;
          font-weight: 600;
        }

        .order-card .card-body {
          padding: 24px;
        }

        .product-image-container {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
          border: 2px solid #e9ecef;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 8px;
        }

        .product-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .product-name {
          font-weight: 600;
          font-size: 16px;
          color: #2c3e50;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .product-description {
          color: #6c757d;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
        }

        .table-enhanced {
          margin-bottom: 0;
        }

        .table-enhanced th {
          background-color: #f8f9fa;
          border: none;
          font-weight: 600;
          color: #495057;
          padding: 16px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table-enhanced td {
          padding: 20px 16px;
          vertical-align: middle;
          border-top: 1px solid #e9ecef;
          font-size: 14px;
        }

        .price-text {
          font-weight: 600;
          color: #28a745;
          font-size: 15px;
        }

        .quantity-badge {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          min-width: 40px;
          display: inline-block;
        }

        .status-badge {
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .summary-item:last-child {
          border-bottom: none;
          font-weight: 600;
          font-size: 16px;
          color: #2c3e50;
        }

        .summary-label {
          color: #495057;
          font-weight: 500;
        }

        .summary-value {
          font-weight: 600;
          color: #2c3e50;
        }

        .order-id-text {
          font-family: 'Courier New', monospace;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          word-break: break-all;
        }

        .address-container {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .address-container address {
          margin: 0;
          color: #495057;
          line-height: 1.6;
          font-style: normal;
        }

        .tracking-info {
          background: linear-gradient(45deg, #e3f2fd, #bbdefb);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
        }

        .loading-container, .not-found-container {
          padding: 60px 20px;
          text-align: center;
        }

        .spinner-border {
          width: 3rem;
          height: 3rem;
        }

        @media (max-width: 768px) {
          .order-details-container {
            padding-top: 100px;
          }

          .product-image-container {
            width: 60px;
            height: 60px;
            margin-right: 12px;
          }

          .product-name {
            font-size: 14px;
          }

          .table-enhanced th,
          .table-enhanced td {
            padding: 12px 8px;
            font-size: 12px;
          }

          .order-card .card-body {
            padding: 16px;
          }
        }
      `}</style>

      <Header />
      <Container fluid className="order-details-container">
        <Container>
          <Button
            variant="primary"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-2"></i> Back to Orders
          </Button>

          <Row>
            <Col lg={8} md={12}>
              <Card className="order-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-shopping-bag me-2"></i>Order Items
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="table-enhanced">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Quantity</th>
                        <th style={{ width: '120px', textAlign: 'right' }}>Price</th>
                        <th style={{ width: '120px', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((item) => (
                        <tr key={item.productId._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="product-image-container">
                                <img
                                  src={item.productId.image || '/placeholder-product.png'}
                                  alt={item.productId.name}
                                  className="product-image"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-product.png';
                                  }}
                                />
                              </div>
                              <div className="product-details">
                                <div className="product-name">{item.productId.name}</div>
                                {item.productId.description && (
                                  <small className="product-description">
                                    {item.productId.description.length > 80 
                                      ? `${item.productId.description.substring(0, 80)}...` 
                                      : item.productId.description
                                    }
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="quantity-badge">{item.quantity}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="price-text">₹{item.price.toFixed(2)}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="price-text">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={12}>
              <Card className="order-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-receipt me-2"></i>Order Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="summary-item">
                    <span className="summary-label">Order ID:</span>
                    <span className="order-id-text">{order._id.slice(-8)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Order Date:</span>
                    <span className="summary-value">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Status:</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payment Status:</span>
                    {getStatusBadge(order.paymentStatus)}
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payment Method:</span>
                    <span className="summary-value">{order.paymentMethod}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Amount:</span>
                    <span className="summary-value price-text">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>

              <Card className="order-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-map-marker-alt me-2"></i>Shipping Address
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="address-container">
                    <address>
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                      {order.shippingAddress.country} - {order.shippingAddress.zipCode}
                    </address>
                  </div>
                </Card.Body>
              </Card>

              {order.trackingNumber && (
                <Card className="order-card">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-truck me-2"></i>Tracking Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="tracking-info">
                      <div className="mb-3">
                        <strong>Tracking Number:</strong><br />
                        <span className="order-id-text">{order.trackingNumber}</span>
                      </div>
                      {order.estimatedDelivery && (
                        <div>
                          <strong>Estimated Delivery:</strong><br />
                          <span className="summary-value">
                            {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default OrderDetails;
