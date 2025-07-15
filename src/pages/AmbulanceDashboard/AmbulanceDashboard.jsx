import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Tab, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import Sidebar from "./Sidebar";
import { callGetApi } from "../../_service";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import Appointments from "./Appointments";
import Availability from "./Availability";
import "./AmbulanceDashboard.css";

function AmbulanceDashboard() {
  const [data, setData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllData = async () => {
    try {
      setLoading(true);
      // Get user data
      const userResponse = await callGetApi(`/user`);
      if (userResponse?.status) {
        setData(userResponse.data);
      }

      // Get ambulance profile data
      const profileResponse = await callGetApi(`/ambulance/profile`);
      if (profileResponse?.success) {
        setProfileData(profileResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first";

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Breadcrumb title="Ambulance Dashboard" showButton={false} />
      <section className="section-area">
        <Container>
          <Tab.Container activeKey={activeKey}>
            <Row>
              <Col lg={3}>
                <Sidebar userData={data} profileData={profileData} />
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Dashboard />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Appointments />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Availability />
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <Profile userData={data} profileData={profileData} refreshData={getAllData} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default AmbulanceDashboard; 