import React from "react";
import Header from "../Header";
import Breadcrumb from "../Breadcrumb";
import Footer from "../Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./CancellationRefundPolicy.css"; // External CSS for styling

const CancellationRefundPolicy = () => {
  return (
    <>
      <Header />
      <Breadcrumb />

      <section className="policy-section py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="policy-title">🔄 Refund and Cancellation Policy</h2>

              <Card className="policy-card">
                <Card.Body>
                  <p>
                    This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:
                  </p>
                  <ul>
                    <li>📅 Cancellations will only be considered if the request is made <strong>within 7 days</strong> of placing the order.</li>
                    <li>🚚 However, cancellation requests may not be entertained if the orders have been communicated to the sellers / merchants listed on the Platform and they have initiated the <strong>shipping process</strong>, or the product is out for delivery.</li>
                    <li>🚫 In such cases, you may choose to <strong>reject the product at the doorstep</strong>.</li>
                    <li>❌ <strong>KRITARTH HITARTH SEWA SAMITI</strong> does not accept cancellation requests for <strong>perishable items</strong> like flowers, eatables, etc.</li>
                    <li>🔍 However, refunds or replacements can be made if the user establishes that the <strong>quality of the product delivered is not good</strong>.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="policy-card">
                <Card.Body>
                  <h4>📦 Damaged or Defective Items</h4>
                  <ul>
                    <li>⚠️ In case of receipt of <strong>damaged or defective items</strong>, report it to our <strong>customer service team</strong>.</li>
                    <li>✅ The request will be entertained once the seller/merchant listed on the Platform has checked and verified the issue.</li>
                    <li>⏱️ This should be reported <strong>within 7 days</strong> of receipt of the product.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="policy-card">
                <Card.Body>
                  <h4>📸 Product Not as Expected</h4>
                  <ul>
                    <li>🔍 If you feel that the product <strong>does not match the website description</strong> or your expectations, notify <strong>customer service</strong> within <strong>7 days</strong>.</li>
                    <li>📢 The customer service team will review your complaint and take an appropriate decision.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="policy-card">
                <Card.Body>
                  <h4>🛠️ Warranty Claims</h4>
                  <p>
                    In case of complaints regarding the products that come with a <strong>manufacturer's warranty</strong>, please refer the issue directly to the manufacturer.
                  </p>
                </Card.Body>
              </Card>

              <Card className="policy-card">
                <Card.Body>
                  <h4>💰 Refund Process</h4>
                  <ul>
                    <li>✅ In case of any <strong>refunds approved</strong> by <strong>KRITARTH HITARTH SEWA SAMITI</strong>, it will take <strong>3 days</strong> for the refund to be processed to you.</li>
                  </ul>
                </Card.Body>
              </Card>

              <h2 className="policy-title mt-5">🔁 Return Policy</h2>

              <Card className="policy-card">
                <Card.Body>
                  <ul>
                    <li>🔹 We offer <strong>refund/exchange</strong> within the first <strong>7 days</strong> from the date of your purchase.</li>
                    <li>🚫 If <strong>7 days have passed</strong> since your purchase, you will not be offered a return, exchange, or refund.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="policy-card">
                <Card.Body>
                  <h4>📦 Return/Exchange Eligibility</h4>
                  <ul>
                    <li>✅ The purchased item must be <strong>unused</strong> and in the same condition as you received it.</li>
                    <li>📦 The item must have its <strong>original packaging</strong>.</li>
                    <li>🚫 Items purchased on sale <strong>may not be eligible</strong> for a return or exchange.</li>
                    <li>🔍 Only <strong>defective or damaged items</strong> are eligible for replacement.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="policy-card">
                <Card.Body>
                  <h4>🔍 Return/Exchange Inspection</h4>
                  <ul>
                    <li>✅ For accepted return/exchange requests, once your returned product/item is received and inspected, we will send you an <strong>email notification</strong>.</li>
                    <li>📢 If the returned/exchanged item is approved after <strong>quality checks</strong>, your request will be processed in accordance with our policies.</li>
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

export default CancellationRefundPolicy;
