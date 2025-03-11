import React, { useState } from "react";
import { Tab } from "react-bootstrap";
import user_img from "../../assets/img/dr_profile.jpg";
import { useDispatch } from "react-redux";
import {
  getAllAppointment,
  updateAppointmentStatus,
} from "../../redux/slices/patientApi";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import moment from "moment/moment";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import NotFound from "../../components/common/notFound";
import AppointmentDetails from "../../components/modals/appotmentDetails";
import DeleteModal from "../../components/modals/delete-modal";

const MyAppointTabView = ({ appointmentData }) => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;
  const [isOpen, setIsOpen] = useState("");
  const [customData, setCustomData] = useState("");

  const upcomingAppointments = appointmentData.filter(
    (appointment) =>
      appointment.status === "Pending" || appointment.status === "Accepted"
  );
  const canceledAppointments = appointmentData.filter(
    (appointment) => appointment.status === "Cancelled"
  );
  const completedAppointments = appointmentData.filter(
    (appointment) => appointment.status === "Completed"
  );

  const dispatch = useDispatch();

  const handleUpdateStatus = async (id) => {
    await dispatch(
      updateAppointmentStatus({ data: { id: id, status: "Cancelled" } })
    ).then(() => {
      openModelWithItem();
      dispatch(getAllAppointment(userProfileId));
    });
  };

  const openModelWithItem = (key, item) => {
    setIsOpen(key);
    setCustomData(item);
  };

  return (
    <>
      {" "}
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
            <NotFound
              loading={false}
              isData={false}
              message="No upcoming appointments found."
            />
          ) : (
            upcomingAppointments.map((el, index) => {
              console.log(upcomingAppointments);
              return (
                <div className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <a>
                          <img
                            src={el?.refDoctor?.coverImage || user_img}
                            alt="User Image"
                          />
                        </a>
                        <div className="patient-info">
                          <p>{getIdLastDigits(el?._id, "AP")}</p>
                          <h6>
                            <a>Dr {el?.refDoctor?.displayName || "--"}</a>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>
                        {getDateFormate(el?.date)}, {el?.time}
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
                          {getIdLastDigits(el?._id, "AP")}
                        </li>
                        {/* <li>
                          <i className="fa-solid fa-phone"></i>
                          {el?.refDoctor?.phoneNumber}
                        </li> */}
                      </ul>
                    </li>
                    <li className="appointment-action">
                      <ul>
                        <li
                          onClick={() => {
                            openModelWithItem("details", el);
                          }}
                        >
                          <a>
                            <i className="fa-solid fa-eye"></i>
                          </a>
                        </li>

                        <li onClick={() => openModelWithItem("delete", el)}>
                          <a>
                            <i className="fa-solid fa-xmark"></i>
                          </a>
                        </li>
                      </ul>
                    </li>
                    {/* <li className="appointment-detail-btn">
                  <a className="start-link">
                    <i className="fa-solid fa-calendar-check me-1"></i>
                    Attend
                  </a>
                </li> */}
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
            <NotFound
              loading={false}
              isData={false}
              message="No cancel appointments found."
            />
          ) : (
            canceledAppointments.map((el, index) => {
              return (
                <div className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <a>
                          <img
                            src={el?.refDoctor?.coverImage || user_img}
                            alt="User Image"
                          />
                        </a>
                        <div className="patient-info">
                          <p>{getIdLastDigits(el?._id, "AP")}</p>
                          <h6>
                            <a>Dr {el?.refDoctor?.displayName || "--"}</a>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>
                        {getDateFormate(el?.date)}, {el?.time}
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>General Visit</li>
                        <li>{el?.appointmentType}</li>
                      </ul>
                    </li>
                    <li className="appointment-detail-btn">
                      <a
                        className="start-link"
                        onClick={() => {
                          openModelWithItem("details", el);
                        }}
                      >
                        View Details
                        <i className="fa-regular fa-circle-right ms-1"></i>
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
          id="pills-complete"
          role="tabpanel"
          aria-labelledby="pills-complete-tab"
        >
          {completedAppointments.length === 0 ? (
            <NotFound
              loading={false}
              isData={false}
              message="No completed appointments found."
            />
          ) : (
            completedAppointments.map((el, index) => {
              return (
                <div className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <a>
                          <img
                            src={el?.refDoctor?.coverImage || user_img}
                            alt="User Image"
                          />
                        </a>
                        <div className="patient-info">
                          <p>{getIdLastDigits(el?._id, "AP")}</p>
                          <h6>
                            <a>Dr {el?.refDoctor?.displayName || "--"}</a>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>{" "}
                        {getDateFormate(el?.date)}, {el?.time}
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>General Visit</li>
                        <li>{el?.appointmentType}</li>
                      </ul>
                    </li>
                    <li className="appointment-detail-btn">
                      <a
                        className="start-link"
                        onClick={() => {
                          openModelWithItem("details", el);
                        }}
                      >
                        View Details
                        <i className="fa-regular fa-circle-right ms-1"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
      <AppointmentDetails
        showModal={isOpen == "details"}
        handleModalClose={openModelWithItem}
        selectedAppointment={customData}
        type="patient"
      />
      <DeleteModal
        type="appointment"
        isOpen={isOpen == "delete"}
        onClose={openModelWithItem}
        title="Are you sure you want to cancel this appointment ?"
        onConfirm={() => handleUpdateStatus(customData?._id)}
      />
    </>
  );
};

export default MyAppointTabView;
