import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { PharmacyProduct } from "../../Data";
import { ShoppingBag } from "react-feather";
import { Link } from "react-router-dom";
import "../../Data";
import browsecategory_icon from "../../assets/img/icons/browse-categorie.svg";
import NotFound from "../common/notFound";
import { allCategories } from "../../constants/common";
import { TruncatedText } from "../../helpers/utils";

export default function FeaturedProduct({ loading, data, query, setQuery }) {
  const handleCategoryChange = (e) => {
    setQuery((pre) => ({ ...pre, category: e.target.value }));
  };
  return (
    <>
      <section className="section products-sec">
        <Container>
          <div className="pharmacy-section-header">
            <Row className="align-items-center">
              <Col md="6">
                <div className="pharmacy-title">
                  <h4>Featured Products</h4>
                </div>
              </Col>
              <Col md="6">
                <div className="pharmacy-title-link">
                  <div className="browse-categorie">
                    <div className="dropdown categorie-dropdown">
                      {/* Category Filter Dropdown */}
                      {/* <img src={browsecategory_icon} alt="Img" />  */}
                      <select
                        className="form-select"
                        value={query?.category}
                        onChange={handleCategoryChange}
                      >
                        {allCategories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {/* <div className="dropdown-menu">
                        <a className="dropdown-item" href="javascript:void(0);">
                          Ayush
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Covid Essentials
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Devices
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Glucometers
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row className="justify-content-center">
            <NotFound
              loading={loading}
              isData={data?.length > 0}
              message={"No Products found."}
            />
            {!loading &&
              data?.length > 0 &&
              data?.map((item, index) => (
                <Col lg="3" md="4" key={index}>
                  <div className="products-card">
                    <div className="product-card-img">
                      <Link to="/ProductDesc">
                        <img src={item.image} alt={item.name} />
                      </Link>
                    </div>
                    <div className="product-content">
                      <h6>{item.companyName}</h6>
                      <h4>
                        <Link to="/ProductDesc">
                          {TruncatedText(item.name)}
                        </Link>
                      </h4>
                      <span className="badge">{`${item.quantity} ml`}</span>
                      <div className="product-cart">
                        <div className="cart-price">
                          <div className="d-flex align-items-center">
                            <h5 className="mb-0">
                              Rs{" "}
                              {(
                                item.price -
                                item.price * (item.discount / 100)
                              ).toFixed(2)}
                            </h5>
                            <h6 className="badge bg-success px-2 py-1 ms-2">
                              {item?.discount}% OFF
                            </h6>
                          </div>
                          <h5>
                            <span>MRP {`${item.price}`} </span>
                          </h5>
                        </div>
                        <Link to="/ProductDesc" className="cart-icon">
                          <ShoppingBag />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
