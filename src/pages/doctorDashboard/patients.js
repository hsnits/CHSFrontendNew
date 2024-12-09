import React from "react";
import { Search } from "react-feather";
import user_img from "../../assets/img/doctor-profile-img.jpg";

const Patients = () => {
  return (
    <div>
      <div class="dashboard-header">
        <h3>My Patients</h3>
        <ul class="header-list-btns">
          <li>
            <div class="input-block dash-search-input">
              <input type="text" class="form-control" placeholder="Search" />
              <span class="search-icon">
                <Search size={18} />
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="row">
        <div class="col-xl-4 col-lg-6 col-md-6 d-flex">
          <div class="appointment-wrap appointment-grid-wrap">
            <ul>
              <li>
                <div class="appointment-grid-head">
                  <div class="patinet-information">
                    <a href="#">
                      <img src={user_img} alt="User Image" />
                    </a>
                    <div class="patient-info">
                      <p>#Apt0001</p>
                      <h6>
                        <a href="#">Adrian</a>
                      </h6>
                      <ul>
                        <li>Age : 42</li>
                        <li>Male</li>
                        <li>AB+</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li class="appointment-info">
                <p>
                  <i class="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM
                </p>
                <p class="mb-0">
                  <i class="fa-solid fa-location-dot"></i>Alabama, USA
                </p>
              </li>
              <li class="appointment-action">
                <div class="patient-book">
                  <p>
                    <i class="fa-solid fa-calendar-days"></i>Last Booking{" "}
                    <span>27 Feb 2024</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
