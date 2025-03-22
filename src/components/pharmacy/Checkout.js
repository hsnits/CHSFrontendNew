import React from "react";
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
import { Link, useSearchParams } from "react-router-dom";
import PharmacyHeader from "./PharmacyHeader";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import Footer from "../Footer";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";

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

  const personalFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Personal Details:", values);
      // Here you can call the API for personal details
    },
  });

  const paymentFormik = useFormik({
    initialValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    validationSchema: Yup.object({
      cardName: Yup.string().required("Required"),
      cardNumber: Yup.string().required("Required"),
      expiryMonth: Yup.string().required("Required"),
      expiryYear: Yup.string().required("Required"),
      cvv: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Payment Info:", values);
      // Here you can call the API for payment details
    },
  });

  return (
    <>
      <PharmacyHeader userData={userData} />
      <PharmacyMenu />
      <Container className="py-5">
        <Row>
          {/* Personal Details Section */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <h4>Personal Details</h4>
                <Form onSubmit={personalFormik.handleSubmit}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="firstName"
                      placeholder="First Name"
                      onChange={personalFormik.handleChange}
                      value={personalFormik.values.firstName}
                      isInvalid={
                        personalFormik.touched.firstName &&
                        personalFormik.errors.firstName
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="lastName"
                      placeholder="Last Name"
                      onChange={personalFormik.handleChange}
                      value={personalFormik.values.lastName}
                      isInvalid={
                        personalFormik.touched.lastName &&
                        personalFormik.errors.lastName
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={personalFormik.handleChange}
                      value={personalFormik.values.email}
                      isInvalid={
                        personalFormik.touched.email &&
                        personalFormik.errors.email
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      onChange={personalFormik.handleChange}
                      value={personalFormik.values.phone}
                      isInvalid={
                        personalFormik.touched.phone &&
                        personalFormik.errors.phone
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Form.Control
                      as="textarea"
                      name="address"
                      placeholder="Address"
                      rows={3}
                      onChange={personalFormik.handleChange}
                      value={personalFormik.values.address}
                      isInvalid={
                        personalFormik.touched.address &&
                        personalFormik.errors.address
                      }
                    />
                  </InputGroup>
                  <Button type="submit" variant="primary">
                    Save Personal Info
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h4>Payment Information</h4>
                <Form onSubmit={paymentFormik.handleSubmit}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="cardName"
                      placeholder="Name on Card"
                      onChange={paymentFormik.handleChange}
                      value={paymentFormik.values.cardName}
                      isInvalid={
                        paymentFormik.touched.cardName &&
                        paymentFormik.errors.cardName
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="cardNumber"
                      placeholder="Card Number"
                      onChange={paymentFormik.handleChange}
                      value={paymentFormik.values.cardNumber}
                      isInvalid={
                        paymentFormik.touched.cardNumber &&
                        paymentFormik.errors.cardNumber
                      }
                    />
                  </InputGroup>
                  <Row>
                    <Col>
                      <Form.Control
                        name="expiryMonth"
                        placeholder="MM"
                        onChange={paymentFormik.handleChange}
                        value={paymentFormik.values.expiryMonth}
                        isInvalid={
                          paymentFormik.touched.expiryMonth &&
                          paymentFormik.errors.expiryMonth
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        name="expiryYear"
                        placeholder="YY"
                        onChange={paymentFormik.handleChange}
                        value={paymentFormik.values.expiryYear}
                        isInvalid={
                          paymentFormik.touched.expiryYear &&
                          paymentFormik.errors.expiryYear
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        name="cvv"
                        placeholder="CVV"
                        onChange={paymentFormik.handleChange}
                        value={paymentFormik.values.cvv}
                        isInvalid={
                          paymentFormik.touched.cvv && paymentFormik.errors.cvv
                        }
                      />
                    </Col>
                  </Row>
                  <Button type="submit" variant="success" className="mt-3">
                    Confirm and Pay
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Payment Info Section */}
          <Col md={6} className="mb-4 theiaStickySidebar">
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
      <Footer />
    </>
  );
}
