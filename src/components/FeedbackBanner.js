import React from "react";
import feedback_img from "../assets/img/feedback.png";
import { Link } from "react-router-dom";

export default function FeedbackBanner() {
  return (
    <>
      <section class="feedback-section-fifteen">
        <div class="container">
          <div class="feedback-schedule-all">
            <div class="row">
              <div class="col-lg-5">
                <div class="feedback-inner-main">
                  <img src={feedback_img} alt="image" class="img-fluid" />
                </div>
              </div>
              <div class="col-lg-7">
                <div class="feedback-fifteen-content">
                  <h3>Consult top doctors online for any health concern</h3>
                  <p>Connect within 60secs</p>
                  <Link to="/register">Signup Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
