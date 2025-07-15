import React, { useEffect } from "react";
import drProfileImg from "../../assets/img/dr_profile.jpg";
import dashboardCircleBg from "../../assets/img/bg/steps-bg.png";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import { Button, Form } from "react-bootstrap";
import NotFound from "../../components/common/notFound";
import {
  formatDate,
  formatName,
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data, getAllData } = useGetMountData(
    `/ambulance/dashboard/${userProfileId}`
  );

  const {
    data: Appointments,
    loading,
    getAllData: getAllAppointments,
    setQuery,
  } = useGetMountData(`/ambulance/appointment/${userProfileId}`);

  const getByFilter = async (filter) => {
    setQuery((e) => ({ ...e, status: "Pending", time: filter }));
  };

  useEffect(() => {
    setQuery((e) => ({ ...e, status: "Pending" }));
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h3>Ambulance Dashboard</h3>
      </div>

      <div className="row">
        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Rides</h6>
                <h4>{data?.totalBookings || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.totalBookings <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.totalBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.totalBookings) || 0}% From
                  Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-ambulance"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Today's Rides</h6>
                <h4>{data?.todayBookings || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.todayBookings <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.todayBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.todayBookings) || 0}% From
                  Yesterday
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-calendar-day"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Pending Requests</h6>
                <h4>{data?.pendingBookings || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.pendingBookings <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.pendingBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.pendingBookings) || 0}% From
                  Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-clock"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Completed Rides</h6>
                <h4>{data?.completedBookings || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.completedBookings <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.completedBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.completedBookings) || 0}% From
                  Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-check-circle"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Emergency Calls</h6>
                <h4>{data?.emergencyBookings || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.emergencyBookings <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.emergencyBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.emergencyBookings) || 0}% From
                  Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Revenue</h6>
                <h4>₹{data?.revenue || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.revenue <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.revenue <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.revenue) || 0}% From
                  Last Month
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-rupee-sign"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Recent Ambulance Requests</h5>
              </div>
              <div className="card-view-link">
                <Link to="/ambulance/appointments">View All</Link>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="table-responsive">
                <table className="table dashboard-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Pickup Location</th>
                      <th>Ambulance Type</th>
                      <th>Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : Appointments?.length > 0 ? (
                      Appointments.slice(0, 5).map((appointment, index) => (
                        <tr key={index}>
                          <td>
                            <div className="table-avatar">
                              <img
                                src={appointment?.patientDetails?.profileImage || drProfileImg}
                                alt="Patient"
                              />
                              <div className="table-avatar-info">
                                <h6>{appointment?.patientDetails?.name}</h6>
                                <span>#{getIdLastDigits(appointment?._id)}</span>
                              </div>
                            </div>
                          </td>
                          <td>{appointment?.pickupLocation || 'N/A'}</td>
                          <td>{appointment?.ambulanceType || 'Basic'}</td>
                          <td>{getDateFormate(appointment?.date)}</td>
                          <td>
                            <span className={`badge badge-${appointment?.urgencyLevel?.toLowerCase()}`}>
                              {appointment?.urgencyLevel || 'Low'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-${appointment?.status?.toLowerCase()}`}>
                              {appointment?.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-action">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  // Handle view action
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">
                          <NotFound message="No ambulance requests found" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 