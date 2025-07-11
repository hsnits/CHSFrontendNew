import React, { useEffect, useState } from "react";
import user_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import NotFound from "../../components/common/notFound";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import { callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import AppointmentDetails from "../../components/modals/appotmentDetails";
import AppointmentReports from "../../components/modals/patientReports";

const Appointments = ({ activeKey }) => {
  const [tab, setTab] = useState("Accepted");
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data: AppointmentsCount, getAllData: getCounts } = useGetMountData(
    `/nurse/appointment-count/${userProfileId}`
  );

  const {
    data: Appointments,
    loading,
    getAllData,
    setData,
    customData,
    isOpen,
    setQuery,
    query,
    openModelWithItem,
  } = useGetMountData(`/nurse/appointment/${userProfileId}`);

  const getByFilter = async (filter) => {
    setTab(filter);
    setQuery((pre) => ({ ...pre, status: filter }));
  };

  const handleUpdate = async (id, status, docId) => {
    try {
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        status,
      });
      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      toastMessage(
        "success",
        status == "Rejected"
          ? "The appointment has been rejected."
          : "The appointment has been completed."
      );
      const updatedData = Appointments?.filter((item) => item?._id !== id);
      getCounts(`/nurse/appointment-count/${userProfileId}`);
      setData(updatedData || []);
    } catch (error) {
      toastMessage("error", "Appointment update process failed!");
    }
  };

  useEffect(() => {
    setQuery((pre) => ({ ...pre, status: "Accepted" }));
  }, []);

  useEffect(() => {
    if (activeKey && userProfileId) {
      getAllData(`/nurse/appointment/${userProfileId}`);
      getCounts(`/nurse/appointment-count/${userProfileId}`);
    }
  }, [activeKey, userProfileId]);

  return (
    <div>
      <div className="dashboard-header">
        <h3>Appointments</h3>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === "Accepted" ? "active" : ""}`}
                onClick={() => getByFilter("Accepted")}
              >
                Upcoming<span>{AppointmentsCount?.Accepted || 0}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === "Cancelled" ? "active" : ""}`}
                onClick={() => getByFilter("Cancelled")}
              >
                Cancelled<span>{AppointmentsCount?.Cancelled || 0}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === "Completed" ? "active" : ""}`}
                onClick={() => getByFilter("Completed")}
              >
                Completed<span>{AppointmentsCount?.Completed || 0}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content appointment-tab-content">
        <NotFound
          loading={loading}
          isData={Appointments?.length > 0}
          message="No Appointments Found."
        />

        {!loading &&
          Appointments?.length > 0 &&
          Appointments?.map((it, index) => {
            return (
              <div className="appointment-wrap" key={index}>
                <ul>
                  <li>
                    <div className="patinet-information">
                      <img
                        src={it?.patientId?.coverImage || user_img}
                        alt="User Image"
                      />
                      <div className="patient-info">
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
                  <li className="appointment-info">
                    <p>
                      <i className="fa-solid fa-clock"></i>{" "}
                      {`${getDateFormate(it?.date)} ${it?.time}`}
                    </p>
                    <ul className="d-flex apponitment-types">
                      {it?.appointmentType || "General Visit"}
                    </ul>
                  </li>
                  <li className="mail-info-patient">
                    <ul>
                      <li>
                        <i className="fa-solid fa-envelope"></i>
                        {it?.patientId?.email || "N/A"}
                      </li>
                    </ul>
                  </li>
                  {tab === "Accepted" ? (
                    <li className="appointment-action">
                      <ul>
                        <li>
                          <a onClick={() => openModelWithItem("details", it)}>
                            <i className="fa-solid fa-eye"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => openModelWithItem("reports", it)}
                          >
                            <i className="fa-solid fa-comments"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => handleUpdate(it?._id, "Cancelled")}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </a>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <li className="appointment-detail-btn">
                      <a
                        onClick={() => openModelWithItem("details", it)}
                        className="start-link"
                      >
                        View Details
                        <i className="fa-regular fa-circle-right ms-1"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
      </div>
      <AppointmentDetails
        showModal={isOpen == "details"}
        handleModalClose={openModelWithItem}
        selectedAppointment={customData}
      />
      <AppointmentReports
        showModal={isOpen == "reports"}
        handleClose={openModelWithItem}
        customData={customData}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default Appointments;