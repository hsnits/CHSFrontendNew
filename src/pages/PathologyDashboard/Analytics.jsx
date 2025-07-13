import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getLabStatistics } from "../../redux/slices/pathologyApi";
import { Spinner } from "reactstrap";

const Analytics = ({ labDetails }) => {
  const dispatch = useDispatch();
  const { labStatistics, loading } = useSelector(state => ({
    labStatistics: state.PATHOLOGY.data.pathology.getLabStatisticsResult,
    loading: state.PATHOLOGY.loading.pathology.getLabStatisticsLoading
  }));
  
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (labDetails?.profile?._id) {
      dispatch(getLabStatistics({ 
        labId: labDetails.profile._id, 
        period: selectedPeriod,
        year: selectedYear
      }));
    }
  }, [dispatch, labDetails?.profile?._id, selectedPeriod, selectedYear]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const statistics = labStatistics || {};
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="dashboard-header d-flex justify-content-between align-items-center">
        <h3>Lab Analytics</h3>
        <div className="d-flex gap-3">
          <select 
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select 
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6">
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-primary">{statistics.totalTests || 0}</h4>
                  <p className="mb-0">Total Tests</p>
                </div>
                <div className="stats-icon">
                  <i className="fa-solid fa-flask fa-2x text-primary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="3" md="6">
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-success">{statistics.completedTests || 0}</h4>
                  <p className="mb-0">Completed</p>
                </div>
                <div className="stats-icon">
                  <i className="fa-solid fa-check-circle fa-2x text-success"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="3" md="6">
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-info">{statistics.labTests || 0}</h4>
                  <p className="mb-0">Lab Tests</p>
                </div>
                <div className="stats-icon">
                  <i className="fa-solid fa-building fa-2x text-info"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="3" md="6">
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-warning">{statistics.homeCollections || 0}</h4>
                  <p className="mb-0">Home Collections</p>
                </div>
                <div className="stats-icon">
                  <i className="fa-solid fa-truck fa-2x text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Analytics */}
      <Row>
        <Col lg="6">
          <Card>
            <Card.Header>
              <h5>Test Type Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                {statistics.testTypeDistribution?.length > 0 ? (
                  <div className="test-distribution">
                    {statistics.testTypeDistribution.map((item, index) => (
                      <div key={index} className="distribution-item d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <div 
                            className="distribution-color me-3"
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                              borderRadius: '50%' 
                            }}
                          ></div>
                          <span>{item.type}</span>
                        </div>
                        <div className="text-end">
                          <strong>{item.count}</strong>
                          <br />
                          <small className="text-muted">{item.percentage}%</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">No distribution data available</p>
                )}
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
              <div className="popular-tests-analytics">
                {statistics.popularTests?.length > 0 ? (
                  statistics.popularTests.map((test, index) => (
                    <div key={index} className="popular-test-item d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rank-badge me-3">
                          <span className="badge bg-primary">{index + 1}</span>
                        </div>
                        <div>
                          <strong>{test.name}</strong>
                          <br />
                          <small className="text-muted">
                            {test.growth > 0 ? (
                              <span className="text-success">
                                <i className="fa-solid fa-arrow-up"></i> {test.growth}%
                              </span>
                            ) : test.growth < 0 ? (
                              <span className="text-danger">
                                <i className="fa-solid fa-arrow-down"></i> {Math.abs(test.growth)}%
                              </span>
                            ) : (
                              <span className="text-muted">No change</span>
                            )}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <strong>{test.count}</strong>
                        <br />
                        <small className="text-muted">tests</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">No popular tests data available</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Monthly Trends */}
      <Row className="mt-4">
        <Col lg="12">
          <Card>
            <Card.Header>
              <h5>Monthly Trends</h5>
            </Card.Header>
            <Card.Body>
              <div className="monthly-trends">
                {statistics.monthlyTrends?.length > 0 ? (
                  <div className="trends-grid">
                    {statistics.monthlyTrends.map((month, index) => (
                      <div key={index} className="trend-item text-center p-3 border rounded">
                        <h6>{month.month}</h6>
                        <div className="trend-stats">
                          <div className="stat-item">
                            <strong className="text-primary">{month.totalTests}</strong>
                            <br />
                            <small>Total Tests</small>
                          </div>
                          <div className="stat-item mt-2">
                            <strong className="text-success">{month.completedTests}</strong>
                            <br />
                            <small>Completed</small>
                          </div>
                          <div className="stat-item mt-2">
                            <strong className="text-info">{month.revenue}</strong>
                            <br />
                            <small>Revenue</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">No monthly trends data available</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row className="mt-4">
        <Col lg="6">
          <Card>
            <Card.Header>
              <h5>Performance Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="performance-metrics">
                <div className="metric-item d-flex justify-content-between align-items-center mb-3">
                  <span>Average Processing Time</span>
                  <strong>{statistics.avgProcessingTime || 'N/A'}</strong>
                </div>
                <div className="metric-item d-flex justify-content-between align-items-center mb-3">
                  <span>Completion Rate</span>
                  <strong className="text-success">{statistics.completionRate || 0}%</strong>
                </div>
                <div className="metric-item d-flex justify-content-between align-items-center mb-3">
                  <span>Customer Satisfaction</span>
                  <strong className="text-warning">{statistics.customerSatisfaction || 0}/5</strong>
                </div>
                <div className="metric-item d-flex justify-content-between align-items-center">
                  <span>On-Time Delivery</span>
                  <strong className="text-info">{statistics.onTimeDelivery || 0}%</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header>
              <h5>Revenue Analytics</h5>
            </Card.Header>
            <Card.Body>
              <div className="revenue-analytics">
                <div className="revenue-item d-flex justify-content-between align-items-center mb-3">
                  <span>Total Revenue</span>
                  <strong className="text-success">₹{statistics.totalRevenue || 0}</strong>
                </div>
                <div className="revenue-item d-flex justify-content-between align-items-center mb-3">
                  <span>Lab Tests Revenue</span>
                  <strong>₹{statistics.labTestsRevenue || 0}</strong>
                </div>
                <div className="revenue-item d-flex justify-content-between align-items-center mb-3">
                  <span>Home Collection Revenue</span>
                  <strong>₹{statistics.homeCollectionRevenue || 0}</strong>
                </div>
                <div className="revenue-item d-flex justify-content-between align-items-center">
                  <span>Average Order Value</span>
                  <strong className="text-info">₹{statistics.avgOrderValue || 0}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics; 