import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { MapPin, Search } from "react-feather";
import logo_img from "../../assets/img/chs_logo.png";
import cart_img from "../../assets/img/icons/shopping-bag.svg";
import wishlist_img from "../../assets/img/icons/cart-favourite.svg";
import { Link } from "react-router-dom";

export default function PharmacyHeader({ userData }) {
  return (
    <>
      <div className="cart-section">
        <Container>
          <Row className="align-items-center">
            <Col md="6">
              <div className="cart-logo">
                <Link to="/">
                  <img src={logo_img} className="img-fluid" alt="Logo" />
                </Link>
              </div>
            </Col>
            <Col md="6">
              <div className="top-header-right">
                <ul className="nav">
                  <li>
                    {userData ? (
                      <div className="btn log-register">
                        {/* <Link to="" className="me-1"> */}
                        <span>
                          <i className="fa fa-user"></i>
                        </span>{" "}
                        {userData?.email || userData?.name}
                        {/* </Link> */}
                      </div>
                    ) : (
                      <div className="btn log-register">
                        <Link to="/login" className="me-1">
                          <span>
                            <i className="fa fa-user"></i>
                          </span>{" "}
                          Sign In
                        </Link>{" "}
                        /
                        <Link to="/register" className="ms-1">
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
