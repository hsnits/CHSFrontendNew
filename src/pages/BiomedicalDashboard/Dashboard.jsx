import React, { useEffect } from "react";
import biomedical_img from "../../assets/img/dr_profile.jpg";
import dashboardCircleBg from "../../assets/img/bg/steps-bg.png";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import { Button } from "react-bootstrap";
import NotFound from "../../components/common/notFound";
import {
  formatDate,
  formatName,
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";

const Dashboard = ({ biomedicalDetails }) => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data, getAllData } = useGetMountData(
    userProfileId ? `/biomedical/dashboard` : null
  );

  const {
    data: appointments,
    loading,
    getAllData: getAllAppointments,
    setQuery,
  } = useGetMountData(userProfileId ? `/biomedical/appointments` : null);

  const getByFilter = async (filter) => {
    setQuery((e) => ({ ...e, status: "pending", time: filter }));
  };

  useEffect(() => {
    if (userProfileId) {
      getAllData();
      getAllAppointments();
    }
  }, [userProfileId, getAllData, getAllAppointments]);

  useEffect(() => {
    setQuery((e) => ({ ...e, status: "pending" }));
  }, [setQuery]);

  const dashboardStats = data || {};
  const recentAppointments = appointments?.slice(0, 5) || [];

  return (
    <div>
      <div className="dashboard-header">
        <h3>Biomedical Dashboard</h3>
        <p className="text-muted">Welcome back! Here's what's happening with your biomedical services today.</p>
      </div>

      {/* Main Statistics Row */}
      <div className="row">
        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Service Requests</h6>
                <h3>
                  {dashboardStats.totalBookings || 0}
                  <span className="badge badge-success ms-2">
                    <i className="fa-solid fa-angle-up"></i> +2.1%
                  </span>
                </h3>
                <p className="text-muted mb-0">All time requests</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-tools"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Today's Services</h6>
                <h3>
                  {dashboardStats.todayBookings || 0}
                  <span className="badge badge-warning ms-2">
                    <i className="fa-solid fa-calendar-day"></i> Today
                  </span>
                </h3>
                <p className="text-muted mb-0">Scheduled for today</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-calendar-day"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Completed Services</h6>
                <h3>
                  {dashboardStats.completedBookings || 0}
                  <span className="badge badge-primary ms-2">
                    <i className="fa-solid fa-check-circle"></i> Done
                  </span>
                </h3>
                <p className="text-muted mb-0">Successfully completed</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Statistics Row */}
      <div className="row">
        <div className="col-xl-3 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Pending Requests</h6>
                <h3>
                  {dashboardStats.pendingBookings || 0}
                  <span className="badge badge-info ms-2">
                    <i className="fa-solid fa-clock"></i> 
                  </span>
                </h3>
                <p className="text-muted mb-0">Awaiting response</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>This Week</h6>
                <h3>
                  {dashboardStats.weeklyBookings || 0}
                  <span className="badge badge-secondary ms-2">
                    <i className="fa-solid fa-calendar-week"></i>
                  </span>
                </h3>
                <p className="text-muted mb-0">Week's services</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-calendar-week"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>This Month</h6>
                <h3>
                  {dashboardStats.monthlyBookings || 0}
                  <span className="badge badge-success ms-2">
                    <i className="fa-solid fa-calendar-alt"></i>
                  </span>
                </h3>
                <p className="text-muted mb-0">Month's services</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-calendar-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Success Rate</h6>
                <h3>
                  {dashboardStats.completionRate || 0}%
                  <span className="badge badge-success ms-2">
                    <i className="fa-solid fa-percentage"></i>
                  </span>
                </h3>
                <p className="text-muted mb-0">Completion rate</p>
              </div>
              <div className="dashboard-widget-img">
                <img
                  src={dashboardCircleBg}
                  alt="Dashboard background"
                  className="img-fluid"
                />
                <div className="dashboard-widget-icon">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Service Requests */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Recent Service Requests</h4>
              <div className="card-header-btns">
                <Button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => getByFilter("today")}
                >
                  Today
                </Button>
                <Button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => getByFilter("week")}
                >
                  Week
                </Button>
                <Button
                  className="btn btn-info btn-sm"
                  onClick={() => getByFilter("month")}
                >
                  Month
                </Button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recentAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Service ID</th>
                        <th>Patient</th>
                        <th>Service Type</th>
                        <th>Equipment</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.map((appointment, index) => (
                        <tr key={index}>
                          <td>
                            <span className="text-blue">
                              #{getIdLastDigits(appointment._id, "BM")}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={appointment.patientId?.coverImage || biomedical_img}
                                alt="Patient"
                                className="avatar-sm rounded-circle me-2"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              />
                              <div>
                                <p className="mb-0 fw-semibold">
                                  {formatName(appointment.patientId?.firstName, appointment.patientId?.lastName)}
                                </p>
                                <small className="text-muted">
                                  {appointment.patientId?.email}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              appointment.serviceType === "emergency" ? "badge-danger" :
                              appointment.serviceType === "maintenance" ? "badge-primary" :
                              appointment.serviceType === "repair" ? "badge-warning" :
                              appointment.serviceType === "installation" ? "badge-success" :
                              "badge-info"
                            }`}>
                              {appointment.serviceType || "General Service"}
                            </span>
                          </td>
                          <td>
                            <div>
                              <span className="fw-semibold">
                                {appointment.patientDetails?.equipmentType || "Not specified"}
                              </span>
                              {appointment.patientDetails?.equipmentModel && (
                                <small className="text-muted d-block">
                                  Model: {appointment.patientDetails.equipmentModel}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <span className="fw-semibold">
                                {getDateFormate(appointment.appointmentDate)}
                              </span>
                              {appointment.appointmentTime && (
                                <small className="text-muted d-block">
                                  {appointment.appointmentTime}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              appointment.status === "completed" ? "badge-success" :
                              appointment.status === "pending" ? "badge-warning" :
                              appointment.status === "confirmed" ? "badge-primary" :
                              appointment.status === "cancelled" ? "badge-danger" :
                              "badge-secondary"
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              appointment.serviceType === "emergency" ? "badge-danger" :
                              appointment.priority === "high" ? "badge-warning" :
                              "badge-secondary"
                            }`}>
                              {appointment.serviceType === "emergency" ? "Emergency" :
                               appointment.priority || "Normal"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <NotFound message="No service requests found" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Statistics */}
      {dashboardStats.serviceStats && Object.keys(dashboardStats.serviceStats).length > 0 && (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Service Type Distribution</h4>
                <p className="text-muted mb-0">Breakdown of services by type</p>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(dashboardStats.serviceStats).map(([serviceType, count]) => (
                    <div key={serviceType} className="col-md-4 col-lg-3 mb-3">
                      <div className="service-stat-card border rounded p-3 h-100">
                        <div className="d-flex align-items-center">
                          <div className="service-stat-icon me-3">
                            <i className={`fa-solid fa-2x ${
                              serviceType === "maintenance" ? "fa-wrench text-primary" :
                              serviceType === "repair" ? "fa-screwdriver-wrench text-warning" :
                              serviceType === "installation" ? "fa-plug text-success" :
                              serviceType === "calibration" ? "fa-sliders-h text-info" :
                              serviceType === "inspection" ? "fa-search text-secondary" :
                              serviceType === "emergency" ? "fa-exclamation-triangle text-danger" :
                              "fa-cog text-dark"
                            }`}></i>
                          </div>
                          <div className="service-stat-info">
                            <h6 className="mb-1">{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</h6>
                            <h4 className="mb-0">{count}</h4>
                            <small className="text-muted">requests</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Statistics */}
      {dashboardStats.equipmentStats && dashboardStats.equipmentStats.length > 0 && (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Equipment Type Distribution</h4>
                <p className="text-muted mb-0">Most serviced equipment types</p>
              </div>
              <div className="card-body">
                <div className="row">
                  {dashboardStats.equipmentStats.map((equipment, index) => (
                    <div key={index} className="col-md-4 col-lg-3 mb-3">
                      <div className="service-stat-card border rounded p-3 h-100">
                        <div className="d-flex align-items-center">
                          <div className="service-stat-icon me-3">
                            <i className="fa-solid fa-2x fa-desktop text-primary"></i>
                          </div>
                          <div className="service-stat-info">
                            <h6 className="mb-1">{equipment._id || "Other"}</h6>
                            <h4 className="mb-0">{equipment.count}</h4>
                            <small className="text-muted">services</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Information */}
      {dashboardStats.totalRevenue && dashboardStats.totalRevenue > 0 && (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Revenue Overview</h4>
                <p className="text-muted mb-0">Financial performance metrics</p>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="revenue-card text-center p-4 border rounded">
                      <i className="fa-solid fa-3x fa-indian-rupee-sign text-success mb-3"></i>
                      <h3 className="text-success">₹{dashboardStats.totalRevenue?.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Total Revenue</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="revenue-card text-center p-4 border rounded">
                      <i className="fa-solid fa-3x fa-chart-line text-primary mb-3"></i>
                      <h3 className="text-primary">
                        ₹{dashboardStats.totalRevenue && dashboardStats.completedBookings ? 
                          Math.round(dashboardStats.totalRevenue / dashboardStats.completedBookings).toLocaleString() : 0}
                      </h3>
                      <p className="text-muted mb-0">Average Per Service</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="revenue-card text-center p-4 border rounded">
                      <i className="fa-solid fa-3x fa-percentage text-info mb-3"></i>
                      <h3 className="text-info">{dashboardStats.completionRate || 0}%</h3>
                      <p className="text-muted mb-0">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 