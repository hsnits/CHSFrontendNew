import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Badge, ProgressBar, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  getSubscriptionBenefits, 
  getSubscriptionUsage, 
  cancelSubscription 
} from "../../redux/slices/subscriptionApi";
import { toastMessage } from "../../config/toast";

const SubscriptionDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [usagePage, setUsagePage] = useState(1);

  const { 
    benefits, 
    usage, 
    benefitsLoading, 
    usageLoading, 
    cancelLoading 
  } = useSelector((state) => ({
    benefits: state.SUBSCRIPTION.data.subscription.benefitsResult,
    usage: state.SUBSCRIPTION.data.subscription.usageResult,
    benefitsLoading: state.SUBSCRIPTION.loading.subscription.benefitsLoading,
    usageLoading: state.SUBSCRIPTION.loading.subscription.usageLoading,
    cancelLoading: state.SUBSCRIPTION.loading.subscription.cancelLoading,
  }));

  useEffect(() => {
    dispatch(getSubscriptionBenefits());
    dispatch(getSubscriptionUsage({ page: usagePage, limit: 10 }));
  }, [dispatch, usagePage]);

  const handleCancelSubscription = async () => {
    if (!cancelReason.trim()) {
      toastMessage("error", "Please provide a reason for cancellation");
      return;
    }

    try {
      await dispatch(cancelSubscription({ reason: cancelReason })).unwrap();
      setShowCancelModal(false);
      setCancelReason("");
      dispatch(getSubscriptionBenefits());
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const getBenefitProgress = (benefit) => {
    if (!benefit.total) return 0;
    return (benefit.used / benefit.total) * 100;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const BenefitCard = ({ title, icon, children }) => (
    <Col md={6} lg={4} className="mb-4">
      <Card className="h-100 benefit-card">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <i className={`${icon} text-primary me-2`} style={{ fontSize: '1.5rem' }}></i>
            <h6 className="mb-0">{title}</h6>
          </div>
          {children}
        </Card.Body>
      </Card>
    </Col>
  );

  const UsageHistoryItem = ({ item }) => (
    <div className="usage-item p-3 border-bottom">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="mb-1">{item.benefitType.replace(/([A-Z])/g, ' $1').trim()}</h6>
          <p className="text-muted mb-1">{item.description}</p>
          <small className="text-muted">{formatDate(item.usedAt)}</small>
        </div>
        <Badge bg="success">Used</Badge>
      </div>
    </div>
  );

  if (benefitsLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading subscription...</span>
        </Spinner>
      </div>
    );
  }

  if (!benefits?.hasSubscription) {
    return (
      <div className="text-center py-5">
        <Card className="subscription-cta">
          <Card.Body className="p-5">
            <i className="fas fa-crown text-warning mb-3" style={{ fontSize: '3rem' }}></i>
            <h3>No Active Subscription</h3>
            <p className="text-muted mb-4">
              Subscribe to our health plans to get amazing benefits like free blood tests, 
              medicine discounts, and priority booking.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate("/subscription-plans")}
            >
              View Subscription Plans
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const { subscription } = benefits;

  return (
    <div className="subscription-dashboard">
      {/* Subscription Status */}
      <Card className="mb-4 subscription-status-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-crown text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                <h4 className="mb-0">{subscription.planName}</h4>
                <Badge bg="success" className="ms-2">Active</Badge>
              </div>
              <p className="text-muted mb-2">
                Your subscription is active until {formatDate(subscription.endDate)}
              </p>
              <div className="subscription-actions">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate("/subscription-plans")}
                >
                  Upgrade Plan
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Subscription
                </Button>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="subscription-icon">
                <i className="fas fa-shield-alt text-success" style={{ fontSize: '3rem' }}></i>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Benefits Overview */}
      <Row>
        <BenefitCard title="Free Blood Tests" icon="fas fa-vial">
          <div className="benefit-progress">
            <div className="d-flex justify-content-between mb-2">
              <span>{subscription.benefits.freeBloodTests.used} used</span>
              <span>{subscription.benefits.freeBloodTests.remaining} remaining</span>
            </div>
            <ProgressBar 
              now={getBenefitProgress(subscription.benefits.freeBloodTests)} 
              variant="info"
              className="mb-2"
            />
            <small className="text-muted">
              {subscription.benefits.freeBloodTests.total} tests per month
            </small>
          </div>
        </BenefitCard>

        <BenefitCard title="Medicine Discount" icon="fas fa-pills">
          <div className="benefit-info">
            <div className="discount-display">
              <span className="discount-percentage">
                {subscription.benefits.medicineDiscount.percentage}%
              </span>
              <small className="text-muted d-block">Extra discount on all medicines</small>
            </div>
          </div>
        </BenefitCard>

        <BenefitCard title="Free Consultations" icon="fas fa-user-md">
          <div className="benefit-progress">
            <div className="d-flex justify-content-between mb-2">
              <span>{subscription.benefits.freeConsultations.used} used</span>
              <span>{subscription.benefits.freeConsultations.remaining} remaining</span>
            </div>
            <ProgressBar 
              now={getBenefitProgress(subscription.benefits.freeConsultations)} 
              variant="success"
              className="mb-2"
            />
            <small className="text-muted">
              {subscription.benefits.freeConsultations.total} consultations per month
            </small>
          </div>
        </BenefitCard>

        <BenefitCard title="Home Collection" icon="fas fa-home">
          <div className="benefit-info">
            {subscription.benefits.freeHomeCollection ? (
              <div className="text-success">
                <i className="fas fa-check-circle me-2"></i>
                <span>Available</span>
              </div>
            ) : (
              <div className="text-muted">
                <i className="fas fa-times-circle me-2"></i>
                <span>Not Available</span>
              </div>
            )}
          </div>
        </BenefitCard>

        <BenefitCard title="Priority Booking" icon="fas fa-star">
          <div className="benefit-info">
            {subscription.benefits.priorityBooking ? (
              <div className="text-success">
                <i className="fas fa-check-circle me-2"></i>
                <span>Enabled</span>
              </div>
            ) : (
              <div className="text-muted">
                <i className="fas fa-times-circle me-2"></i>
                <span>Not Available</span>
              </div>
            )}
          </div>
        </BenefitCard>

        <BenefitCard title="24/7 Support" icon="fas fa-headset">
          <div className="benefit-info">
            {subscription.benefits.healthSupport24x7 ? (
              <div className="text-success">
                <i className="fas fa-check-circle me-2"></i>
                <span>Available</span>
              </div>
            ) : (
              <div className="text-muted">
                <i className="fas fa-times-circle me-2"></i>
                <span>Not Available</span>
              </div>
            )}
          </div>
        </BenefitCard>
      </Row>

      {/* Usage History */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Usage History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {usageLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
            </div>
          ) : usage?.usage?.length > 0 ? (
            <div className="usage-history">
              {usage.usage.map((item, index) => (
                <UsageHistoryItem key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No usage history yet</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Cancel Subscription Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Are you sure you want to cancel your subscription? You will lose all benefits immediately.
          </Alert>
          <Form.Group>
            <Form.Label>Reason for cancellation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Please tell us why you're canceling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Subscription
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelSubscription}
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Canceling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionDashboard; 