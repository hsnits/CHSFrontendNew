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
import { callPostApi, callGetApi } from "../../_service";
import "./SubscriptionPlans.css";

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [billingType, setBillingType] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Hardcoded fallback plans for testing
  const fallbackPlans = [
    {
      _id: "6501a1b2c3d4e5f6a7b8c9d0",
      name: "Basic",
      displayName: "Basic Health Plan",
      description: "Essential healthcare benefits for individuals and small families",
      price: {
        monthly: 199,
        yearly: 999,
      },
      features: [
        "Up to 50% discount in pathology",
        "Up to 50% discount in diagnosis",
        "Up to 50% discount in medicines and home health care devices",
        "Up to 30% discount in medical consultation",
        "AI generated symptoms checker",
        "Cover up to 2 family members",
        "Email support",
        "Health tips and remedies",
        "Nursing support at home",
        "Document locker",
        "100% data security"
      ],
    },
    {
      _id: "6501a1b2c3d4e5f6a7b8c9d1",
      name: "Premium",
      displayName: "Premium Health Plan",
      description: "Enhanced healthcare benefits with additional services",
      price: {
        monthly: 399,
        yearly: 2499,
      },
      features: [
        "Up to 50% discount in medicines",
        "Up to 50% discount in consultation",
        "Cover up to 4 family members"
      ],
    },
    {
      _id: "6501a1b2c3d4e5f6a7b8c9d2",
      name: "Family",
      displayName: "Family Health Plan",
      description: "Comprehensive healthcare solution for larger families",
      price: {
        monthly: 699,
        yearly: 4999,
      },
      features: [
        "One blood test free per month",
        "10% extra discount in medicines",
        "One free consultation per month covering up to 6 family members"
      ],
    }
  ];
  
  const { 
    plans: reduxPlans, 
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

  // Use redux plans if available, otherwise use fallback plans
  const plans = (reduxPlans && reduxPlans.length > 0) ? reduxPlans : fallbackPlans;

  // Function to load Razorpay SDK if not already loaded
  const loadRazorpaySDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay SDK failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    console.log("Component mounted, loading subscription plans...");
    // Try both Redux and direct API call
    dispatch(getSubscriptionPlans());
    
    // Also try direct API call as fallback
    const loadPlansDirectly = async () => {
      try {
        const response = await callGetApi("/subscription/plans");
        console.log("Direct API call for plans:", response);
      } catch (error) {
        console.error("Direct API call failed:", error);
      }
    };
    
    loadPlansDirectly();
    
    const userData = getLocalStorage(STORAGE.USER_KEY);
    console.log("User data in useEffect:", userData);
    if (userData) {
      dispatch(getSubscriptionBenefits());
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("Plans state updated:", plans);
    console.log("Plans loading state:", plansLoading);
    console.log("Benefits state:", benefits);
  }, [plans, plansLoading, benefits]);

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
    
    setPaymentLoading(true);
    
    try {
      const userData = getLocalStorage(STORAGE.USER_KEY);
      console.log("User data:", userData);
      
      if (!userData || !userData.accessToken) {
        toastMessage("error", "Please login to purchase subscription");
        navigate("/login");
        setPaymentLoading(false);
        return;
      }
      
      const { price } = getDiscountedPrice(selectedPlan);
      console.log("Selected plan:", selectedPlan);
      console.log("Billing type:", billingType);
      console.log("Price:", price);
      
      // Ensure Razorpay SDK is loaded
      console.log("Loading Razorpay SDK...");
      await loadRazorpaySDK();
      console.log("Razorpay SDK loaded successfully");
      
      // Create payment order directly (bypass subscription API for now)
      console.log("Creating payment order...");
      const orderResponse = await callPostApi("/payment/create-order", {
        amount: price,
        currency: "INR",
      });

      console.log("Order response:", orderResponse);

      if (!orderResponse.status) {
        console.error("Order creation failed:", orderResponse);
        toastMessage("error", orderResponse.message || "Failed to create payment order");
        setPaymentLoading(false);
        return;
      }

      const { id, amount } = orderResponse.data;
      console.log("Payment order created:", { id, amount });

      if (!id) {
        console.error("Invalid payment order:", orderResponse.data);
        toastMessage("error", "Invalid payment order received");
        setPaymentLoading(false);
        return;
      }

      console.log("Initializing Razorpay with options...");
      const options = {
        key: "rzp_test_m7Sk7RENHjMHdW",
        amount: amount,
        currency: "INR",
        name: "CHS Healthcare App",
        description: `${selectedPlan.displayName} Subscription - ${billingType}`,
        order_id: id,
        handler: async function (response) {
          console.log("Payment Response:", response);

          // Verify payment first
          try {
            console.log("Verifying payment...");
            const verifyResponse = await callPostApi(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            console.log("Verify response:", verifyResponse);

            if (verifyResponse.status) {
              // Now create the subscription record
              console.log("Creating subscription record...");
              const subscriptionData = {
                userId: userData._id,
                planId: selectedPlan._id,
                planName: selectedPlan.displayName,
                billingType: billingType,
                amount: price,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              };

              try {
                const subscriptionResponse = await callPostApi(
                  "/payment/create-subscription",
                  subscriptionData
                );

                console.log("Subscription response:", subscriptionResponse);

                if (subscriptionResponse.status) {
                  setShowPaymentModal(false);
                  setSelectedPlan(null);
                  
                  toastMessage(
                    "success",
                    `Payment Successful! ${selectedPlan.displayName} subscription activated!`
                  );
                  
                  // Navigate to patient dashboard with success state
                  navigate("/patient", {
                    state: {
                      status: "success",
                      subscriptionPlan: selectedPlan.displayName,
                      amount: price,
                      subscriptionId: subscriptionResponse.data.subscriptionId,
                    },
                  });
                } else {
                  console.error("Subscription creation failed:", subscriptionResponse);
                  toastMessage("error", subscriptionResponse.message || "Subscription activation failed!");
                }
              } catch (subscriptionError) {
                console.error("Subscription creation error:", subscriptionError);
                toastMessage("error", "Subscription activation failed. Please contact support.");
              }
            } else {
              console.error("Payment verification failed:", verifyResponse);
              toastMessage("error", verifyResponse.message || "Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Verification API call failed:", error);
            toastMessage("error", "Verification failed. Please try again.");
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phoneNumber || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log("Razorpay modal dismissed");
            setPaymentLoading(false);
          }
        }
      };

      console.log("Razorpay options:", options);

      // Initialize Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        toastMessage("error", `Payment failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      
      console.log("Opening Razorpay checkout...");
      rzp.open();
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toastMessage("error", error.response.data.message || "Failed to initiate payment. Please try again.");
      } else if (error.message) {
        toastMessage("error", error.message);
      } else {
        toastMessage("error", "Failed to initiate payment. Please try again.");
      }
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
          <Modal.Title>
            <i className="fas fa-credit-card me-2"></i>
            Confirm Subscription Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div className="payment-summary">
              <div className="plan-summary mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="plan-icon me-3">
                    <i className="fas fa-shield-alt fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">{selectedPlan.displayName}</h5>
                    <p className="text-muted mb-0">{selectedPlan.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="billing-summary">
                <div className="d-flex justify-content-between py-2">
                  <span>Plan Price:</span>
                  <span className="fw-bold">₹{getDiscountedPrice(selectedPlan).price}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Billing Period:</span>
                  <span className="text-capitalize fw-bold">{billingType}</span>
                </div>
                {getDiscountedPrice(selectedPlan).savings > 0 && (
                  <div className="d-flex justify-content-between py-2 text-success">
                    <span>You Save:</span>
                    <span className="fw-bold">₹{getDiscountedPrice(selectedPlan).savings}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between py-2 fs-5">
                  <span className="fw-bold">Total Amount:</span>
                  <span className="fw-bold text-primary">₹{getDiscountedPrice(selectedPlan).price}</span>
                </div>
              </div>

              <div className="payment-info mt-3">
                <small className="text-muted">
                  <i className="fas fa-lock me-1"></i>
                  Secure payment powered by Razorpay. Your payment information is encrypted and secure.
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            <i className="fas fa-times me-1"></i>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handlePayment}
            disabled={paymentLoading || orderLoading}
            className="d-flex align-items-center"
          >
            {paymentLoading || orderLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card me-2"></i>
                Pay ₹{selectedPlan ? getDiscountedPrice(selectedPlan).price : 0}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Footer />
    </>
  );
};

export default SubscriptionPlans; 