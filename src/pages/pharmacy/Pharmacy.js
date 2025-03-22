import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { PharmacyBanner } from "../../Data";
import BrowseCategory from "../../components/BrowseCategory";
import Footer from "../../components/Footer";
import PharmacyTopBar from "../../components/pharmacy/PharmacyTopBar";
import PharmacySearchBar from "../../components/pharmacy/PharmacySearchBar";
import PharmacyMenu from "./PharmacyMenu";
import PharmacySlider from "../../components/pharmacy/PharmacySlider";
import FeaturedProduct from "../../components/pharmacy/FeaturedProduct";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";

export default function Pharmacy() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  const userData = getLocalStorage(STORAGE.USER_KEY);

  const { data, loading, getAllData, query, setQuery } =
    useGetMountData(`/admin/products`);

  return (
    <>
      <PharmacyTopBar userData={userData} />
      <PharmacySearchBar />
      <PharmacyMenu />
      <PharmacySlider />

      <section className="section welcome-section">
        <Container>
          <Row className="justify-content-center">
            {PharmacyBanner.map((item, index) => (
              <Col lg="4" md="6" className="d-flex" key={index}>
                <div className="shop-card suppliment-card">
                  <Row className="align-items-center">
                    <Col md="7">
                      <div className="shop-content">
                        <h5>
                          {item.heading} <span>Suppliments</span>
                        </h5>
                        <p>{item.content}</p>
                        <Link to="/" class="btn">
                          {item.button_text}
                        </Link>
                      </div>
                    </Col>
                    <Col md="5">
                      <div className="shop-img">
                        <img src={item.img} alt={item.heading} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <BrowseCategory query={query} setQuery={setQuery} />
      <FeaturedProduct
        loading={loading}
        data={data}
        query={query}
        setQuery={setQuery}
        isWholesaler={key == "Wholesale" ? true : false}
      />
      <Footer />
    </>
  );
}
