import React from "react";
import { Col, Row, Tab } from "react-bootstrap";
import user_img from "../../assets/img/profile-06.jpg";
import EditReport from "../../components/modals/edit-report";
import useGetMountData from "../../helpers/getDataHook";
import { getDateFormate } from "../../helpers/utils";

const HealthReport = ({ data }) => {
  const {
    data: isReports,
    loading,
    getAllData,
    isOpen,
    customData,
    openModelWithItem,
  } = useGetMountData(data?._id ? `/patient/health-report/${data?._id}` : null);

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
              <a href="#">
                <img
                  src={data?.coverImage ?? user_img}
                  className="avatar dropdown-avatar"
                  alt="Img"
                />
                &nbsp; &nbsp;{data?.profile?.firstName}
              </a>
            </div>
            <div className="dashboard-card-body">
              <Row>
                <Col lg="12" md="12" sm="12">
                  {!loading && isReports ? (
                    <Row>
                      <Col lg="4">
                        <div className="health-records icon-orange">
                          <span>
                            <i className="fa-solid fa-heart"></i>
                            Heart Rate
                          </span>
                          <h3>
                            {isReports?.heartRate} Bpm <sup> 2%</sup>
                          </h3>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="health-records icon-amber">
                          <span>
                            <i className="fa-solid fa-temperature-high"></i>
                            Body Temprature
                          </span>
                          <h3>{isReports?.bodyTemperature} C</h3>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="health-records icon-dark-blue">
                          <span>
                            <i className="fa-solid fa-notes-medical"></i>
                            Glucose Level
                          </span>
                          <h3>
                            {isReports?.glucoseLevel}
                            <sup> 6%</sup>
                          </h3>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="health-records icon-blue">
                          <span>
                            <i className="fa-solid fa-highlighter"></i>
                            SPo2
                          </span>
                          <h3>{isReports?.spo2}%</h3>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="health-records icon-red">
                          <span>
                            <i className="fa-solid fa-syringe"></i>
                            Blood Pressure
                          </span>
                          <h3>
                            {isReports?.bloodPressure} mg/dl<sup> 2%</sup>
                          </h3>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="health-records icon-purple">
                          <span>
                            <i className="fa-solid fa-user-pen"></i>
                            BMI{" "}
                          </span>
                          <h3>{isReports?.bmi} kg/m2</h3>
                        </div>
                      </Col>
                      <Col lg="12" md="12">
                        <div className="report-gen-date">
                          <p>
                            Report generated on last visit :{" "}
                            {getDateFormate(isReports?.updatedAt)}{" "}
                            {/* <span>
                              <i className="fa-solid fa-copy"></i>
                            </span> */}
                          </p>
                        </div>
                        <div className="modal-btn text-end">
                          <button
                            onClick={() => openModelWithItem("edit", isReports)}
                            className="btn btn-primary prime-btn"
                          >
                            Edit Report
                          </button>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <div className="modal-btn text-end">
                      <button
                        onClick={() => openModelWithItem("add")}
                        className="btn btn-primary prime-btn"
                      >
                        Add Health Report
                      </button>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <EditReport
        userId={data?._id}
        isOpen={isOpen}
        onClose={openModelWithItem}
        reportData={isReports || customData}
        refreshData={() => getAllData(`/patient/health-report/${data?._id}`)}
      />
    </Tab.Pane>
  );
};

export default HealthReport;
