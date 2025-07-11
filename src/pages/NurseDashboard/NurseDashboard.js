import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Tab, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Requests from "./requests";
import Patients from "./patients";
import Appointments from "./appointments";
import Profile from "./profile";
import useGetMountData from "../../helpers/getDataHook";
import Availability from './availability';
function NurseDashboard() {
  const { data, getAllData } = useGetMountData(`/user`);

  // Get the key from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first"; // Default to "first"

  if (!data || data?.length === 0) return null;

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Tab.Container id="left-tabs-example" activeKey={activeKey}>
            <Row>
              <Col lg="4" xl="3" className="theiaStickySidebar">
                <Sidebar UserDetails={data} />
              </Col>
              <Col lg="8" xl="9">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Dashboard />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Requests activeKey={activeKey == "second"} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Patients />
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <Appointments activeKey={activeKey == "fourth"} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="availability">
                    <Availability UserDetails={data} />
                  </Tab.Pane>

                  <Tab.Pane eventKey="sixth">
                    <Profile nurseDetails={data} getAllData={getAllData} />
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

export default NurseDashboard;