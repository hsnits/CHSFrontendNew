import React from "react";
import { Col, Row, Tab } from "react-bootstrap";
import user_img from "../../assets/img/profile-06.jpg";

const HealthReport = () => {
  return (
    <Tab.Pane eventKey="third">
      <Row>
        <div className="dashboard-header">
          <h3>Health </h3>
        </div>
        <Col xl="12" className="d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Health Records</h5>
              </div>
              <a href="javascript:void(0);">
                <img
                  src={user_img}
                  className="avatar dropdown-avatar"
                  alt="Img"
                />
                &nbsp; &nbsp; Hendrita
              </a>
            </div>
            <div className="dashboard-card-body">
              <Row>
                <Col lg="12" md="12" sm="12">
                  <Row>
                    <Col lg="4">
                      <div className="health-records icon-orange">
                        <span>
                          <i className="fa-solid fa-heart"></i>
                          Heart Rate
                        </span>
                        <h3>
                          140 Bpm <sup> 2%</sup>
                        </h3>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="health-records icon-amber">
                        <span>
                          <i className="fa-solid fa-temperature-high"></i>
                          Body Temprature
                        </span>
                        <h3>37.5 C</h3>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="health-records icon-dark-blue">
                        <span>
                          <i className="fa-solid fa-notes-medical"></i>
                          Glucose Level
                        </span>
                        <h3>
                          70 - 90<sup> 6%</sup>
                        </h3>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="health-records icon-blue">
                        <span>
                          <i className="fa-solid fa-highlighter"></i>
                          SPo2
                        </span>
                        <h3>96%</h3>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="health-records icon-red">
                        <span>
                          <i className="fa-solid fa-syringe"></i>
                          Blood Pressure
                        </span>
                        <h3>
                          100 mg/dl<sup> 2%</sup>
                        </h3>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="health-records icon-purple">
                        <span>
                          <i className="fa-solid fa-user-pen"></i>
                          BMI{" "}
                        </span>
                        <h3>20.1 kg/m2</h3>
                      </div>
                    </Col>
                    <Col lg="12" md="12">
                      <div className="report-gen-date">
                        <p>
                          Report generated on last visit : 25 Mar 2024{" "}
                          <span>
                            <i className="fa-solid fa-copy"></i>
                          </span>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Tab.Pane>
  );
};

export default HealthReport;
