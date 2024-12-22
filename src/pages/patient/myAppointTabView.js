import React from "react";
import { Tab } from "react-bootstrap";
import user_img from "../../assets/img/profile-06.jpg";

const MyAppointTabView = ({ appointmentData }) => {
  const upcomingAppointments = appointmentData.filter(
    (appointment) => appointment.status === "Pending"
  );
  const canceledAppointments = appointmentData.filter(
    (appointment) => appointment.status === "Cancelled"
  );
  const completedAppointments = appointmentData.filter(
    (appointment) => appointment.status === "Completed"
  );
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
                Upcoming<span>{upcomingAppointments.length}</span>
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
                Cancelled<span>{canceledAppointments.length}</span>
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
                Completed<span>{completedAppointments.length}</span>
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
          {upcomingAppointments.length === 0 ? (
            <div className="appointment-wrap">
              <p>No upcoming appointments.</p>
            </div>
          ) : (
            upcomingAppointments.map((el, index) => {
              return (
                <div className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <a href="#">
                          <img src={user_img} alt="User Image" />
                        </a>
                        <div className="patient-info">
                          <p>#Apt{el?._id.slice(-3)}</p>
                          <h6>
                            <a href="#">Dr {el?.refDoctor?.firstName}</a>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>11 Nov 2024 10.45
                        AM
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>General Visit</li>
                        <li>{el?.appointmentType}</li>
                      </ul>
                    </li>
                    <li className="mail-info-patient">
                      <ul>
                        <li>
                          <i className="fa-solid fa-envelope"></i>
                          {el?.refDoctor?.email}
                        </li>
                        <li>
                          <i className="fa-solid fa-phone"></i>
                          {el?.refDoctor?.phoneNumber}
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
              );
            })
          )}
        </div>
        <div
          className="tab-pane fade"
          id="pills-cancel"
          role="tabpanel"
          aria-labelledby="pills-cancel-tab"
        >
          {canceledAppointments.length === 0 ? (
            <div className="appointment-wrap">
              <p>No appointments found.</p>
            </div>
          ) : (
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
          )}
        </div>
        <div
          className="tab-pane fade"
          id="pills-complete"
          role="tabpanel"
          aria-labelledby="pills-complete-tab"
        >
          {completedAppointments.length === 0 ? (
            <div className="appointment-wrap">
              <p>No appointments found.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </Tab.Pane>
  );
};

export default MyAppointTabView;
