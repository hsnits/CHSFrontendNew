import React from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import PharmacyHeader from "./PharmacyHeader";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import Breadcrumb from "../Breadcrumb";
import Footer from "../Footer";
import product_img from "../../assets/img/1.png";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import { callDeleteApi, callPutApi } from "../../_service";

const Cart = () => {
  const navigate = useNavigate();
  const userData = getLocalStorage(STORAGE.USER_KEY);
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  const { data, loading, getAllData } = useGetMountData(
    `/user/cart/${userData?._id}`
  );

  const getDiscountedPrice = (item) => {
    const discount =
      key == "Wholesale" ? item?.sellerDiscount || 25 : item?.discount || 0;
    return (item.price - (item.price * discount || 0) / 100).toFixed(2);
  };

  const updateQuantity = async (newQuantity, product) => {
    if (newQuantity < 1 || newQuantity > product?.stockQuantity) return;

    try {
      const response = await callPutApi(
        `/user/cart/${userData?._id}/${product?._id}`,
        { quantity: newQuantity }
      );
      if (!response.status) throw new Error(response.message);

      getAllData(`/user/cart/${userData?._id}`);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleIncrease = (item) => {
    if (item?.quantity < item?.productId?.stockQuantity) {
      updateQuantity(item?.quantity + 1, item?.productId);
    }
  };

  const handleDecrease = (item) => {
    if (item?.quantity > 1) {
      updateQuantity(item?.quantity - 1, item?.productId);
    }
  };

  const handleInputChange = (e, item) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > item?.productId?.stockQuantity)
      value = item?.productId?.stockQuantity;

    updateQuantity(value, item?.productId);
  };

  const calculateTotal = () => {
    if (!data?.items)
      return { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 };

    const subtotal = data.items.reduce(
      (acc, it) => acc + it?.quantity * it?.productId?.price,
      0
    );

    const discount = data.items.reduce((acc, it) => {
      const discountPrice =
        it?.quantity *
        (it?.productId?.price - getDiscountedPrice(it?.productId));
      return acc + discountPrice || 0;
    }, 0);

    const tax = (subtotal - discount || 0) * 0.1;
    // 10% Tax
    const shipping = 50;
    // Fixed shipping charge

    let discountPrice = subtotal - discount;

    let total = subtotal - discount || 0;
    total = total + tax + shipping;

    return { subtotal, discount, tax, shipping, total, discountPrice };
  };

  const totals = calculateTotal();

  return (
    <>
      <style jsx>{`
        .cart-item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cart-product-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }

        .cart-item-details {
          flex: 1;
        }

        .cart-item-name {
          font-weight: 500;
          font-size: 14px;
          color: #2c3e50;
          line-height: 1.4;
        }

        .table th {
          background-color: #f8f9fa;
          border-top: none;
          font-weight: 600;
          color: #495057;
          padding: 12px 8px;
          vertical-align: middle;
        }

        .table td {
          padding: 12px 8px;
          vertical-align: middle;
          border-top: 1px solid #dee2e6;
        }

        .table-responsive {
          border-radius: 8px;
          overflow: hidden;
        }

        .card {
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
        }

        .card-header {
          background-color: #fff;
          border-bottom: 1px solid #e9ecef;
          padding: 16px 20px;
        }

        .card-body {
          padding: 20px;
        }

        .checkout-btn {
          background: linear-gradient(45deg, #007bff, #0056b3);
          border: none;
          padding: 12px 24px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .checkout-btn:hover {
          background: linear-gradient(45deg, #0056b3, #003d82);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }
      `}</style>

      <PharmacyHeader userData={userData} />
      <PharmacyMenu />
      <Breadcrumb />

      <Container className="my-5">
        <Row>
          <Col sm={12}>
            <Card>
              <Card.Header>
                <h4>Shopping Cart</h4>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.items?.length > 0 ? (
                      data?.items?.map((item) => (
                        <CartItem
                          key={item._id}
                          item={item}
                          loading={loading}
                          onIncrease={handleIncrease}
                          onDecrease={handleDecrease}
                          onChange={handleInputChange}
                          getDiscountedPrice={getDiscountedPrice}
                          userData={userData}
                          callRefresh={() =>
                            getAllData(`/user/cart/${userData?._id}`)
                          }
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No items in the cart
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}></Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h4>Cart Summary</h4>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  <li className="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <strong>₹ {totals.subtotal.toFixed(2)}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Discount:</span>
                    <strong>- ₹ {totals?.discount?.toFixed(2) || 0}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Discount Price:</span>
                    <strong>₹ {totals?.discountPrice?.toFixed(2)}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Tax (10%):</span>
                    <strong>₹ {totals?.tax?.toFixed(2)}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Shipping:</span>
                    <strong>₹ {totals?.shipping?.toFixed(2)}</strong>
                  </li>
                  <hr />
                  <li className="d-flex justify-content-between">
                    <span>Total:</span>
                    <strong>₹ {totals?.total?.toFixed(2)}</strong>
                  </li>
                </ul>

                <Button
                  variant="primary"
                  className="checkout-btn w-100"
                  // href="/Checkout"
                  onClick={() =>
                    navigate(
                      `/Checkout${key == "Wholesale" ? "?key=Wholesale" : ""}`
                    )
                  }
                  disabled={data?.items?.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

// ✅ Extracted CartItem Component

const CartItem = ({
  item,
  loading,
  onIncrease,
  onDecrease,
  onChange,
  getDiscountedPrice,
  userData,
  callRefresh,
}) => {
  const handleRemove = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (!confirmDelete) return;

    try {
      const updateRes = await callDeleteApi(
        `/user/cart/${userData?._id}/${id}`
      );
      if (updateRes?.status) {
        callRefresh();
        console.log("Item removed from cart");
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <tr>
      <td className="text-primary ms-2">
        <div className="d-flex align-items-center">
          <div className="cart-item-image">
            <Image
              src={item?.productId?.image || product_img}
              alt={item?.productId?.name}
              className="cart-product-img"
            />
          </div>
          <div className="cart-item-details ms-3">
            <span className="cart-item-name">{item?.productId?.name}</span>
          </div>
        </div>
      </td>
      <td>{item?.productId?.SKUnumber}</td>
      <td>₹ {getDiscountedPrice(item?.productId)}</td>
      <td>
        <div className="d-flex align-items-center justify-content-center">
          <Button
            variant="outline-danger"
            size="sm"
            disabled={loading || item?.quantity <= 1}
            onClick={() => onDecrease(item)}
          >
            −
          </Button>
          <input
            type="number"
            className="form-control mx-2 text-center"
            style={{ width: "60px" }}
            value={item?.quantity}
            onChange={(e) => onChange(e, item)}
            min="1"
            max={item?.productId?.stockQuantity}
            disabled={loading}
          />
          <Button
            variant="outline-success"
            size="sm"
            disabled={
              loading || item?.quantity >= item?.productId?.stockQuantity
            }
            onClick={() => onIncrease(item)}
          >
            +
          </Button>
        </div>
      </td>
      <td className="text-center">
        ₹ {(getDiscountedPrice(item?.productId) * item?.quantity).toFixed(2)}
      </td>
      <td className="text-center">
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleRemove(item?.productId?._id)}
        >
          <i className="fas fa-times"></i>
        </Button>
      </td>
    </tr>
  );
};

export default Cart;
