import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";

const Dashboard = () => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data, loading, getAllData } = useGetMountData(
    `/doctor/dashboard/${userProfileId}`
  );

  const { data: Appointments } = useGetMountData(
    `/doctor/appointment/${userProfileId}`
  );
  console.log(Appointments, "Appointments");

  return (
    <div>
      <div className="dashboard-header">
        <h3>Dashboard</h3>
      </div>

      <div className="row">
        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Patient</h6>
                <h4>{data?.totalPatients || 0}</h4>
                <span className="text-success">
                  <i className="fa-solid fa-arrow-up"></i>15% From Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-user-injured"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Patients Today</h6>
                <h4>{data?.todayPatients || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.patients <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.appointments <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {data?.percentageChange?.patients || 0}% From Yesterday
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-user-clock"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Appointments Today</h6>
                <h4>{data?.todayAppointments || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.appointments <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.appointments <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {data?.percentageChange?.appointments || 0}% From Yesterday
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-8 d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Appointment</h5>
              </div>
              <div className="dropdown header-dropdown">
                <a
                  className="dropdown-toggle nav-tog"
                  data-bs-toggle="dropdown"
                  href="javascript:void(0);"
                >
                  Last 7 Days
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a href="javascript:void(0);" className="dropdown-item">
                    Today
                  </a>
                  <a href="javascript:void(0);" className="dropdown-item">
                    This Month
                  </a>
                  <a href="javascript:void(0);" className="dropdown-item">
                    Last 7 Days
                  </a>
                </div>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="table-responsive">
                <table className="table dashboard-table appoint-table">
                  {Appointments &&
                    Appointments?.map((it, index) => {
                      return (
                        <tbody>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <a href="#" className="table-avatar">
                                  <img src={user_img} alt="Img" />
                                </a>
                                <div className="patient-name-info">
                                  <span>#{it?._id}</span>
                                  <h5>
                                    <a href="#">
                                      {it?.appointmentPersonName ||
                                        it?.patientId?.firstName}
                                    </a>
                                  </h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>{`${it?.date} ${it?.time}`}</h6>
                                <span className="badge table-badge">
                                  {it?.appointmentType || "General"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="apponiment-actions d-flex align-items-center">
                                <a href="#" className="text-success-icon me-2">
                                  <i className="fa-solid fa-check"></i>
                                </a>
                                <a href="#" className="text-danger-icon">
                                  <i className="fa-solid fa-xmark"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-7 d-flex">
          <div className="dashboard-main-col w-100">
            <div className="upcoming-appointment-card">
              <div className="title-card">
                <h5>Upcoming Appointment</h5>
              </div>
              <div className="upcoming-patient-info">
                <div className="info-details">
                  <span className="img-avatar">
                    <img src={user_img} alt="Img" />
                  </span>
                  <div className="name-info">
                    <span>
                      {data?.lastUpcomingAppointment?.patientId?._id || ""}
                    </span>
                    <h6>{`${
                      data?.lastUpcomingAppointment?.patientId?.firstName
                    } ${
                      data?.lastUpcomingAppointment?.patientId?.lastName || ""
                    }`}</h6>
                    <span style={{ marginLeft: 5 }}>
                      {data?.lastUpcomingAppointment?.appointmentPersonName ||
                        ""}
                    </span>
                  </div>
                </div>
                <div className="date-details">
                  <span>{data?.lastUpcomingAppointment?.appointmentType}</span>
                  <h6>{`${data?.lastUpcomingAppointment?.date} ${data?.lastUpcomingAppointment?.time}`}</h6>
                </div>
                <div className="circle-bg">
                  <img src="assets/img/bg/dashboard-circle-bg.png" alt="" />
                </div>
              </div>
              <div className="appointment-card-footer">
                <h5>
                  <i className="fa-solid fa-video"></i>Video Appointment
                </h5>
                <div className="btn-appointments">
                  <a href="chat-doctor.html" className="btn">
                    Chat Now
                  </a>
                  <a href="doctor-appointment-start.html" className="btn">
                    Start Appointment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5 d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Clinics & Availability</h5>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="clinic-available">
                <div className="clinic-head">
                  <div className="clinic-info">
                    <span className="clinic-img">
                      <img src={user_img} alt="Img" />
                    </span>
                    <h6>Sofi’s Clinic</h6>
                  </div>
                  <div className="clinic-charge">
                    <span>$900</span>
                  </div>
                </div>
                <div className="available-time">
                  <ul>
                    <li>
                      <span>Tue :</span>
                      07:00 AM - 09:00 PM
                    </li>
                    <li>
                      <span>Wed : </span>
                      07:00 AM - 09:00 PM
                    </li>
                  </ul>
                  <div className="change-time">
                    <a href="#">Change </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
