import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Badge,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { callGetApi, callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'cancel' or 'return'
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const userData = getLocalStorage(STORAGE.USER_KEY);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await callGetApi(
        `/orders/my-orders?search=${searchTerm}&status=${statusFilter}&orderType=${orderTypeFilter}`
      );
      if (response.status) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toastMessage("error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, orderTypeFilter]);

  const handleCancelOrder = async () => {
    try {
      const response = await callPostApi(
        `/orders/${selectedOrder._id}/cancel`,
        { reason }
      );
      if (response.status) {
        toastMessage("success", "Order cancelled successfully");
        setShowModal(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toastMessage("error", "Failed to cancel order");
    }
  };

  const handleReturnOrder = async () => {
    try {
      const response = await callPostApi(
        `/orders/${selectedOrder._id}/return`,
        { reason }
      );
      if (response.status) {
        toastMessage("success", "Return request submitted successfully");
        setShowModal(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error returning order:", error);
      toastMessage("error", "Failed to submit return request");
    }
  };

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
      <Badge bg={statusColors[status] || "secondary"} className="text-capitalize px-3 py-2">
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getOrderTypeBadge = (orderType) => {
    const typeColors = {
      product: "info",
      subscription: "warning",
    };
    return (
      <Badge bg={typeColors[orderType] || "secondary"} className="px-3 py-2">
        {orderType === "subscription" ? "Subscription" : "Product"}
      </Badge>
    );
  };

  const getOrderDescription = (order) => {
    if (order.orderType === "subscription") {
      return `${order.subscriptionDetails?.planName || "Subscription Plan"} (${order.subscriptionDetails?.billingType || "monthly"})`;
    } else {
      return order.products
        ?.map((item) => item?.productId?.name)
        ?.filter(Boolean)
        ?.join(", ") || "Product Order";
    }
  };

  const handleOrderAction = (order, action) => {
    setSelectedOrder(order);
    setModalType(action);
    setShowModal(true);
    setReason("");
  };

  const handleViewOrder = (order) => {
    if (order.orderType === "subscription") {
      // Navigate to subscription details or show subscription info
      navigate("/patient?key=subscription");
    } else {
      // Navigate to product order details
      navigate(`/order-details/${order._id}`);
    }
  };

  return (
    <>
      <style jsx>{`
        .orders-container {
          background-color: #f8f9fa;
          min-height: 100vh;
          padding: 20px 0;
        }

        .orders-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .orders-card .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 20px;
          color: white;
        }

        .orders-card .card-body {
          padding: 0;
        }

        .filters-section {
          background-color: white;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .custom-select {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 12px 15px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .custom-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .search-input-group .form-control {
          border: 2px solid #e9ecef;
          border-right: none;
          border-radius: 10px 0 0 10px;
          padding: 12px 15px;
          font-size: 14px;
        }

        .search-input-group .btn {
          border: 2px solid #e9ecef;
          border-left: none;
          border-radius: 0 10px 10px 0;
          background-color: #667eea;
          border-color: #667eea;
          padding: 12px 20px;
        }

        .search-input-group .btn:hover {
          background-color: #5a6fd8;
          border-color: #5a6fd8;
        }

        .orders-table {
          margin: 0;
        }

        .orders-table thead th {
          background-color: #f8f9fa;
          border: none;
          font-weight: 600;
          color: #495057;
          padding: 20px 15px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .orders-table tbody td {
          padding: 20px 15px;
          border: none;
          border-bottom: 1px solid #e9ecef;
          vertical-align: middle;
          font-size: 14px;
        }

        .orders-table tbody tr:hover {
          background-color: #f8f9fa;
          transition: all 0.2s ease;
        }

        .order-type-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 20px;
        }

        .order-details {
          max-width: 300px;
        }

        .order-title {
          font-weight: 600;
          color: #495057;
          margin-bottom: 5px;
          line-height: 1.4;
        }

        .order-subtitle {
          font-size: 12px;
          color: #6c757d;
          margin: 0;
        }

        .date-cell {
          color: #495057;
          font-weight: 500;
        }

        .amount-cell {
          font-weight: 600;
          color: #28a745;
          font-size: 16px;
        }

        .status-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 8px 15px;
          border-radius: 20px;
          text-transform: capitalize;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .action-btn.view-btn {
          background-color: #667eea;
          border-color: #667eea;
          color: white;
        }

        .action-btn.view-btn:hover {
          background-color: #5a6fd8;
          border-color: #5a6fd8;
          transform: translateY(-1px);
        }

        .action-btn.cancel-btn {
          background-color: transparent;
          border-color: #dc3545;
          color: #dc3545;
        }

        .action-btn.cancel-btn:hover {
          background-color: #dc3545;
          color: white;
          transform: translateY(-1px);
        }

        .action-btn.return-btn {
          background-color: transparent;
          border-color: #ffc107;
          color: #ffc107;
        }

        .action-btn.return-btn:hover {
          background-color: #ffc107;
          color: #212529;
          transform: translateY(-1px);
        }

        .loading-container {
          padding: 60px 20px;
          text-align: center;
        }

        .loading-spinner {
          color: #667eea;
          width: 3rem;
          height: 3rem;
        }

        .no-orders-container {
          padding: 60px 20px;
          text-align: center;
          color: #6c757d;
        }

        .no-orders-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          color: #dee2e6;
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .modal-header .btn-close {
          filter: invert(1);
        }

        .modal-footer .btn {
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .filters-section {
            padding: 15px;
          }

          .orders-table thead th,
          .orders-table tbody td {
            padding: 15px 10px;
            font-size: 13px;
          }

          .order-details {
            max-width: 200px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            margin-bottom: 5px;
          }
        }
      `}</style>

      <Container fluid className="orders-container">
        <Card className="orders-card">
          <Card.Header>
            <h4 className="mb-0">
              <i className="fas fa-box me-3"></i>
              My Orders
            </h4>
          </Card.Header>

          <div className="filters-section">
            <Row className="g-3">
              <Col md={4}>
                <Form.Select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="custom-select"
                >
                  <option value="">All Orders</option>
                  <option value="product">Product Orders</option>
                  <option value="subscription">Subscriptions</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="custom-select"
                >
                  <option value="">All Status</option>
                  <option value="created">Created</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="returned">Returned</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <InputGroup className="search-input-group">
                  <Form.Control
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary">
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </div>

          <Card.Body>
            {loading ? (
              <div className="loading-container">
                <div className="spinner-border loading-spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 mb-0">Loading your orders...</p>
              </div>
            ) : (
              <Table responsive className="orders-table">
                <thead>
                  <tr>
                    <th style={{ width: "120px" }}>Order Type</th>
                    <th style={{ width: "35%" }}>Order Details</th>
                    <th style={{ width: "120px" }}>Date</th>
                    <th style={{ width: "120px" }}>Total Amount</th>
                    <th style={{ width: "100px" }}>Status</th>
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.length ? (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="order-type-badge">
                            {getOrderTypeBadge(order.orderType)}
                          </div>
                        </td>
                        <td>
                          <div className="order-details">
                            <div className="order-title">
                              {getOrderDescription(order)}
                            </div>
                            {order.orderType === "subscription" && (
                              <div className="order-subtitle">
                                Valid: {new Date(order.subscriptionDetails?.startDate).toLocaleDateString()} - {new Date(order.subscriptionDetails?.endDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="date-cell">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="amount-cell">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td>
                          <div className="status-badge">
                            {getStatusBadge(order.status)}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              className="action-btn view-btn"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              View
                            </Button>
                            {order.status === "created" && order.orderType === "product" && (
                              <Button
                                className="action-btn cancel-btn"
                                size="sm"
                                onClick={() => handleOrderAction(order, "cancel")}
                              >
                                <i className="fas fa-times me-1"></i>
                                Cancel
                              </Button>
                            )}
                            {order.status === "completed" && order.orderType === "product" && (
                              <Button
                                className="action-btn return-btn"
                                size="sm"
                                onClick={() => handleOrderAction(order, "return")}
                              >
                                <i className="fas fa-undo me-1"></i>
                                Return
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div className="no-orders-container">
                          <i className="fas fa-box-open no-orders-icon"></i>
                          <h5>No Orders Found</h5>
                          <p className="mb-0">You haven't placed any orders yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modal for Cancel/Return */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className={`fas ${modalType === "cancel" ? "fa-times" : "fa-undo"} me-2`}></i>
              {modalType === "cancel" ? "Cancel Order" : "Return Order"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-bold">
                Reason for {modalType === "cancel" ? "cancellation" : "return"}:
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Please provide a reason for ${modalType === "cancel" ? "cancelling" : "returning"} this order...`}
                className="mt-2"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <i className="fas fa-times me-1"></i>
              Cancel
            </Button>
            <Button
              variant={modalType === "cancel" ? "danger" : "warning"}
              onClick={modalType === "cancel" ? handleCancelOrder : handleReturnOrder}
              disabled={!reason.trim()}
            >
              <i className={`fas ${modalType === "cancel" ? "fa-times" : "fa-undo"} me-1`}></i>
              {modalType === "cancel" ? "Cancel Order" : "Submit Return Request"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default MyOrders;
