import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { 
  getSubscriptionPlans, 
  createSubscriptionOrder, 
  verifySubscriptionPayment,
  getSubscriptionBenefits 
} from "../../redux/slices/subscriptionApi";
import { toastMessage } from "../../config/toast";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import "./SubscriptionPlans.css";

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [billingType, setBillingType] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const { 
    plans, 
    plansLoading, 
    orderLoading, 
    paymentLoading: paymentVerificationLoading,
    benefits 
  } = useSelector((state) => ({
    plans: state.SUBSCRIPTION.data.subscription.plansResult,
    plansLoading: state.SUBSCRIPTION.loading.subscription.plansLoading,
    orderLoading: state.SUBSCRIPTION.loading.subscription.orderLoading,
    paymentLoading: state.SUBSCRIPTION.loading.subscription.paymentLoading,
    benefits: state.SUBSCRIPTION.data.subscription.benefitsResult,
  }));

  useEffect(() => {
    dispatch(getSubscriptionPlans());
    
    const userData = getLocalStorage(STORAGE.USER_KEY);
    if (userData) {
      dispatch(getSubscriptionBenefits());
    }
  }, [dispatch]);

  const handleSelectPlan = (plan) => {
    const userData = getLocalStorage(STORAGE.USER_KEY);
    if (!userData) {
      toastMessage("error", "Please login to subscribe");
      navigate("/login");
      return;
    }
    
    if (userData.role !== "Patient") {
      toastMessage("error", "Only patients can subscribe to health plans");
      return;
    }
    
    if (benefits?.hasSubscription) {
      toastMessage("info", "You already have an active subscription");
      return;
    }
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    // Show development message and close modal
    toastMessage("info", "Under Development - Please Visit Later");
    setShowPaymentModal(false);
    setSelectedPlan(null);
    return;
    
    // Payment functionality disabled for development
    setPaymentLoading(true);
    
    try {
      const orderData = {
        planId: selectedPlan._id,
        billingType
      };
      
      const orderResult = await dispatch(createSubscriptionOrder(orderData)).unwrap();
      
      if (!orderResult.razorpayOrder) {
        throw new Error("Failed to create payment order");
      }
      
      const { razorpayOrder } = orderResult;
      
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }
      
      const options = {
        key: "rzp_test_m7Sk7RENHjMHdW",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "CHS Healthcare",
        description: `${selectedPlan.displayName} Subscription`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            
            await dispatch(verifySubscriptionPayment(verificationData)).unwrap();
            
            setShowPaymentModal(false);
            setSelectedPlan(null);
            
            // Refresh benefits
            dispatch(getSubscriptionBenefits());
            
            // Navigate to patient dashboard
            navigate("/patient?key=subscription");
            
          } catch (error) {
            console.error("Payment verification failed:", error);
          }
        },
        prefill: {
          name: getLocalStorage(STORAGE.USER_KEY)?.name || "",
          email: getLocalStorage(STORAGE.USER_KEY)?.email || "",
          contact: getLocalStorage(STORAGE.USER_KEY)?.phoneNumber || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toastMessage("error", "Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const getDiscountedPrice = (plan) => {
    if (billingType === "yearly") {
      const monthlyTotal = plan.price.monthly * 12;
      const savings = monthlyTotal - plan.price.yearly;
      return { price: plan.price.yearly, savings };
    }
    return { price: plan.price.monthly, savings: 0 };
  };

  const PlanCard = ({ plan, isPopular = false }) => {
    const { price, savings } = getDiscountedPrice(plan);
    
    return (
      <Col lg={4} md={6} className="mb-4">
        <Card className={`subscription-card h-100 ${isPopular ? 'popular-plan' : ''}`}>
          {isPopular && (
            <div className="popular-badge">
              <Badge bg="success">Most Popular</Badge>
            </div>
          )}
          
          <Card.Body className="d-flex flex-column">
            <div className="plan-header text-center mb-4">
              <h3 className="plan-name">{plan.displayName}</h3>
              <p className="plan-description text-muted">{plan.description}</p>
              
              <div className="plan-price">
                <span className="price-amount">₹{price}</span>
                <span className="price-period">/{billingType === "yearly" ? "year" : "month"}</span>
              </div>
              
              {savings > 0 && (
                <div className="savings-badge">
                  <Badge bg="warning">Save ₹{savings}</Badge>
                </div>
              )}
            </div>
            
            <div className="plan-features flex-grow-1">
              <ul className="feature-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <i className="fas fa-check text-success me-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="plan-action mt-4">
              <Button 
                variant={isPopular ? "success" : "primary"} 
                size="lg" 
                className="w-100"
                onClick={() => handleSelectPlan(plan)}
                disabled={benefits?.hasSubscription}
              >
                {benefits?.hasSubscription ? "Already Subscribed" : "Choose Plan"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <>
      <Header />
      <Breadcrumb />
      
      <Container className="subscription-plans-container py-5">
        <Row className="justify-content-center">
          <Col lg={8} className="text-center mb-5">
            <h1 className="section-title">Choose Your Health Plan</h1>
            <p className="section-subtitle">
              Get the best healthcare benefits with our affordable subscription plans
            </p>
            
            {/* Billing Toggle */}
            <div className="billing-toggle mt-4">
              <Form.Check
                type="switch"
                id="billing-switch"
                label={
                  <span>
                    Monthly 
                    <span className="mx-2">|</span>
                    Yearly <Badge bg="success" className="ms-2">Save 2 months</Badge>
                  </span>
                }
                checked={billingType === "yearly"}
                onChange={(e) => setBillingType(e.target.checked ? "yearly" : "monthly")}
              />
            </div>
          </Col>
        </Row>
        
        {/* Current Subscription Status */}
        {benefits?.hasSubscription && (
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Card className="current-subscription-card">
                <Card.Body className="text-center">
                  <h5 className="text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    You have an active subscription
                  </h5>
                  <p className="mb-2">
                    Current Plan: <strong>{benefits.subscription.planName}</strong>
                  </p>
                  <p className="text-muted">
                    Valid until: {new Date(benefits.subscription.endDate).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate("/patient?key=subscription")}
                  >
                    View Benefits
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        
        {/* Plans Grid */}
        <Row className="justify-content-center">
          {plansLoading ? (
            <Col className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading plans...</span>
              </Spinner>
            </Col>
          ) : (
            plans?.map((plan, index) => (
              <PlanCard 
                key={plan._id} 
                plan={plan} 
                isPopular={plan.name === "Premium"} 
              />
            ))
          )}
        </Row>
        
        {/* Features Comparison */}
        <Row className="justify-content-center mt-5">
          <Col lg={10}>
            <Card className="features-comparison">
              <Card.Header>
                <h4 className="mb-0">Compare Features</h4>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Features</th>
                        <th className="text-center">Basic</th>
                        <th className="text-center">Premium</th>
                        <th className="text-center">Family</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Free Blood Tests</td>
                        <td className="text-center">1/month</td>
                        <td className="text-center">2/month</td>
                        <td className="text-center">5/month</td>
                      </tr>
                      <tr>
                        <td>Medicine Discount</td>
                        <td className="text-center">5%</td>
                        <td className="text-center">10%</td>
                        <td className="text-center">15%</td>
                      </tr>
                      <tr>
                        <td>Free Home Collection</td>
                        <td className="text-center">❌</td>
                        <td className="text-center">✅</td>
                        <td className="text-center">✅</td>
                      </tr>
                      <tr>
                        <td>Priority Booking</td>
                        <td className="text-center">❌</td>
                        <td className="text-center">✅</td>
                        <td className="text-center">✅</td>
                      </tr>
                      <tr>
                        <td>Free Consultations</td>
                        <td className="text-center">❌</td>
                        <td className="text-center">1/month</td>
                        <td className="text-center">3/month</td>
                      </tr>
                      <tr>
                        <td>24/7 Health Support</td>
                        <td className="text-center">❌</td>
                        <td className="text-center">❌</td>
                        <td className="text-center">✅</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div className="payment-summary">
              <h5>{selectedPlan.displayName}</h5>
              <p className="text-muted">{selectedPlan.description}</p>
              
              <div className="billing-summary">
                <div className="d-flex justify-content-between">
                  <span>Plan Price:</span>
                  <span>₹{getDiscountedPrice(selectedPlan).price}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Billing:</span>
                  <span className="text-capitalize">{billingType}</span>
                </div>
                {getDiscountedPrice(selectedPlan).savings > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <span>You Save:</span>
                    <span>₹{getDiscountedPrice(selectedPlan).savings}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>₹{getDiscountedPrice(selectedPlan).price}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePayment}
            disabled={paymentLoading || orderLoading}
          >
            {paymentLoading || orderLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Footer />
    </>
  );
};

export default SubscriptionPlans; 