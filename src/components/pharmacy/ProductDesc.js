import React, { useState } from "react";
import "../../pages/pharmacy/Pharmacy.css";
import Breadcrumb from "../Breadcrumb";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Image,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import Footer from "../Footer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";
import PharmacyHeader from "./PharmacyHeader";
import useGetMountData from "../../helpers/getDataHook";
import product_img from "../../assets/img/1.png";
import { toastMessage } from "../../config/toast";
import { callPostApi } from "../../_service";
import { TruncatedText } from "../../helpers/utils";

export default function ProductDesc() {
  const userData = getLocalStorage(STORAGE.USER_KEY);
  const [addingToCart, setAddingToCart] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const key = searchParams.get("key");
  const isWholesale = key === "Wholesale";

  const { data, loading } = useGetMountData(`/admin/product/${productId}`);

  // Fetch related products from the same category
  const { data: relatedProducts, loading: relatedLoading } = useGetMountData(
    data?.category ? `/admin/products-for-user?category=${encodeURIComponent(data.category)}&limit=4` : null
  );

  const getDiscountedPrice = (item) => {
    const discount = isWholesale ? item.sellerDiscount || 25 : item?.discount || 0;
    return (item.price - (item.price * discount || 0) / 100).toFixed(2);
  };

  const getSavings = (item) => {
    const discount = isWholesale ? item.sellerDiscount || 25 : item?.discount || 0;
    return (item.price * discount / 100).toFixed(2);
  };

  const handleAddToCart = async (item) => {
    if (!userData) {
      toastMessage("error", "Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    setAddingToCart(true);
    try {
      const response = await callPostApi(`/user/cart/${userData?._id}`, {
        productId: item?._id,
        quantity: 1,
      });
      if (response?.status) {
        toastMessage("success", "Product added to cart successfully!");
        navigate(`/Cart${isWholesale ? "?key=Wholesale" : ""}`);
      } else {
        toastMessage("error", response?.message || "Failed to add product to cart");
      }
    } catch (error) {
      toastMessage("error", "Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const ProductInfo = () => (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h4 className="text-primary mb-3">
          <i className="fas fa-info-circle me-2"></i>
          Product Information
        </h4>
        <Row>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item className="border-0 px-0">
                <strong>Brand:</strong>
                <span className="ms-2">{data?.companyName || "N/A"}</span>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <strong>Pack Size:</strong>
                <span className="ms-2">{data?.quantity ? `${data.quantity} ml` : "N/A"}</span>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 px-0">
                <strong>Category:</strong>
                <span className="ms-2">{data?.category || "N/A"}</span>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              {data?.subcategory && (
                <ListGroup.Item className="border-0 px-0">
                  <strong>Type:</strong>
                  <span className="ms-2">{data.subcategory}</span>
                </ListGroup.Item>
              )}
              {data?.country && (
                <ListGroup.Item className="border-0 px-0">
                  <strong>Made in:</strong>
                  <span className="ms-2">{data.country}</span>
                </ListGroup.Item>
              )}
              <ListGroup.Item className="border-0 px-0">
                <strong>Availability:</strong>
                <Badge bg={data?.stockQuantity > 0 ? "success" : "danger"} className="ms-2">
                  {data?.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const OfferSection = () => {
    const discount = isWholesale ? data?.sellerDiscount || 25 : data?.discount || 0;
    const savings = getSavings(data);
    
    if (discount <= 0) return null;

    return (
      <Card className="mb-4 bg-light border-warning">
        <Card.Body>
          <h5 className="text-warning mb-3">
            <i className="fas fa-tags me-2"></i>
            Special Offer
          </h5>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="warning" className="me-2 fs-6">
                {discount}% OFF
              </Badge>
              {isWholesale && (
                <Badge bg="info" className="me-2">
                  Wholesale Price
                </Badge>
              )}
              <span className="text-muted">
                Save ₹{savings} on this product
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const RelatedProducts = () => {
    // Filter out the current product and limit to 3 related products
    const filteredRelated = relatedProducts?.filter(item => item._id !== productId)?.slice(0, 3);
    
    if (!filteredRelated || filteredRelated.length === 0) return null;

    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-primary mb-3">
            <i className="fas fa-heart me-2"></i>
            You might also like
          </h4>
          <Row>
            {filteredRelated.map((product, index) => (
              <Col md={12} key={product._id} className="mb-3">
                <div className="d-flex align-items-center p-2 border rounded">
                  <Image 
                    src={product.image || product_img} 
                    alt={product.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    className="rounded me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      <Link 
                        to={`/ProductDesc?id=${product._id}${isWholesale ? "&key=Wholesale" : ""}`}
                        className="text-decoration-none"
                      >
                        {TruncatedText(product.name, 25)}
                      </Link>
                    </h6>
                    <small className="text-muted">{product.companyName}</small>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span className="fw-bold text-success">₹{getDiscountedPrice(product)}</span>
                      {(isWholesale ? product.sellerDiscount || 25 : product.discount || 0) > 0 && (
                        <Badge bg="warning" className="ms-2">
                          {isWholesale ? product.sellerDiscount || 25 : product.discount || 0}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate(`/pharmacy?category=${encodeURIComponent(data?.category)}${isWholesale ? "&key=Wholesale" : ""}`)}
            >
              View All {data?.category} Products
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const ServicesSection = () => (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h4 className="text-primary mb-3">
          <i className="fas fa-shield-alt me-2"></i>
          Our Services
        </h4>
        <ListGroup variant="flush">
          <ListGroup.Item className="border-0 px-0">
            <i className="fas fa-truck me-3 text-info"></i>
            <div className="d-inline-block">
              <strong>Fast Delivery</strong>
              <br />
              <small className="text-muted">Quick and reliable shipping to your doorstep</small>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="border-0 px-0">
            <i className="fas fa-shield-check me-3 text-success"></i>
            <div className="d-inline-block">
              <strong>Quality Assured</strong>
              <br />
              <small className="text-muted">100% authentic and genuine products only</small>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="border-0 px-0">
            <i className="fas fa-lock me-3 text-warning"></i>
            <div className="d-inline-block">
              <strong>Secure Payments</strong>
              <br />
              <small className="text-muted">Safe and encrypted payment transactions</small>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="border-0 px-0">
            <i className="fas fa-headset me-3 text-primary"></i>
            <div className="d-inline-block">
              <strong>Customer Support</strong>
              <br />
              <small className="text-muted">Professional support when you need it</small>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <>
        <PharmacyHeader userData={userData} />
        <PharmacyMenu />
        <Breadcrumb />
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <PharmacyHeader userData={userData} />
        <PharmacyMenu />
        <Breadcrumb />
        <Container className="py-5">
          <Alert variant="warning" className="text-center">
            <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
            <h4>Product Not Found</h4>
            <p>The product you're looking for doesn't exist or may have been removed.</p>
            <Button variant="primary" onClick={() => navigate("/pharmacy")}>
              Continue Shopping
            </Button>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PharmacyHeader userData={userData} />
      <PharmacyMenu />
      <Breadcrumb />

      <Container className="py-5">
        <Row>
          {/* Product Image & Details */}
          <Col lg={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Row>
                  {/* Image Section */}
                  <Col md={5} className="text-center">
                    <div className="position-relative">
                      <Image
                        src={data?.image || product_img}
                        alt={data?.name}
                        fluid
                        style={{ 
                          maxHeight: "400px", 
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #dee2e6"
                        }}
                      />
                      {isWholesale && (
                        <Badge 
                          bg="info" 
                          className="position-absolute top-0 start-0 m-2"
                        >
                          Wholesale
                        </Badge>
                      )}
                    </div>
                  </Col>

                  {/* Product Information */}
                  <Col md={7}>
                    <div className="mb-3">
                      <h1 className="h3 mb-2">{data?.name}</h1>
                      <p className="text-muted mb-3">
                        <i className="fas fa-building me-2"></i>
                        by <strong>{data?.companyName || "N/A"}</strong>
                      </p>
                    </div>

                    {data?.stockQuantity <= 0 && (
                      <Alert variant="danger" className="py-2 mb-3">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        This product is currently out of stock
                      </Alert>
                    )}

                    <div className="price-section mb-4 p-3 bg-light rounded">
                      <div className="d-flex align-items-baseline gap-3 mb-2">
                        <h2 className="text-success mb-0">
                          ₹{getDiscountedPrice(data)}
                        </h2>
                        <span className="text-muted text-decoration-line-through h5">
                          ₹{data?.price}
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        {(isWholesale ? data?.sellerDiscount || 25 : data?.discount || 0) > 0 && (
                          <>
                            <Badge bg="danger" className="fs-6">
                              {isWholesale ? data?.sellerDiscount || 25 : data?.discount || 0}% OFF
                            </Badge>
                            <span className="text-success fw-bold">
                              You save ₹{getSavings(data)}
                            </span>
                          </>
                        )}
                        {isWholesale && (
                          <Badge bg="info">Wholesale Price</Badge>
                        )}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <Button
                        onClick={() => handleAddToCart(data)}
                        className="btn btn-primary"
                        disabled={addingToCart || data?.stockQuantity <= 0}
                        size="lg"
                      >
                        {addingToCart ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding to Cart...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shopping-cart me-2"></i>
                            {data?.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate(`/Cart${isWholesale ? "?key=Wholesale" : ""}`)}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Cart
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Product Description */}
            {data?.description && (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <h4 className="text-primary mb-3">
                    <i className="fas fa-file-alt me-2"></i>
                    Product Description
                  </h4>
                  <p className="mb-0 lh-lg">{data.description}</p>
                </Card.Body>
              </Card>
            )}

            {/* Product Information */}
            <ProductInfo />

            {/* Special Offers */}
            <OfferSection />
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <ServicesSection />
            
            {/* Related Products */}
            <RelatedProducts />
            
            {/* Need Help Section */}
            <Card className="mb-4 shadow-sm border-primary">
              <Card.Body className="text-center">
                <h5 className="text-primary mb-3">
                  <i className="fas fa-question-circle me-2"></i>
                  Need Help?
                </h5>
                <p className="text-muted mb-3">
                  Have questions about this product? Our team is here to help!
                </p>
                <Button variant="outline-primary" size="sm">
                  <i className="fas fa-phone me-2"></i>
                  Contact Support
                </Button>
              </Card.Body>
            </Card>

            {/* Continue Shopping */}
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <h5 className="mb-3">Continue Shopping</h5>
                <p className="text-muted mb-3">
                  Explore more products in our pharmacy
                </p>
                <Button 
                  variant="success" 
                  onClick={() => navigate(`/pharmacy${isWholesale ? "?key=Wholesale" : ""}`)}
                >
                  <i className="fas fa-store me-2"></i>
                  Browse Products
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}
