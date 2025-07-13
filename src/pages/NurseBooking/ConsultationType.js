import React from "react";
import {
  Home,
  MessageCircle,
  Mic,
  User,
  Video,
} from "react-feather";

export default function ConsultationType({
  formData,
  onConsultationTypeChange,
}) {
  return (
    <>
      <div className="row">
        <div className="col-lg-8 col-md-6">
          <div className="paitent-header">
            <h4 className="paitent-title">Type of Consultation</h4>
          </div>
          <div className="consultation-grid">
            <div className="consultation-info">
              <p>Online Consultation</p>
              <div className="consultation-list">
                <ul>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Video" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Video")}
                    >
                      <div>RS : 0 </div>{" "}
                      <a href="#">
                        <Video /> &nbsp; Video Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Audio" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Audio")}
                    >
                      <div>RS : 0 </div>{" "}
                      <a href="#">
                        <Mic /> &nbsp; Audio Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Chat" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Chat")}
                    >
                      <div>RS : 0 </div>{" "}
                      <a href="#">
                        <MessageCircle /> &nbsp; Chat Consulting
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="consultation-info">
              <p>In-Person Services</p>
              <div className="consultation-list">
                <ul>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Home" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Home")}
                    >
                      <div>RS : 0 </div>{" "}
                      <a href="#">
                        <Home /> &nbsp; Home Visit
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Consult" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Consult")}
                    >
                      <div>RS : 0 </div>{" "}
                      <a href="#">
                        <User /> &nbsp; In-Person Consult
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 