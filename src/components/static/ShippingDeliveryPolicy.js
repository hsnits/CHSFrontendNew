import React from "react";
import Header from "../Header";
import Breadcrumb from "../Breadcrumb";
import Footer from "../Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./ShippingDeliveryPolicy.css"; // External CSS for styling

const ShippingDeliveryPolicy = () => {
  return (
    <>
      <Header />
      <Breadcrumb />

      {/* <section className="policy-section py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="policy-title">🚚 Shipping & Delivery Policy</h2>

              <Card className="policy-card">
                <Card.Body>
                  <p>
                    For <strong>International buyers</strong>, orders are
                    shipped and delivered through
                    <strong>
                      {" "}
                      registered international courier companies
                    </strong>{" "}
                    and/or
                    <strong> International Speed Post</strong> only. 🌍✈️
                  </p>
                  <p>
                    For <strong>Domestic buyers</strong>, orders are shipped
                    through
                    <strong> registered domestic courier companies</strong>{" "}
                    and/or
                    <strong> Speed Post</strong> only. 🇮🇳📦
                  </p>
                </Card.Body>
              </Card>

             
              <Card className="policy-card">
                <Card.Body>
                  <h4>📅 Delivery Timeline</h4>
                  <ul>
                    <li>
                      📦 Orders are shipped <strong>within 0-7 days</strong> or
                      as per the agreed delivery date.
                    </li>
                    <li>
                      🚚 Shipment and delivery are subject to{" "}
                      <strong>Courier Company / Post Office norms</strong>.
                    </li>
                    <li>
                      ⏱️ <strong>Kritarth Hitarth Sewa Samiti</strong>{" "}
                      guarantees to hand over the consignment to the courier
                      company
                      <strong> within 0-7 days</strong> from the date of order &
                      payment.
                    </li>
                  </ul>
                </Card.Body>
              </Card>

           
              <Card className="policy-card">
                <Card.Body>
                  <h4>📍 Delivery Address</h4>
                  <p>
                    ✅ Delivery will be made to the{" "}
                    <strong>address provided by the buyer</strong> at the time
                    of order placement.
                  </p>
                  <p>
                    📧 Delivery confirmation will be sent to your{" "}
                    <strong>registered email ID</strong>.
                  </p>
                </Card.Body>
              </Card>

             
              <Card className="policy-card">
                <Card.Body>
                  <h4>⚠️ Delivery Issues</h4>
                  <p>
                    🛠️ <strong>Kritarth Hitarth Sewa Samiti</strong> is{" "}
                    <strong>not liable for delays</strong> by courier companies
                    or postal authorities.
                  </p>
                  <p>
                    🔹 For any <strong>issues or inquiries</strong>, contact us
                    at:
                  </p>
                  <p>
                    📧{" "}
                    <a
                      href="mailto:info@chshealthcare.in"
                      className="email-link"
                    >
                      info@chshealthcare.in
                    </a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section> */}

      <section className="policy-section py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="policy-title">🚚 Shipping & Delivery Policy</h2>

              <Card className="policy-card">
                <Card.Body>
                  <ul>
                    <li>
                      📦 Orders for the user are shipped through{" "}
                      <strong>registered domestic courier companies</strong>{" "}
                      and/or <strong>Speed Post</strong> only.
                    </li>
                    <li>
                      ⏱️ Orders are shipped <strong>within 10 days</strong> from
                      the date of order and/or payment.
                    </li>
                    <li>
                      📜 Delivery date is as per the agreement at the time of
                      order confirmation and subject to{" "}
                      <strong>Courier Company / Post Office norms</strong>.
                    </li>
                    <li>
                      ⚠️ The <strong>Platform Owner</strong> is{" "}
                      <strong>not liable for any delays</strong> caused by the
                      courier company or postal authorities.
                    </li>
                    <li>
                      🏠 Delivery will be made to the{" "}
                      <strong>address provided by the buyer</strong> at the time
                      of purchase.
                    </li>
                    <li>
                      📧 Delivery confirmation will be sent to your{" "}
                      <strong>email ID</strong> as specified during
                      registration.
                    </li>
                    <li>
                      🚫 Any <strong>shipping costs levied</strong> by the
                      seller or Platform Owner (if applicable) are{" "}
                      <strong>non-refundable</strong>.
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default ShippingDeliveryPolicy;
