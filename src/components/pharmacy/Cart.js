import React from "react";
import PharmacyTopBar from "./PharmacyTopBar";
import PharmacySearchBar from "./PharmacySearchBar";
import Breadcrumb from "../Breadcrumb";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import product_img from "../../assets/img/1.png";
import Footer from "../Footer";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  return (
    <>
      <PharmacyTopBar />
      <PharmacySearchBar />

      <PharmacyMenu />
      <Breadcrumb />
      <div class="content">
        <div class="container">
          <div class="card card-table">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th class="text-center">Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h2 class="table-avatar">
                          <a href="#" class="avatar avatar-sm me-2">
                            <img
                              class="avatar-img"
                              src={product_img}
                              alt="User Image"
                            />
                          </a>
                        </h2>
                        <a href="#">Benzaxapine Croplex</a>
                      </td>
                      <td>26565</td>
                      <td>19</td>
                      <td>
                        <div class="custom-increment cart">
                          <div class="input-group1">
                            <span class="input-group-btn">
                              <button
                                type="button"
                                class="quantity-left-minus btn btn-danger btn-number"
                                data-type="minus"
                                data-field
                              >
                                <span>
                                  <i class="fas fa-minus"></i>
                                </span>
                              </button>
                            </span>
                            <input
                              type="text"
                              id="quantity"
                              name="quantity"
                              class=" input-number"
                              value="10"
                            />
                            <span class="input-group-btn">
                              <button
                                type="button"
                                class="quantity-right-plus btn btn-success btn-number"
                                data-type="plus"
                                data-field
                              >
                                <span>
                                  <i class="fas fa-plus"></i>
                                </span>
                              </button>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>19</td>
                      <td>
                        <div class="table-action">
                          <a href="#" class="btn btn-sm bg-danger-light">
                            <i class="fas fa-times"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-7 col-lg-8"></div>
            <div class="col-md-5 col-lg-4">
              <div class="card booking-card">
                <div class="card-header">
                  <h4 class="card-title">Cart Total</h4>
                </div>
                <div class="card-body">
                  <div class="booking-summary">
                    <div class="booking-item-wrap">
                      <ul class="booking-date d-block pb-0">
                        <li>
                          Subtotal <span>5,877.00</span>
                        </li>
                        <li>
                          Shipping{" "}
                          <span>
                            25.00<a href="#">Calculate shipping</a>
                          </span>
                        </li>
                      </ul>
                      <ul class="booking-fee pt-4">
                        <li>
                          Tax <span>0.00</span>
                        </li>
                      </ul>
                      <div class="booking-total">
                        <ul class="booking-total-list">
                          <li>
                            <span>Total</span>
                            <span class="total-cost">160</span>
                          </li>
                          <li>
                            <div class="clinic-booking pt-4">
                              <a class="apt-btn" href="/Checkout">
                                Proceed to checkout
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
