import React from "react";
import appointment_img from "../assets/img/appointment-ryt-1.png";
import experience1 from "../assets/img/icons/experience-1.svg";
import experience2 from "../assets/img/icons/experience-2.svg";
import experience3 from "../assets/img/icons/experience-3.svg";
import experience4 from "../assets/img/doctor.png";
import experience5 from "../assets/img/health_issue.png";
import experience6 from "../assets/img/get_a_solution.png";
import { Link } from "react-router-dom";

export default function BookAppointment() {
  return (
    <>
      <section className="appointment-section-fifteen">
        <div className="container">
          <div className="row ">
            <div className="col-lg-7">
              <div className="appointment-schedule-main">
                <h2>Book Appointment</h2>
                <h6>More the quantity, higher the discount. Hurry, Buy Now!</h6>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
                <ul>
                  <li>
                    <div className="appointment-schedule-img">
                      <img src={experience4} alt="Experience" />
                      <div className="appoint-inner-img">
                        <img src={experience3} alt="Experience" />
                      </div>
                    </div>
                    <span>Find Experience Doctors</span>
                  </li>
                  <li>
                    <div className="appointment-schedule-img">
                      <img src={experience5} alt="Experience" />
                      <div className="appoint-inner-img">
                        <img src={experience1} alt="Experience" />
                      </div>
                    </div>
                    <span>Share your Health Issues</span>
                  </li>
                  <li>
                    <div className="appointment-schedule-img">
                      <img src={experience6} alt="Experience" />
                      <div className="appoint-inner-img">
                        <img src={experience2} alt="Experience" />
                      </div>
                    </div>
                    <span>Get solution about health</span>
                  </li>
                </ul>
                <Link to="/doctorlist">Book an Appointment</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="appointment-right-image appoint-fift-img">
                <img
                  src={appointment_img}
                  alt="Experience"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
