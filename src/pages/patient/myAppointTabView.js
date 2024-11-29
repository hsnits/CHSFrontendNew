import React from "react";
import { Tab } from "react-bootstrap";
import user_img from "../../assets/img/profile-06.jpg";

const MyAppointTabView = () => {
  return (
    <Tab.Pane eventKey="second">
      <div className="dashboard-header">
        <h3>Appointments</h3>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul
            className="nav nav-pills inner-tab "
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-upcoming-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-upcoming"
                type="button"
                role="tab"
                aria-controls="pills-upcoming"
                aria-selected="true"
              >
                Upcoming<span>21</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-cancel-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-cancel"
                type="button"
                role="tab"
                aria-controls="pills-cancel"
                aria-selected="false"
                tabindex="-1"
              >
                Cancelled<span>16</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-complete-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-complete"
                type="button"
                role="tab"
                aria-controls="pills-complete"
                aria-selected="false"
                tabindex="-1"
              >
                Completed<span>214</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content appointment-tab-content">
        <div
          className="tab-pane fade show active"
          id="pills-upcoming"
          role="tabpanel"
          aria-labelledby="pills-upcoming-tab"
        >
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <a href="#">
                    <img src={user_img} alt="User Image" />
                  </a>
                  <div className="patient-info">
                    <p>#Apt0001</p>
                    <h6>
                      <a href="#">Dr Edalin</a>
                    </h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p>
                  <i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li className="mail-info-patient">
                <ul>
                  <li>
                    <i className="fa-solid fa-envelope"></i>
                    edalin@example.com
                  </li>
                  <li>
                    <i className="fa-solid fa-phone"></i>+1 504 368 6874
                  </li>
                </ul>
              </li>
              <li className="appointment-action">
                <ul>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-eye"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-comments"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-xmark"></i>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="appointment-detail-btn">
                <a href="#" className="start-link">
                  <i className="fa-solid fa-calendar-check me-1"></i>
                  Attend
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-cancel"
          role="tabpanel"
          aria-labelledby="pills-cancel-tab"
        >
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <a href="#">
                    <img src={user_img} alt="User Image" />
                  </a>
                  <div className="patient-info">
                    <p>#Apt00011</p>
                    <h6>
                      <a href="#">Dr Edalin</a>
                    </h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p>
                  <i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li className="appointment-detail-btn">
                <a href="#" className="start-link">
                  View Details
                  <i className="fa-regular fa-circle-right ms-1"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-complete"
          role="tabpanel"
          aria-labelledby="pills-complete-tab"
        >
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <a href="#">
                    <img src={user_img} alt="User Image" />
                  </a>
                  <div className="patient-info">
                    <p>#Apt0001</p>
                    <h6>
                      <a href="#">Dr Edalin</a>
                    </h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p>
                  <i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li className="appointment-detail-btn">
                <a href="#" className="start-link">
                  View Details
                  <i className="fa-regular fa-circle-right ms-1"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Tab.Pane>
  );
};

export default MyAppointTabView;
