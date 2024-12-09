import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";

const Appointments = () => {
  return (
    <div>
      <div class="dashboard-header">
        <h3>Appointments</h3>
      </div>
      <div class="appointment-tab-head">
        <div class="appointment-tabs">
          <ul class="nav nav-pills inner-tab " id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
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
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
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
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
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
      <div class="tab-content appointment-tab-content">
        <div
          class="tab-pane fade show active"
          id="pills-upcoming"
          role="tabpanel"
          aria-labelledby="pills-upcoming-tab"
        >
          <div class="appointment-wrap">
            <ul>
              <li>
                <div class="patinet-information">
                  <a href="#">
                    <img src={user_img} alt="User Image" />
                  </a>
                  <div class="patient-info">
                    <p>#Apt0001</p>
                    <h6>
                      <a href="#">Dr Edalin</a>
                    </h6>
                  </div>
                </div>
              </li>
              <li class="appointment-info">
                <p>
                  <i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <ul class="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li class="mail-info-patient">
                <ul>
                  <li>
                    <i class="fa-solid fa-envelope"></i>
                    edalin@example.com
                  </li>
                  <li>
                    <i class="fa-solid fa-phone"></i>+1 504 368 6874
                  </li>
                </ul>
              </li>
              <li class="appointment-action">
                <ul>
                  <li>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-solid fa-comments"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-solid fa-xmark"></i>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="appointment-detail-btn">
                <a href="#" class="start-link">
                  <i class="fa-solid fa-calendar-check me-1"></i>
                  Attend
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="pills-cancel"
          role="tabpanel"
          aria-labelledby="pills-cancel-tab"
        >
          <div class="appointment-wrap">
            <ul>
              <li>
                <div class="patinet-information">
                  <a href="#">
                    <img src={user_img} alt="User Image" />
                  </a>
                  <div class="patient-info">
                    <p>#Apt00011</p>
                    <h6>
                      <a href="#">Dr Edalin</a>
                    </h6>
                  </div>
                </div>
              </li>
              <li class="appointment-info">
                <p>
                  <i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <ul class="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li class="appointment-detail-btn">
                <a href="#" class="start-link">
                  View Details
                  <i class="fa-regular fa-circle-right ms-1"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="pills-complete"
          role="tabpanel"
          aria-labelledby="pills-complete-tab"
        >
          <div class="appointment-wrap">
            <ul>
              <li>
                <div class="patinet-information">
                  <a href="#">
                    <img src={user_img} alt="User Image" />
                  </a>
                  <div class="patient-info">
                    <p>#Apt0001</p>
                    <h6>
                      <a href="#">Dr Edalin</a>
                    </h6>
                  </div>
                </div>
              </li>
              <li class="appointment-info">
                <p>
                  <i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <ul class="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li class="appointment-detail-btn">
                <a href="#" class="start-link">
                  View Details
                  <i class="fa-regular fa-circle-right ms-1"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
