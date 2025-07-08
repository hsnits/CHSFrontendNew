import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Tab, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import Sidebar from "./Sidebar"; // Create this similar to DoctorSidebar
import useGetMountData from "../../helpers/getDataHook";
import UnderDevelopment from "../../components/common/UnderDevelopment";
import Profile from "./Profile";

function PathologyDashboard() {
    debugger;
  const { data, getAllData } = useGetMountData(`/user`);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeKey = searchParams.get("key") || "first";

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
                <Sidebar labDetails={data} />
              </Col>
              <Col lg="8" xl="9">

            <Tab.Content>
            <Tab.Pane eventKey="first">
                <UnderDevelopment />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
                <UnderDevelopment />
            </Tab.Pane>
            <Tab.Pane eventKey="third">
                <UnderDevelopment />
            </Tab.Pane>
            <Tab.Pane eventKey="fourth">
                <UnderDevelopment />
            </Tab.Pane>
            <Tab.Pane eventKey="fifth">
                <Profile labDetails={data} getAllData={getAllData} />
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

export default PathologyDashboard;
