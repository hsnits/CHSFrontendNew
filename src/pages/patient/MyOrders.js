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
        `/orders/my-orders?search=${searchTerm}&status=${statusFilter}`
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
  }, [searchTerm, statusFilter]);

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
      <Badge bg={statusColors[status] || "secondary"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const handleOrderAction = (order, action) => {
    setSelectedOrder(order);
    setModalType(action);
    setShowModal(true);
    setReason("");
  };

  return (
    <Container fluid className="py-4">
      <Card>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              {/* <InputGroup>
                <Form.Control
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup> */}
            </Col>
            <Col md={6}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
          </Row>

          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  {/* <th>Payment Status</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.length ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        {order.products
                          ?.map((it) => it?.productId?.name)
                          ?.join(",")}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalAmount.toFixed(2)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      {/* <td>{getStatusBadge(order.paymentStatus)}</td> */}
                      <td className="flex">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            navigate(`/order-details/${order._id}`)
                          }
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                        {order.status === "created" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleOrderAction(order, "cancel")}
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        )}
                        {order.status === "completed" && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleOrderAction(order, "return")}
                          >
                            <i className="fas fa-undo"></i> Return
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>No Order Found</tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for Cancel/Return */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "cancel" ? "Cancel Order" : "Return Order"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Enter reason for ${
                  modalType === "cancel" ? "cancellation" : "return"
                }`}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant={modalType === "cancel" ? "danger" : "warning"}
            onClick={
              modalType === "cancel" ? handleCancelOrder : handleReturnOrder
            }
          >
            {modalType === "cancel" ? "Cancel Order" : "Submit Return Request"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyOrders;
