import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  CardHeader,
  CardBody,
  Table,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PharmacyHeader from "./PharmacyHeader";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import Footer from "../Footer";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import { callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selected, setSelected] = useState({
    shipping: false,
    refund: false,
  });
  const navigate = useNavigate();

  const userData = getLocalStorage(STORAGE.USER_KEY);
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  const { data } = useGetMountData(`/user/cart/${userData?._id}`);
  const { data: addresses, getAllData: getAllAddresses } = useGetMountData(
    `/user/address/${userData?._id}`
  );

  const getDiscountedPrice = (item) => {
    const discount =
      key == "Wholesale" ? item.sellerDiscount || 25 : item.discount || 0;
    return (item.price - (item.price * discount || 0) / 100).toFixed(2);
  };

  const calculateTotal = () => {
    if (!data?.items)
      return { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 };

    const subtotal = data.items.reduce(
      (acc, it) => acc + it?.quantity * it?.productId?.price,
      0
    );

    const discount = data.items.reduce((acc, it) => {
      const discountPrice =
        it?.quantity *
        (it?.productId?.price - getDiscountedPrice(it?.productId));
      return acc + discountPrice;
    }, 0);

    const tax = (subtotal - discount || 0) * 0.1;
    // 10% Tax
    const shipping = 50;
    // Fixed shipping charge

    const total = subtotal - discount || 0 + tax + shipping;

    return { subtotal, discount, tax, shipping, total };
  };

  const totals = calculateTotal();

  const addressFormik = useFormik({
    initialValues: {
      name: "",
      mobileNo: "",
      email: "",
      city: "",
      pincode: "",
      state: "",
      houseNumber: "",
      landmark: "",
      type: "home",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      mobileNo: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
      email: Yup.string().email("Invalid email format"),
      city: Yup.string().required("City is required"),
      pincode: Yup.string()
        .required("Pincode is required")
        .matches(/^[0-9]{6}$/, "Invalid pincode"),
      state: Yup.string().required("State is required"),
      houseNumber: Yup.string().required("House number is required"),
      landmark: Yup.string(),
      type: Yup.string().required("Address type is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await callPostApi(`/user/address`, {
          userId: userData?._id,
          ...values,
        });
        if (response?.status) {
          toastMessage("success", "Address saved successfully!");
          await getAllAddresses(`/user/address/${userData?._id}`);
          addressFormik.resetForm();
        }
      } catch (error) {
        console.error("Failed to save address", error);
        toastMessage("error", "Failed to save address");
      }
    },
  });

  const handleCheckout = async () => {
    try {
      if (!selectedAddress || !totals.total.toFixed(2)) {
        return;
      }

      const orderResponse = await callPostApi("/payment/create-order", {
        amount: totals.total.toFixed(2),
        currency: "INR",
      });

      if (!orderResponse.status) {
        window.location.reload();
        return;
      }

      const { id, amount } = orderResponse.data;

      if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        toastMessage(
          "error",
          "Failed to load Razorpay SDK. Please refresh and try again."
        );
        window.location.reload();
        return;
      }

      const options = {
        key: "rzp_test_m7Sk7RENHjMHdW",
        amount: amount,
        currency: "INR",
        name: "CHS Healthcare App",
        description: "Ecommerce Checkout",
        order_id: id,
        handler: async function (response) {
          console.log("Payment Response:", response);

          // Verify payment on the server
          try {
            const verifyResponse = await callPostApi(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.status) {
              toastMessage("success", "Payment Successful!");
              navigate("/payment-status", {
                state: {
                  status: "success",
                  orderId: id,
                  amount: totals.total.toFixed(2),
                },
                replace: true, // ✅ This ensures the current URL is replaced
              });
            } else {
              toastMessage("error", "Payment Verification Failed!");
              navigate("/payment-status", {
                state: {
                  status: "failed",
                  orderId: id,
                  amount: totals.total.toFixed(2),
                },
                replace: true, // ✅ Replace the current URL
              });
            }
          } catch (error) {
            console.error("Verification API call failed:", error);
            toastMessage("error", "Verification failed. Please try again.");
          }
        },
        prefill: {
          name: selectedAddress?.name || "User",
          email: selectedAddress?.email || "",
          contact: selectedAddress?.mobileNo,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Initialize Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout failed", error);
      toastMessage("error", "Checkout failed. Please try again.");
    }
  };

  return (
    <>
      <PharmacyHeader userData={userData} />
      <PharmacyMenu />
      <Container className="py-5">
        <Row>
          {/* Personal Details Section */}
          <Col md={7} className="mb-4">
            <Card>
              <Card.Body>
                <h4>Address Details</h4>
                <Form onSubmit={addressFormik.handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="name"
                          placeholder="Full Name *"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.name}
                          isInvalid={
                            addressFormik.touched.name &&
                            addressFormik.errors.name
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.name}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>

                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="mobileNo"
                          placeholder="Mobile No *"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.mobileNo}
                          isInvalid={
                            addressFormik.touched.mobileNo &&
                            addressFormik.errors.mobileNo
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.mobileNo}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Email (optional)"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.email}
                          isInvalid={
                            addressFormik.touched.email &&
                            addressFormik.errors.email
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>

                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="city"
                          placeholder="City *"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.city}
                          isInvalid={
                            addressFormik.touched.city &&
                            addressFormik.errors.city
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.city}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="pincode"
                          placeholder="Pincode *"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.pincode}
                          isInvalid={
                            addressFormik.touched.pincode &&
                            addressFormik.errors.pincode
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.pincode}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>

                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="state"
                          placeholder="State *"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.state}
                          isInvalid={
                            addressFormik.touched.state &&
                            addressFormik.errors.state
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.state}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="houseNumber"
                          placeholder="House/ Floor/ Flat Number *"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.houseNumber}
                          isInvalid={
                            addressFormik.touched.houseNumber &&
                            addressFormik.errors.houseNumber
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.houseNumber}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>

                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="landmark"
                          placeholder="Landmark (optional)"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.landmark}
                          isInvalid={
                            addressFormik.touched.landmark &&
                            addressFormik.errors.landmark
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.landmark}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* Address Type Selection */}
                  <Row>
                    <Col md={6}>
                      <InputGroup className="mb-3">
                        <Form.Select
                          name="type"
                          onChange={addressFormik.handleChange}
                          value={addressFormik.values.type}
                          isInvalid={
                            addressFormik.touched.type &&
                            addressFormik.errors.type
                          }
                        >
                          <option value="home">Home</option>
                          <option value="office">Office</option>
                          <option value="friendhome">Friend's Home</option>
                          <option value="other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {addressFormik.errors.type}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Button type="submit" variant="primary">
                    Save & Continue
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              {addresses && addresses.length > 0 && (
                <Card.Body>
                  <h4 className="mt-4 mb-3">Select Address</h4>

                  {addresses.map((addr) => (
                    <Card
                      key={addr._id}
                      className="mb-3 p-3 border rounded shadow-sm"
                    >
                      <Form.Check
                        type="radio"
                        name="address"
                        onChange={() => setSelectedAddress(addr)}
                        id={`address-${addr._id}`}
                        label={
                          <div>
                            <strong>{addr.name}</strong>
                            <span className="text-muted"> ({addr.type})</span>
                            <div className="mt-1">
                              <i className="fas fa-home"></i> {addr.houseNumber}
                              , {addr.city}, {addr.state}
                            </div>
                            <div className="text-muted">
                              <i className="fas fa-map-marker-alt"></i>{" "}
                              {addr.landmark ? addr.landmark + ", " : ""}
                              {addr.pincode}
                            </div>
                            <div>
                              <i className="fas fa-phone"></i> {addr.mobileNo}
                            </div>
                            {addr.email && (
                              <div>
                                <i className="fas fa-envelope"></i> {addr.email}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  ))}

                  <div className="policy-item">
                    <Form.Check
                      type="checkbox"
                      name="policy"
                      checked={selected.shipping}
                      onChange={() =>
                        setSelected((prev) => ({
                          ...prev,
                          shipping: !prev.shipping,
                        }))
                      }
                      label={
                        <>
                          <strong>Shipping & Delivery Policy</strong>{" "}
                          <a
                            href="/shipping-policy"
                            className="policy-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            (See more...)
                          </a>
                        </>
                      }
                    />
                  </div>

                  <div className="policy-item">
                    <Form.Check
                      type="checkbox"
                      name="policy"
                      checked={selected.refund}
                      onChange={() =>
                        setSelected((prev) => ({
                          ...prev,
                          refund: !prev.refund,
                        }))
                      }
                      label={
                        <>
                          <strong>Cancellation & Refund Policy</strong>{" "}
                          <a
                            href="/refund-policy"
                            className="policy-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            (See more...)
                          </a>
                        </>
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="success"
                    className="mt-3 w-100"
                    disabled={
                      !selected.shipping ||
                      !selected.refund ||
                      selectedAddress == null
                    }
                    onClick={handleCheckout}
                  >
                    Confirm and Pay
                  </Button>
                </Card.Body>
              )}
            </Card>
          </Col>

          {/* Payment Info Section */}
          <Col md={5} className="mb-4">
            <Card className="booking-card">
              <CardHeader>
                <h3 className="card-title">Your Order</h3>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <Table>
                    <tr>
                      <th>Product</th>
                      <th className="text-end">Total</th>
                    </tr>
                    {data &&
                      data?.items?.length > 0 &&
                      data?.items?.map((item) => (
                        <tbody>
                          <tr>
                            <td>{item?.productId?.name}</td>
                            <td className="text-end">
                              {" "}
                              ₹{" "}
                              {(
                                getDiscountedPrice(item?.productId) *
                                item?.quantity
                              ).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                  </Table>
                </div>
                <div className="booking-summary pt-5">
                  <div className="booking-item-wrap">
                    <ul className="list-unstyled">
                      <li className="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <strong>₹ {totals.subtotal.toFixed(2)}</strong>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Discount:</span>
                        <strong>- ₹ {totals.discount.toFixed(2)}</strong>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Discount Price:</span>
                        <strong>
                          ₹{" "}
                          {totals?.subtotal?.toFixed(2) -
                            totals?.discount?.toFixed(2)}
                        </strong>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Tax (10%):</span>
                        <strong>₹ {totals?.tax?.toFixed(2)}</strong>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Shipping:</span>
                        <strong>₹ {totals?.shipping?.toFixed(2)}</strong>
                      </li>
                      <hr />
                      <li className="d-flex justify-content-between">
                        <span>Total:</span>
                        <strong>₹ {totals?.total?.toFixed(2)}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
