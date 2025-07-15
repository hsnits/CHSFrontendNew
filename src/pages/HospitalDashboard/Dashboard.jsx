import React, { useEffect } from "react";

import useGetMountData from "../../helpers/getDataHook";
import { Button, Card, Row, Col } from "react-bootstrap";
import NotFound from "../../components/common/notFound";
import {
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import { Link } from "react-router-dom";

// Dashboard now accepts merged userData from parent to enhance or override stats
const Dashboard = ({ userData }) => {

  // Fetch dashboard metrics from backend
  const { data } = useGetMountData(`/hospital/dashboard`);

  // Derive stats from user profile (sidebar) as a fallback or enhancement
  const profile = userData?.profile || {};
  const hospitalDetails = profile?.hospitalDetails || {};

  /*
    Compute derived values
    1. Total Beds  – prefer API value, else from hospitalDetails / profile
    2. Available Beds – prefer API, else compute from bedData or totalBeds
    3. Total Staff – prefer API, else sum of doctors + nurses or totalStaff field
  */
  const fallbackTotalBeds =
    hospitalDetails?.bedData?.totalBeds ??
    hospitalDetails?.bedCapacity ??
    profile?.totalBeds ??
    profile?.bedCapacity ??
    0;

  const fallbackAvailableBeds =
    hospitalDetails?.bedData?.availableBeds ??
    (typeof hospitalDetails?.bedCapacity === "number"
      ? hospitalDetails.bedCapacity
      : profile?.availableBeds) ??
    0;

  const doctors = hospitalDetails?.totalDoctors ?? profile?.doctorCount ?? 0;
  const nurses = hospitalDetails?.totalNurses ?? profile?.nurseCount ?? 0;
  const fallbackTotalStaff =
    hospitalDetails?.totalStaff ?? profile?.totalStaff ?? doctors + nurses;

  // Merge / override API data with fallback values for UI rendering. Define early so it can be reused.
  const mergedData = {
    ...data,
    totalBeds: data?.totalBeds || fallbackTotalBeds,
    availableBeds: data?.availableBeds || fallbackAvailableBeds,
    totalStaff: data?.totalStaff || fallbackTotalStaff,
  };

  // Recent admissions from backend
  const admissions = mergedData?.recentBookings || [];

  const {
    data: Appointments,
    loading,
    getAllData: getAllAppointments,
    setQuery,
  } = useGetMountData(`/hospital/appointments`);

  const getByFilter = async (filter) => {
    setQuery((e) => ({ ...e, status: "Pending", time: filter }));
  };

  useEffect(() => {
    setQuery((e) => ({ ...e, status: "Pending" }));
  }, []);

  return (
    <div className="hospital-dashboard-content">
      {/* Dashboard Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="dashboard-card admissions">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-hospital"></i>
              </div>
              <div className="card-value">{mergedData?.totalBookings || 0}</div>
              <div className="card-label">Total Admissions</div>
              <small className={
                mergedData?.percentageChange?.totalBookings <= 0
                  ? "text-light"
                  : "text-light"
              }>
                <i className={
                  mergedData?.percentageChange?.totalBookings <= 0
                    ? "fas fa-arrow-down"
                    : "fas fa-arrow-up"
                }></i>
                {Math.trunc(mergedData?.percentageChange?.totalBookings) || 0}% From Last Week
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="dashboard-card today">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-calendar-day"></i>
              </div>
              <div className="card-value">{mergedData?.todayBookings || 0}</div>
              <div className="card-label">Today's Appointments</div>
              <small className="text-light">
                <i className={
                  mergedData?.percentageChange?.todayBookings <= 0
                    ? "fas fa-arrow-down"
                    : "fas fa-arrow-up"
                }></i>
                {Math.trunc(mergedData?.percentageChange?.todayBookings) || 0}% From Yesterday
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="dashboard-card completed">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="card-value">{mergedData?.completedBookings || 0}</div>
              <div className="card-label">Completed</div>
              <small className="text-light">
                <i className={
                  mergedData?.percentageChange?.completedBookings <= 0
                    ? "fas fa-arrow-down"
                    : "fas fa-arrow-up"
                }></i>
                {Math.trunc(mergedData?.percentageChange?.completedBookings) || 0}% From Last Week
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="dashboard-card emergency">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-ambulance"></i>
              </div>
              <div className="card-value">{mergedData?.emergencyBookings || 0}</div>
              <div className="card-label">Emergency Cases</div>
              <small className="text-light">
                <i className={
                  mergedData?.percentageChange?.emergencyBookings <= 0
                    ? "fas fa-arrow-down"
                    : "fas fa-arrow-up"
                }></i>
                {Math.trunc(mergedData?.percentageChange?.emergencyBookings) || 0}% From Last Week
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue & Additional Stats */}
      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <Card className="dashboard-card revenue">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div className="card-value">₹{mergedData?.revenue || 0}</div>
              <div className="card-label">Total Revenue</div>
              <small className="text-light">
                <i className={
                  mergedData?.percentageChange?.revenue <= 0
                    ? "fas fa-arrow-down"
                    : "fas fa-arrow-up"
                }></i>
                {Math.trunc(mergedData?.percentageChange?.revenue) || 0}% From Last Month
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-3">
          <Card className="dashboard-card beds">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-bed"></i>
              </div>
              <div className="card-value">{mergedData?.availableBeds || 0}</div>
              <div className="card-label">Available Beds</div>
              <small className="text-light">
                Out of {mergedData?.totalBeds || 0} total beds
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-3">
          <Card className="dashboard-card staff">
            <Card.Body className="text-center">
              <div className="card-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="card-value">{mergedData?.totalStaff || 0}</div>
              <div className="card-label">Total Staff</div>
              <small className="text-light">
                Doctors & Nurses on duty
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Admissions Section */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="recent-admissions">
            <Card.Header>
              <h5 className="mb-0">Recent Admissions</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Admission Date</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions?.length > 0 ? (
                      admissions.map((admission, index) => {
                        const patientName = admission.patientDetails?.name || admission.patientId?.name || admission.patientName || "N/A";
                        const patientIdDisplay = admission.patientId?._id || admission._id || index;
                        const department = admission.department || admission.patientDetails?.department || "General";
                        const status = admission.status || admission.patientDetails?.status || "Pending";
                        const admissionDate = admission.admissionDate || admission.date || admission.createdAt || "-";
                        const room = admission.room || admission.patientDetails?.room || "-";
                        return (
                        <tr key={index}>
                          <td>
                            <div className="patient-info">
                              <strong>{patientName}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {getIdLastDigits(patientIdDisplay)}
                              </small>
                            </div>
                          </td>
                          <td>{typeof admissionDate === 'string' ? admissionDate : new Date(admissionDate).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-primary">
                              {department}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                status.toLowerCase() === "admitted" || status.toLowerCase() === "confirmed"
                                  ? "bg-success"
                                  : status.toLowerCase() === "discharged" || status.toLowerCase() === "completed"
                                  ? "bg-info"
                                  : "bg-warning"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td>{room}</td>
                        </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No recent admissions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 