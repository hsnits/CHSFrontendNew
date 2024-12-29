import React, { useRef, useState } from "react";
import "./DoctorDashboard.css";
import { Search } from "react-feather";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";
import NotFound from "../../components/common/notFound";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";

const Patients = () => {
  const [searchValue, setSearchValue] = useState("");
  const debounceTimer = useRef(null);

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data, setData, backupData, loading } = useGetMountData(
    `/doctor/patient/${userProfileId}`
  );

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const filteredData = backupData?.filter((it) =>
        `${it?.patientId?.firstName} ${it?.patientId?.lastName}`
          .toLowerCase()
          .includes(value)
      );
      setData(filteredData);
    }, 300);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h3>My Patients</h3>
        <ul className="header-list-btns">
          <li>
            <div className="input-block dash-search-input">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchValue}
                onChange={handleSearch}
              />
              <span className="search-icon">
                <Search size={18} />
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div className="row">
        <NotFound
          loading={loading}
          isData={data?.length > 0}
          message="No Patients Found."
        />
        {!loading &&
          data?.length > 0 &&
          data.map((it, index) => (
            <div key={index} className="col-xl-4 col-lg-6 col-md-6 d-flex mb-4">
              <div className="card patient-card">
                <div className="patient-card-header">
                  <div className="patient-details">
                    <h6 className="patient-name">
                      {`${it?.patientId?.firstName} ${it?.patientId?.lastName}`}
                    </h6>
                    <p className="patient-id" style={{ color: "blue" }}>
                      {getIdLastDigits(it?.patientId?._id, "PT")}
                    </p>
                    <p className="patient-age">
                      Age: {it?.patientId?.age || "N/A"}
                    </p>
                  </div>
                  <img
                    src={it?.patientId?.coverImage || user_img}
                    alt="User"
                    className="patient-img"
                  />
                </div>
                <div className="patient-card-body">
                  <ul className="patient-card-details">
                    <li>Gender: {it?.patientId?.gender || "N/A"}</li>
                    <li>Blood Group: {it?.patientId?.bloodGroup || "N/A"}</li>
                  </ul>
                  <p className="patient-card-address">
                    <b>
                      <i className="fa-solid fa-location-dot"></i>{" "}
                      {it?.patientId?.address}, {it?.patientId?.city},{" "}
                      {it?.patientId?.state}, {it?.patientId?.country} -{" "}
                      {it?.patientId?.pinCode}
                    </b>
                  </p>
                  <div className="appointment-info">
                    <p>
                      <i className="fa-solid fa-clock"></i> Upcoming Booking:{" "}
                      {it?.upcomingAppointment ? (
                        <>
                          <span style={{ color: "green" }}>
                            {getDateFormate(it?.upcomingAppointment?.date)}{" "}
                            {it?.upcomingAppointment?.time}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: "red" }}>
                          No upcoming booking
                        </span>
                      )}
                    </p>
                    <p>
                      <i className="fa-solid fa-calendar-days"></i> Last
                      Booking:{" "}
                      {it?.lastCompletedAppointment ? (
                        <>
                          <span style={{ color: "green" }}>
                            {getDateFormate(it?.lastCompletedAppointment?.date)}{" "}
                            {it?.lastCompletedAppointment?.time}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: "red" }}>No Last booking</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Patients;
