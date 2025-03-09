import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import NotFound from "../common/notFound";
import { allCategories } from "../../constants/common";
import { TruncatedText } from "../../helpers/utils";

export default function FeaturedProduct({ loading, data, query, setQuery }) {
  const handleCategoryChange = (e) => {
    setQuery((prev) => ({ ...prev, category: e.target.value }));
  };

  return (
    <section className="section products-sec">
      <Container>
        <div className="pharmacy-section-header">
          <Row className="align-items-center">
            <Col xs="12" md="6">
              <div className="pharmacy-title">
                <h4>Featured Products</h4>
              </div>
            </Col>
            <Col xs="12" md="6">
              <div className="pharmacy-title-link text-md-end text-start mt-2 mt-md-0">
                <select
                  className="form-select w-50 w-md-auto"
                  value={query?.category}
                  onChange={handleCategoryChange}
                >
                  {allCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
              <Col lg="3" md="4" sm="6" xs="6" key={index} className="mb-4">
                <div className="products-card">
                  <div className="product-card-img">
                    <Link to="/ProductDesc">
                      <img src={item.image} alt={item.name} className="img-fluid" />
                    </Link>
                  </div>
                  <div className="product-content text-center">
                    <h6>{item.companyName}</h6>
                    <h4>
                      <Link to="/ProductDesc">
                        {TruncatedText(item.name)}
                      </Link>
                    </h4>
                    <span className="badge">{`${item.quantity} ml`}</span>
                    <div className="product-cart">
                      <div className="cart-price d-flex flex-column align-items-center">
                        <h5 className="mb-1">
                          Rs{" "}
                          {(
                            item.price -
                            item.price * (item.discount / 100)
                          ).toFixed(2)}
                        </h5>
                        <h6 className="badge bg-success px-2 py-1">
                          {item?.discount}% OFF
                        </h6>
                        <h5 className="text-muted">
                          <span>MRP {`${item.price}`} </span>
                        </h5>
                      </div>
                    </div>
                    <div className="clinic-details mt-3">
                      <Link to="/Cart" className="btn btn-primary w-100">
                        Add To Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  );
}
