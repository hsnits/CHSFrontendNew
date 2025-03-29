import React from "react";
import { BrowseCategoryData, responsiveCategory } from "../Data";
import { Row, Col, Container } from "react-bootstrap";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";

export default function BrowseCategory({ query = null, setQuery }) {
  const handleCategoryChange = (value) => {
    if (setQuery) {
      setQuery((pre) => ({ ...pre, category: value }));
    }
  };

  return (
    <section className="clinic-features-section">
      <Container>
        <div className="pharmacy-section-header">
          <Row className="align-items-center">
            <Col md="6">
              <div className="pharmacy-title">
                <h4>Browse by Category</h4>
              </div>
            </Col>
            <Col md="6">
              {/* <div className="pharmacy-title-link"> */}

              {/* <Link to="#">View All <i className="fa-solid fa-arrow-right"></i></ Link> */}
              {/* </div> */}
            </Col>
          </Row>
        </div>
        <Row>
          <div className="deals-list">
            <ul className="nav">
              <OwlCarousel
                className="owl-theme"
                loop
                margin={10}
                dots={false}
                autoPlay={true}
                nav
                responsive={responsiveCategory}
              >
                {BrowseCategoryData.map((BrowseCategory) => (
                  <li key={BrowseCategory.id}>
                    {console.log(
                      query,
                      BrowseCategory.name,
                      "BrowseCategory.name"
                    )}
                    <div
                      className="deals-grid"
                      onClick={() => handleCategoryChange(BrowseCategory.name)}
                    >
                      <div
                        className={`deals-box `}
                        style={{
                          backgroundColor:
                            query?.category == BrowseCategory.name && "#a5c7ff",
                        }}
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={BrowseCategory.img}
                          alt={BrowseCategory.name}
                        />
                      </div>
                      <div className="deals-content">
                        <Link
                          to="#"
                          style={{
                            color:
                              query?.category == BrowseCategory.name && "blue",
                          }}
                        >
                          {BrowseCategory.name}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </OwlCarousel>
            </ul>
          </div>
        </Row>
      </Container>
    </section>
  );
}
