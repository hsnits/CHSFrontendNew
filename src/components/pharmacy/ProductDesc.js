import React from "react";
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

export default function ProductDesc() {
  const userData = getLocalStorage(STORAGE.USER_KEY);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const key = searchParams.get("key");

  const { data, loading } = useGetMountData(`/admin/product/${productId}`);

  const getDiscountedPrice = (item) => {
    const discount = key=="Wholesale" ? item.sellerDiscount || 25 : item?.discount || 0;
    return (item.price - (item.price * discount || 0) / 100).toFixed(2);
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
      navigate(`/Cart${key=="Wholesale" ? "?key=Wholesale" : ""}`);
    }
  };

  const InfoSection = ({ title, content }) => (
    <Card className="mb-4">
      <Card.Body>
        <h4>{title}</h4>
        <p>{content}</p>
      </Card.Body>
    </Card>
  );

  const ProductDetails = () => (
    <Card className="mb-4">
      <Card.Body>
        <h4>Product Details</h4>
        <ListGroup variant="flush">
          <ListGroup.Item>SKU: {data?.SKUnumber}</ListGroup.Item>
          <ListGroup.Item>Pack Size: {data?.quantity} ml</ListGroup.Item>
          <ListGroup.Item>Stock Quantity: {data?.stockQuantity}</ListGroup.Item>
          <ListGroup.Item>Discount: {data?.discount || 0}%</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PharmacyHeader userData={userData} />
      <PharmacyMenu />
      <Breadcrumb />

      <Container className="py-5">
        {data && (
          <Row>
            {/* Product Image & Details */}
            <Col lg={9}>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    {/* Image Section */}
                    <Col md={5} className="text-center">
                      <Image
                        src={data?.image || product_img}
                        alt={data?.name}
                        fluid
                        style={{ maxHeight: "350px", objectFit: "cover" }}
                      />
                    </Col>

                    {/* Product Information */}
                    <Col md={7}>
                      <h2>{data?.name}</h2>
                      <p className="text-muted">By {data?.companyName}</p>
                      <p>{data?.shortDescription || data?.description}</p>

                      <div className="price-section">
                        <h3 className="text-success">
                          ₹ {getDiscountedPrice(data)}
                        </h3>
                        <p className="text-muted">
                          <del>₹ {data?.price}</del>
                          <span className="ms-2 badge bg-warning">
                            {key=="Wholesale" ? data.sellerDiscount || 25 : data?.discount}%
                            OFF
                          </span>
                        </p>
                      </div>

                      <Button
                        onClick={() => handleAddToCart(data)}
                        className="btn btn-primary mt-3"
                      >
                        🛒 Add to Cart
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Product Description */}
              <InfoSection title="Description" content={data?.description} />
              <InfoSection
                title="Directions for Use"
                content="Adults: Take 2 tablespoons once a day in a glass full of water."
              />
              <InfoSection
                title="Storage"
                content="Store at room temperature protected from sunlight, heat, and moisture. Keep away from children and pets."
              />
              <InfoSection
                title="Administration Instructions"
                content="Shake the bottle before use. Can be taken with or without food."
              />
              <InfoSection
                title="Warning"
                content="Not recommended for pregnant or lactating women."
              />
              <InfoSection
                title="Precaution"
                content="Dispose of properly after 3 years from manufacturing date."
              />
            </Col>

            {/* Sidebar */}
            <Col lg={3}>
              <ProductDetails />

              <Card className="mb-4">
                <Card.Body>
                  <h4>Benefits</h4>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <i className="fas fa-shipping-fast me-2"></i> Free
                      Shipping
                      <br />
                      <small>For orders above ₹50</small>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="far fa-question-circle me-2"></i> 24/7
                      Support
                      <br />
                      <small>Call us anytime</small>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-hands me-2"></i> 100% Secure Payments
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="fas fa-tag me-2"></i> Hot Offers
                      <br />
                      <small>Discounts up to 90%</small>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Footer />
    </>
  );
}
