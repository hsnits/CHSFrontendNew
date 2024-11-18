import React from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter(x => x);

    return (
        <div className="breadcrumb-bar-two">
            <Container>
                <Row className="align-items-center inner-banner">
                    <Col md='12' xs='12' className="text-center">
                        <h2 className="breadcrumb-title text-white text-capitalize">{pathnames[pathnames.length - 1]}</h2>
                        <Nav aria-label="breadcrumb" className="page-breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                {pathnames.map((pathname, index) => {
                                    const isLast = index === pathnames.length - 1;
                                    const linkPath = `/${pathnames.slice(0, index + 1).join("/")}`;

                                    return isLast ? (
                                        <li key={linkPath} className="breadcrumb-item text-white text-capitalize" aria-current="page">
                                            {pathname}
                                        </li>
                                    ) : (
                                        <li key={linkPath} className="breadcrumb-item">
                                            <Link to={linkPath} className="text-white text-capitalize">{pathname}</Link>
                                        </li>
                                    );
                                })}
                            </ol>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Breadcrumb;
