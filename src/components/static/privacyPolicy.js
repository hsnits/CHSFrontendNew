import React from "react";
import Header from "../Header";
import Breadcrumb from "../Breadcrumb";
import Footer from "../Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./privacyPolicy.css"; // External CSS file for styling

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <Breadcrumb />

      <section className="privacy-section py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="privacy-title">🔒 Privacy Policy</h2>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>📢 Introduction</h4>
                  <p>
                    This Privacy Policy describes how <strong>KRITARTH HITARTH SEWA SAMITI</strong> and its affiliates
                    ("we", "our", "us") collect, use, share, protect, or otherwise process your personal data through
                    our website <strong>Chshealthcare.in</strong> (the "Platform"). By using our Platform, you agree to
                    the terms of this Privacy Policy.
                  </p>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>📊 Collection of Information</h4>
                  <ul>
                    <li>🧑‍💼 <strong>Personal Data:</strong> Name, date of birth, address, contact number, and email ID.</li>
                    <li>💳 <strong>Sensitive Data:</strong> Bank details, payment info, and biometric data (if applicable).</li>
                    <li>🌐 <strong>Usage Data:</strong> Behavior, preferences, and transactional information on the Platform.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>🔧 Usage of Information</h4>
                  <ul>
                    <li>🚀 To provide and improve our services and products.</li>
                    <li>📢 Marketing and promotional communications.</li>
                    <li>🔎 Fraud prevention and legal compliance.</li>
                    <li>📊 Research, analysis, and customer support.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>🔗 Sharing of Information</h4>
                  <ul>
                    <li>👥 <strong>Internal Sharing:</strong> Within our group entities and affiliates.</li>
                    <li>🤝 <strong>Third Parties:</strong> Logistics partners, payment processors, and business affiliates.</li>
                    <li>⚖️ <strong>Legal Authorities:</strong> Government or law enforcement agencies when required by law.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>🔒 Security Precautions</h4>
                  <p>
                    We adopt reasonable security practices to protect your data. However, data transmission over the internet
                    carries inherent risks. Please protect your login credentials.
                  </p>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>🗑️ Data Deletion and Retention</h4>
                  <p>
                    You can delete your account through the platform settings or contact us at
                    <a href="mailto:info@chshealthcare.in"> info@chshealthcare.in</a>. We may retain data for legal
                    purposes or fraud prevention.
                  </p>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>📃 Your Rights</h4>
                  <ul>
                    <li>✅ Access, rectify, or update your personal data.</li>
                    <li>🚫 Withdraw consent by contacting us.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>🔔 Changes to Privacy Policy</h4>
                  <p>
                    We may update this Privacy Policy from time to time. Please review it periodically for any changes.
                  </p>
                </Card.Body>
              </Card>

              <Card className="privacy-card">
                <Card.Body>
                  <h4>📍 Grievance Officer</h4>
                  <ul>
                    <li>👤 <strong>Name:</strong> Anupam Pal</li>
                    <li>📞 <strong>Designation:</strong> Admin</li>
                    <li>🏢 <strong>Company:</strong> Kritarth Hitarth Sewa Samiti</li>
                    <li>📧 <strong>Email:</strong> <a href="mailto:info@chshealthcare.in">info@chshealthcare.in</a></li>
                    <li>🕒 <strong>Time:</strong> Monday - Friday (9:00 - 18:00)</li>
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

export default PrivacyPolicy;
