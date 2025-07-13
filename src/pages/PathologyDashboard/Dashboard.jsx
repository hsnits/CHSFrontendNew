import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { 
  getPathologyDashboardData, 
  getLabStatistics 
} from "../../redux/slices/pathologyApi";
import { Spinner } from "reactstrap";

const Dashboard = ({ labDetails }) => {
  const dispatch = useDispatch();
  const { dashboardData, labStatistics, loading } = useSelector(state => ({
    dashboardData: state.PATHOLOGY.data.pathology.getPathologyDashboardDataResult,
    labStatistics: state.PATHOLOGY.data.pathology.getLabStatisticsResult,
    loading: state.PATHOLOGY.loading.pathology.getPathologyDashboardDataLoading || state.PATHOLOGY.loading.pathology.getLabStatisticsLoading
  }));
  
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    if (labDetails?.profile?._id) {
      dispatch(getPathologyDashboardData(labDetails.profile._id));
      dispatch(getLabStatistics({ 
        labId: labDetails.profile._id, 
        period: selectedPeriod 
      }));
    }
  }, [dispatch, labDetails?.profile?._id, selectedPeriod]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const dashboardStats = dashboardData || {};
  const statistics = labStatistics || {};

  return (
    <div>
      <div className="dashboard-header">
        <h3>Lab Dashboard</h3>
        <div className="dashboard-period-selector">
          <select 
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6">
          <Card className="dash-widget">
            <Card.Body>
              <div className="dash-widget-info">
                <h6>Today's Tests</h6>
                <h3>{dashboardStats.todaysTests || 0}</h3>
                <p className="text-muted">
                  <i className="fa-solid fa-flask me-1"></i>
                  Scheduled for today
                </p>
              </div>
              <div className="dash-widget-icon">
                <i className="fa-solid fa-calendar-day"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="3" md="6">
          <Card className="dash-widget">
            <Card.Body>
              <div className="dash-widget-info">
                <h6>Pending Reports</h6>
                <h3>{dashboardStats.pendingReports || 0}</h3>
                <p className="text-muted">
                  <i className="fa-solid fa-clock me-1"></i>
                  Awaiting results
                </p>
              </div>
              <div className="dash-widget-icon">
                <i className="fa-solid fa-file-medical"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="3" md="6">
          <Card className="dash-widget">
            <Card.Body>
              <div className="dash-widget-info">
                <h6>Completed Tests</h6>
                <h3>{dashboardStats.completedTests || 0}</h3>
                <p className="text-muted">
                  <i className="fa-solid fa-check-circle me-1"></i>
                  This month
                </p>
              </div>
              <div className="dash-widget-icon">
                <i className="fa-solid fa-check"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="3" md="6">
          <Card className="dash-widget">
            <Card.Body>
              <div className="dash-widget-info">
                <h6>Home Collections</h6>
                <h3>{dashboardStats.homeCollections || 0}</h3>
                <p className="text-muted">
                  <i className="fa-solid fa-home me-1"></i>
                  This month
                </p>
              </div>
              <div className="dash-widget-icon">
                <i className="fa-solid fa-truck"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Section */}
      <Row>
        <Col lg="6">
          <Card>
            <Card.Header>
              <h5>Test Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-info">
                <div className="chart-stat">
                  <span className="chart-label">Total Tests</span>
                  <span className="chart-value">{statistics.totalTests || 0}</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-label">Lab Tests</span>
                  <span className="chart-value">{statistics.labTests || 0}</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-label">Home Collections</span>
                  <span className="chart-value">{statistics.homeCollections || 0}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header>
              <h5>Popular Tests</h5>
            </Card.Header>
            <Card.Body>
              <div className="popular-tests">
                {statistics.popularTests?.length > 0 ? (
                  statistics.popularTests.map((test, index) => (
                    <div key={index} className="test-item d-flex justify-content-between align-items-center mb-2">
                      <span className="test-name">{test.name}</span>
                      <span className="test-count badge bg-primary">{test.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No test data available</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="mt-4">
        <Col lg="12">
          <Card>
            <Card.Header>
              <h5>Recent Test Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-timeline">
                {dashboardStats.recentActivity?.length > 0 ? (
                  dashboardStats.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-icon me-3">
                        <i className={`fa-solid ${activity.type === 'completed' ? 'fa-check-circle text-success' : 
                          activity.type === 'pending' ? 'fa-clock text-warning' : 'fa-flask text-info'}`}></i>
                      </div>
                      <div className="activity-content">
                        <p className="mb-1">{activity.description}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No recent activity</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 