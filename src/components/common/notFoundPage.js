import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";

const NotFoundPage = () => {
  return (
    <div>
      <div className="breadcrumb-bar-two">
        <Container>
          <Row className="align-items-center inner-banner">
            <Col md="12" xs="12" className="text-center">
              <h1 className="breadcrumb-title text-white text-capitalize">
                Page Not Found
              </h1>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="Patients-section-fifteen ">
        <Container>
          <Row>
            <Col md="12" xs="12" className="text-center">
              <h2>404</h2>
              <h2>Page Not Found</h2>
              <div>
                <Link to={"/"}>
                  <Button>Go to home</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default NotFoundPage;
