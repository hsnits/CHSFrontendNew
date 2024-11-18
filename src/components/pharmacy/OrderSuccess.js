import React from "react";
import PharmacyTopBar from "./PharmacyTopBar";
import PharmacySearchBar from "./PharmacySearchBar";
import Footer from "../Footer";
import Breadcrumb from "../Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import { CheckCircle } from "react-feather";

export default function OrderSuccess() {
    return (
        <>
            <PharmacyTopBar />
            <PharmacySearchBar />
            <Breadcrumb />

            <div className="content success-page-cont">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg='6'>
                            <Card className="success-card">
                                <CardBody>
                                    <div className="success-cont">
                                     <CheckCircle/>
                                        <h3 className="mt-4">Payment Successfully!</h3>
                                        <p className="mb-0 mt-3">Product ID: 245468</p>
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