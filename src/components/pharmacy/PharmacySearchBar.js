import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { MapPin, Search } from "react-feather";
import logo_img from '../../assets/img/chs_logo.png';
import cart_img from '../../assets/img/icons/shopping-bag.svg';
import wishlist_img from '../../assets/img/icons/cart-favourite.svg';
import { Link } from "react-router-dom";

export default function PharmacySearchBar() {
  return (
    <>
      <div className="cart-section">
        <Container>
          <Row className="align-items-center">
            <Col md='3'>
              <div className="cart-logo">
                <Link to="/">
                  <img src={logo_img} className="img-fluid" alt="Logo"/>
                </Link>
              </div>
            </Col>
            <Col md='6'>
              <div className="cart-search">
               <Form>
                  <div className="d-flex enter-pincode">
                   <MapPin/>
                    <div className="enter-pincode-input">
                    <Form.Control type="text" placeholder="Enter Pincode" />
                    </div>
                  </div>
                  <div className="cart-search-input">
                    <input type="text" className="form-control" placeholder="Search for medicines, health products and more"/>
                  </div>
                  <div className="cart-search-btn">
                    <button type="submit" className="btn">
                     <Search/>
                    </button>
                  </div>
                </Form>
              </div>
            </Col>
            <Col md='3'>
              <div className="shopping-cart-list">
                <ul className="nav">
                  <li>
                    <Link href="#">
                      <img src={wishlist_img} alt="Img"/>
                    </Link>
                  </li>
                  <li>
                    <div className="shopping-cart-amount">
                      <div className="shopping-cart-icon">
                        <img src={cart_img} alt="Img"/>
                          <span>2</span>
                      </div>
                      <div className="shopping-cart-content">
                        <p>Shopping cart</p>
                        <h6>57.00</h6>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

    </>
  )
}