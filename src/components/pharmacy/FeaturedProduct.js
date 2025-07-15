import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NotFound from "../common/notFound";
import { allCategories } from "../../constants/common";
import { TruncatedText } from "../../helpers/utils";
import "./FeaturedProduct.css"; // Custom CSS file
import { toastMessage } from "../../config/toast";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { callPostApi } from "../../_service";

export default function FeaturedProduct({
  loading,
  data,
  query,
  setQuery,
  isWholesaler,
}) {
  const navigate = useNavigate();
  const userData = getLocalStorage(STORAGE.USER_KEY);

  const handleCategoryChange = (e) => {
    setQuery((prev) => ({ ...prev, category: e.target.value }));
  };

  const getDiscountedPrice = (item, subscriptionDiscount = 0) => {
    const productDiscount = isWholesaler
      ? item.sellerDiscount || 25
      : item?.discount || 0;
    
    // For regular customers, add subscription discount to product discount
    // For wholesalers, use only seller discount
    const totalDiscount = isWholesaler 
      ? productDiscount 
      : Math.min(productDiscount + subscriptionDiscount, 50); // Cap at 50%

    return (item.price - (item.price * totalDiscount || 0) / 100).toFixed(2);
  };

  const handleAddToCart = async (item) => {
    if (!userData) {
      toastMessage("error", "login your account for add to cart");
      navigate("/login");
      return;
    }
    const response = await callPostApi(`/user/cart/${userData?._id}`, {
      productId: item?._id,
      quantity: 1,
    });
    if (response?.status) {
      navigate(`/Cart${isWholesaler ? "?key=Wholesale" : ""}`);
    }
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
            <Col xs="12" md="6"   >
              <div className="pharmacy-title-link text-md-end text-start mt-2 mt-md-0">
                <select
                  className="form-select custom-select"
                  value={query?.category}
                  onChange={handleCategoryChange}
                >
                  {allCategories.map((category, index) => (
                    <option
                      key={index}
                      value={category === "Select Category" ? "" : category}
                    >
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
            data.map((item, index) => (
              <Col
                xl="3"
                lg="4"
                md="4"
                sm="6"
                xs="10"
                key={index}
                className="mb-4"
              >
                <div className="products-card">
                  <div className="product-card-img">
                    <Link
                      to={`/ProductDesc?id=${item?._id}${
                        isWholesaler ? "&key=Wholesale" : ""
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="product-content text-center">
                    <h6 className="company-name">{item.companyName}</h6>

                    <h4 className="product-name">
                      <Link
                        to={`/ProductDesc?id=${item?._id}${
                          isWholesaler ? "&key=Wholesale" : ""
                        }`}
                      >
                        {TruncatedText(item.name)}
                      </Link>
                    </h4>

                    <div className="product-details">
                      <span className="badge product-quantity">{`${item.quantity} ml`}</span>

                      <div className="product-cart">
                        <div className="cart-price d-flex flex-column align-items-center">
                          <h5 className="price">
                            Rs {getDiscountedPrice(item)}
                          </h5>

                          <div className="discount-section">
                            <span className="discount-badge">
                              {isWholesaler
                                ? item?.sellerDiscount || 25
                                : item?.discount || 0}
                              % OFF
                            </span>
                            <h5 className="text-muted original-price">
                              <span>MRP: ₹{item.price}</span>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="clinic-details mt-3 ">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="btn btn-cart bg-blue text-white"
                      >
                        🛒 Add to Cart
                      </Button>
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
