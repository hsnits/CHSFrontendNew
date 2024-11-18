import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import {PharmacyProduct} from "../../Data";
import { ShoppingBag} from 'react-feather';
import { Link } from "react-router-dom";
import '../../Data';
import Footer from "../Footer";

export default function FeaturedProduct()
{
    return(
        <>
        <section className="section products-sec">
                <Container>
                    <div className="pharmacy-section-header">
                        <Row className="align-items-center">
                            <Col md='6'>
                                <div className="pharmacy-title">
                                    <h4>Featured Products</h4>
                                </div>
                            </Col>
                            <Col md='6'>
                                <div className="pharmacy-title-link">
                                    <Link to="/ProductDesc">See All <i className="fa-solid fa-arrow-right"></i></Link>
                                </div>
                           </Col>
                        </Row>
                    </div>
                    <Row className="justify-content-center">
                        {PharmacyProduct.map((item, index)=>
                        (
                        <Col lg='3' md='4' key={index}>
                            <div className="products-card">
                                <div className="product-card-img">
                                <Link to="/ProductDesc"><img src={item.img} alt={item.product_name}/></Link>
                                </div>
                                <div className="product-content">
                                    <h6>{item.product_cat}</h6>
                                    <h4><Link to="/ProductDesc">{item.product_name}</Link></h4>
                                    <span className="badge">{item.quantity}</span>
                                    <div className="product-cart">
                                        <div className="cart-price">
                                            <h5>{item.price}<span>{item.discount_price}</span></h5>
                                        </div>
                                        <Link to="/ProductDesc" className="cart-icon">
                                        <ShoppingBag />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                         )
                         )}
                    </Row>
                </Container>
            </section>
        </>
    );
}