import React, { useState } from "react";
import { Button, Col, Container, Row, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NotFound from "../common/notFound";
import { allCategories } from "../../constants/common";
import { TruncatedText } from "../../helpers/utils";
import "./FeaturedProduct.css"; // Custom CSS file
import { toastMessage } from "../../config/toast";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { callPostApi } from "../../_service";
import CustomPagination from "../common/custom-pagination";

export default function FeaturedProduct({
  loading,
  data,
  query,
  setQuery,
  isWholesaler,
  dataLength,
  currentPage,
  setCurrentPage,
  pageLimit,
  mergedCategories = {},
  allCategoryNames = [],
  hasMergedCategories = false,
}) {
  const navigate = useNavigate();
  const userData = getLocalStorage(STORAGE.USER_KEY);
  const [loadingStates, setLoadingStates] = useState({});

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

  const getDiscountPercentage = (item) => {
    return isWholesaler ? item?.sellerDiscount || 25 : item?.discount || 0;
  };

  const getSavings = (item) => {
    const discount = getDiscountPercentage(item);
    return (item.price * discount / 100).toFixed(2);
  };

  const handleAddToCart = async (item) => {
    if (!userData) {
      toastMessage("error", "Please login to add items to cart");
      navigate("/login");
      return;
    }

    setLoadingStates(prev => ({ ...prev, [item._id]: true }));
    
    try {
      const response = await callPostApi(`/user/cart/${userData?._id}`, {
        productId: item?._id,
        quantity: 1,
      });
      
      if (response?.status) {
        toastMessage("success", "Product added to cart!");
        navigate(`/Cart${isWholesaler ? "?key=Wholesale" : ""}`);
      } else {
        toastMessage("error", response?.message || "Failed to add to cart");
      }
    } catch (error) {
      toastMessage("error", "Failed to add to cart");
    } finally {
      setLoadingStates(prev => ({ ...prev, [item._id]: false }));
    }
  };

  // Get categories for dropdown - use merged categories if available, otherwise fallback to static
  const getCategoriesForDropdown = () => {
    if (hasMergedCategories && allCategoryNames.length > 0) {
      return ["Select Category", ...allCategoryNames];
    }
    return allCategories;
  };

  const dropdownCategories = getCategoriesForDropdown();

  return (
    <section className="section products-sec">
      <Container>
        {/* Enhanced Header Section */}
        <div className="pharmacy-section-header">
          <Row className="align-items-center">
            <Col xs="12" md="8">
              <div className="pharmacy-title">
                <h2 className="section-title">
                  <i className="fas fa-star text-warning me-2"></i>
                  Featured Products
                  <Badge bg="info" className="ms-2 fs-6">
                    {dataLength} Products
                  </Badge>
                </h2>
                <p className="section-subtitle">Discover our most popular and trusted products</p>
              </div>
            </Col>
            <Col xs="12" md="4">
              <div className="filter-section">
                <label className="filter-label">Filter by Category</label>
                <select
                  className="form-select custom-select"
                  value={query?.category}
                  onChange={handleCategoryChange}
                >
                  {dropdownCategories.map((category, index) => (
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

        {/* Enhanced Products Grid */}
        <div className="products-container">
          <NotFound
            loading={loading}
            isData={data?.length > 0}
            message={"No Products found. Try adjusting your filters."}
          />
          
          {loading && (
            <div className="products-loading">
              <Row>
                {[...Array(8)].map((_, index) => (
                  <Col key={index} xl={3} lg={4} md={6} sm={6} className="mb-4">
                    <div className="product-skeleton">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-line short"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line medium"></div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {!loading && data?.length > 0 && (
            <Row className="products-grid">
              {data.map((item, index) => (
                <Col key={item._id || index} xl={3} lg={4} md={6} sm={6} className="mb-4">
                  <div className="enhanced-product-card">
                    {/* Discount Badge */}
                    {getDiscountPercentage(item) > 0 && (
                      <div className="discount-badge-corner">
                        <span>{getDiscountPercentage(item)}% OFF</span>
                      </div>
                    )}

                    {/* Wholesale Badge */}
                    {isWholesaler && (
                      <div className="wholesale-badge">
                        <i className="fas fa-crown me-1"></i>
                        Wholesale
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="stock-indicator">
                      <span className={`stock-dot ${item.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}></span>
                      {item.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>

                    {/* Product Image */}
                    <div className="enhanced-product-image">
                      <Link
                        to={`/ProductDesc?id=${item._id}${
                          isWholesaler ? "&key=Wholesale" : ""
                        }`}
                      >
                        <img
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="product-img"
                          loading="lazy"
                        />
                      </Link>
                      
                      {/* Quick View Button */}
                      <div className="quick-actions">
                        <Button
                          variant="outline-light"
                          size="sm"
                          className="quick-view-btn"
                          onClick={() => navigate(`/ProductDesc?id=${item._id}${isWholesaler ? "&key=Wholesale" : ""}`)}
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="enhanced-product-content">
                      {/* Company & Quantity */}
                      <div className="product-meta">
                        <span className="company-badge">{item.companyName}</span>
                        {item.quantity && (
                          <span className="quantity-badge">{item.quantity} {item.unit?.name}</span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3 className="enhanced-product-name">
                        <Link
                          to={`/ProductDesc?id=${item._id}${
                            isWholesaler ? "&key=Wholesale" : ""
                          }`}
                          className="product-link"
                        >
                          {TruncatedText(item.name, 50)}
                        </Link>
                      </h3>

                      {/* Pricing Section */}
                      <div className="enhanced-pricing">
                        <div className="price-main">
                          <span className="current-price">₹{getDiscountedPrice(item)}</span>
                          {getDiscountPercentage(item) > 0 && (
                            <span className="original-price">₹{item.price}</span>
                          )}
                        </div>
                        
                        {getDiscountPercentage(item) > 0 && (
                          <div className="savings-info">
                            <span className="savings-text">
                              <i className="fas fa-tag me-1"></i>
                              Save ₹{getSavings(item)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <div className="cart-actions">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={loadingStates[item._id] || item.stockQuantity <= 0}
                          className="enhanced-cart-btn"
                          variant={item.stockQuantity > 0 ? "primary" : "secondary"}
                        >
                          {loadingStates[item._id] ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-shopping-cart me-2"></i>
                              {item.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Enhanced Pagination */}
        {!loading && dataLength > pageLimit && (
          <div className="enhanced-pagination">
            <CustomPagination
              totalPages={Math.ceil(dataLength / pageLimit)}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Container>
    </section>
  );
}
