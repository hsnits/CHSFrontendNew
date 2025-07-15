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
import "./BiomedicalDashboard.css";

function BiomedicalDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllData = async () => {
    try {
      setLoading(true);
      const response = await callGetApi(`/user`);
      if (response?.status) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  if (!data) return null;

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Tab.Container id="left-tabs-example" activeKey={activeKey}>
            <Row>
              <Col lg="4" xl="3" className="theiaStickySidebar">
                <Sidebar biomedicalDetails={data} getAllData={getAllData} />
              </Col>
              <Col lg="8" xl="9">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Dashboard biomedicalDetails={data} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Appointments biomedicalDetails={data} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Availability biomedicalDetails={data} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <Profile biomedicalDetails={data} getAllData={getAllData} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default BiomedicalDashboard; 