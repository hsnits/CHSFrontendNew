import React from "react";
import PharmacyTopBar from "./PharmacyTopBar";
import PharmacySearchBar from "./PharmacySearchBar";
import Breadcrumb from "../Breadcrumb";
import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  CardBody,
  Table,
  Form,
  Button,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { Input, Label } from "reactstrap";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import Footer from "../Footer";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import PharmacyHeader from "./PharmacyHeader";
import { useFormik } from "formik";

export default function Checkout() {
  const userData = getLocalStorage(STORAGE.USER_KEY);
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  const { data } = useGetMountData(`/user/cart/${userData?._id}`);

  const getDiscountedPrice = (item) => {
    const discount =
      key == "Wholesale" ? item.sellerDiscount || 25 : item.discount || 0;
    return (item.price - (item.price * discount) / 100).toFixed(2);
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

    const tax = (subtotal - discount) * 0.1;
    // 10% Tax
    const shipping = 50;
    // Fixed shipping charge

    const total = subtotal - discount + tax + shipping;

    return { subtotal, discount, tax, shipping, total };
  };

  const totals = calculateTotal();

//    const formik = useFormik({
//       enableReinitialize: true,
//       initialValues: {
//         heartRate: reportData?.heartRate || "",
//         bodyTemperature: reportData?.bodyTemperature || "",
//         glucoseLevel: reportData?.glucoseLevel || "",
//         spo2: reportData?.spo2 || "",
//         bloodPressure: reportData?.bloodPressure || "",
//         bmi: reportData?.bmi || "",
//         lastVisit: reportData?.lastVisit || "",
//       },
//       validationSchema,
//       onSubmit: async (values) => {
//         setLoading(true);
//         try {
//           const response = await callPutApi(
//             `/patient/update-health-report/${userId}`,
//             values
//           );
//           if (response?.status) {
//             toastMessage("success", "Health report updated successfully");
//             refreshData();
//             onClose();
//           } else {
//             toastMessage("error", "Failed to update report");
//           }
//         } catch (error) {
//           console.error("Error updating report:", error);
//           toastMessage("error", "An unexpected error occurred");
//         } finally {
//           setLoading(false);
//         }
//       },
//     });

  return (
    <>
       <PharmacyHeader userData={userData} />
      <PharmacyMenu/>
      <Breadcrumb />
      <div className="content">
        <Container>
          <Row>
            <Col md="6" lg="7">
              <Card>
                <Card.Header>
                  <h3 className="card-title">Billing details</h3>
                </Card.Header>
                <CardBody>
                  <Form>
                    <div className="info-widget">
                      <h4 className="card-title">Personal Information</h4>
                      <Row>
                        <Col md="6" sm="12">
                          <div className="mb-3 card-label">
                            <Label className="mb-2">First Name</Label>
                            <Input className="form-control" type="text" />
                          </div>
                        </Col>
                        <Col md="6" sm="12">
                          <div className="mb-3 card-label">
                            <Label className="mb-2">Last Name</Label>
                            <Input className="form-control" type="text" />
                          </div>
                        </Col>
                        <Col md="6" sm="12">
                          <div className="mb-3 card-label">
                            <Label className="mb-2">Email</Label>
                            <Input className="form-control" type="email" />
                          </div>
                        </Col>
                        <Col md="6" sm="12">
                          <div className="mb-3 card-label">
                            <Label className="mb-2">Phone</Label>
                            <Input className="form-control" type="number" />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="info-widget">
                      <h4 className="card-title">Shipping Details</h4>
                      <div className="mb-3 card-label">
                        <Label className="ps-0 ms-0 mb-2">Address</Label>
                        <textarea
                          rows="5"
                          className="form-control"
                          name="shipping"
                        ></textarea>
                      </div>
                    </div>

                    <div className="payment-widget">
                      <h4 className="card-title">Payment Method</h4>

                      <div className="payment-list">
                        <Label className="payment-radio credit-card-option">
                          <input type="radio" name="radio" checked />
                          <span className="checkmark"></span>
                          Credit card
                        </Label>
                        <Row>
                          <Col md="6" sm="12">
                            <div className="mb-3 card-label">
                              <Label for="card_name">Name on Card</Label>
                              <Input className="form-control" type="text" />
                            </div>
                          </Col>
                          <Col md="6" sm="12">
                            <div className="mb-3 card-label">
                              <Label for="card_number">Card Number</Label>
                              <Input
                                className="form-control"
                                type="text"
                                placeholder="1234 5678 9876 5432"
                              />
                            </div>
                          </Col>
                          <Col md="6" sm="12">
                            <div className="mb-3 card-label">
                              <Label for="expiry_month">Expiry Month</Label>
                              <Input
                                className="form-control"
                                id="expiry_month"
                                placeholder="MM"
                                type="text"
                              />
                            </div>
                          </Col>
                          <Col md="6" sm="12">
                            <div className="mb-3 card-label">
                              <Label for="expiry_year">Expiry Year</Label>
                              <Input
                                className="form-control"
                                id="expiry_year"
                                placeholder="YY"
                                type="text"
                              />
                            </div>
                          </Col>
                          <Col md="6" sm="12">
                            <div className="mb-3 card-label">
                              <Label for="cvv">CVV</Label>
                              <Input
                                className="form-control"
                                id="cvv"
                                type="text"
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="payment-list">
                        <Label className="payment-radio paypal-option">
                          <Input type="radio" name="radio" />
                          <span className="checkmark"></span>
                          Cash On Delivery
                        </Label>
                      </div>

                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <Input type="checkbox" id="terms_accept1" />
                          <Label for="terms_accept1">
                            {" "}
                            &nbsp; I have read and accept{" "}
                            <Link to="#">Terms &amp; Conditions</Link>
                          </Label>
                        </div>
                      </div>

                      <div className="submit-section mt-4">
                        <Link
                          to="/OrderSuccess"
                          className="btn btn-primary submit-btn"
                        >
                          Confirm and Pay
                        </Link>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md="6" lg="5" className="theiaStickySidebar">
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
                            {totals.subtotal.toFixed(2) -
                              totals.discount.toFixed(2)}
                          </strong>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span>Tax (10%):</span>
                          <strong>₹ {totals.tax.toFixed(2)}</strong>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span>Shipping:</span>
                          <strong>₹ {totals.shipping.toFixed(2)}</strong>
                        </li>
                        <hr />
                        <li className="d-flex justify-content-between">
                          <span>Total:</span>
                          <strong>₹ {totals.total.toFixed(2)}</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}
