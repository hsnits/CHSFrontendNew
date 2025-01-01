import React, { useState } from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import NotFound from "../../components/common/notFound";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import { callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import AppointmentDetails from "../../components/modals/appotmentDetails";

const Appointments = () => {
  const [tab, setTab] = useState("Accepted");
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data: AppointmentsCount } = useGetMountData(
    `/doctor/appointment-count/${userProfileId}`
  );

  const {
    data: Appointments,
    loading,
    getAllData,
    setData,
    customData,
    isOpen,
    openModelWithItem,
  } = useGetMountData(`/doctor/appointment/${userProfileId}?status=Accepted`);

  const getByFilter = async (filter) => {
    setTab(filter);
    await getAllData(`/doctor/appointment/${userProfileId}?status=${filter}`);
  };

  const handleUpdate = async (id, status) => {
    try {
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        status
      });
      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      toastMessage(
        "success",
        status == "Rejected"
          ? "The appointment has been rejected."
          : "The appointment has been completed."
      );

      const updatedData = Appointments?.filter((item) => item?._id !== id);
      setData(updatedData || []);
    } catch (error) {
      toastMessage("error", "Appointment update process failed!");
    }
  };

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
                onClick={() => getByFilter("Accepted")}
              >
                Upcoming<span>{AppointmentsCount?.Accepted || 0}</span>
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
                onClick={() => getByFilter("Cancelled")}
              >
                Cancelled<span>{AppointmentsCount?.Cancelled || 0}</span>
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
                onClick={() => getByFilter("Completed")}
              >
                Completed<span>{AppointmentsCount?.Completed || 0}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-content appointment-tab-content">
        <NotFound
          loading={loading}
          isData={Appointments?.length > 0}
          message="No Appointments Found."
        />
        {!loading &&
          Appointments?.length > 0 &&
          Appointments?.map((it, index) => {
            return (
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
                        {/* <a href="#"> */}
                        <img
                          src={it?.patientId?.coverImage || user_img}
                          alt="User Image"
                        />
                        {/* </a> */}
                        <div class="patient-info">
                          <p>{getIdLastDigits(it?._id, "Ap")}</p>
                          <h6>
                            <a href="#">
                              {it?.appointmentPersonName ||
                                it?.patientId?.firstName}
                            </a>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li class="appointment-info">
                      <p>
                        <i class="fa-solid fa-clock"></i>{" "}
                        {`${getDateFormate(it?.date)} ${it?.time}`}
                      </p>
                      <ul class="d-flex apponitment-types">
                        {it?.appointmentType || "General Visit"}
                      </ul>
                    </li>
                    <li class="mail-info-patient">
                      <ul>
                        <li>
                          <i class="fa-solid fa-envelope"></i>
                          {it?.patientId?.email}
                        </li>
                        <li>
                          <i class="fa-solid fa-phone"></i>{" "}
                          {it?.patientId?.phoneNumber}
                        </li>
                      </ul>
                    </li>
                    {tab == "Accepted" ? (
                      <li class="appointment-action">
                        <ul>
                          <li>
                            <a onClick={() => openModelWithItem("details", it)}>
                              <i class="fa-solid fa-eye"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => handleUpdate(it?._id, "Completed")}
                            >
                              <i class="fa-solid fa-comments"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => handleUpdate(it?._id, "Cancelled")}
                            >
                              <i class="fa-solid fa-xmark"></i>
                            </a>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li class="appointment-detail-btn">
                        <a
                          onClick={() => openModelWithItem("details", it)}
                          class="start-link"
                        >
                          View Details
                          <i class="fa-regular fa-circle-right ms-1"></i>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
      </div>
      <AppointmentDetails
        showModal={isOpen == "details"}
        handleModalClose={openModelWithItem}
        selectedAppointment={customData}
      />
    </div>
  );
};

export default Appointments;
