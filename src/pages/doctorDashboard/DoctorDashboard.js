import React from "react";
import Header from "../../components/Header";
import { Container, Row, Tab, Col } from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import DoctorSidebar from "./sidebar";
import Dashboard from "./dashboard";
import Requests from "./requests";
import Patients from "./patients";
import Appointments from "./appoitments";
import Profile from "./profile";
import useGetMountData from "../../helpers/getDataHook";
import Clinic from "../doctorDashboard/clint";

function DoctorDashboard() {
  const { data, getAllData } = useGetMountData(`/user`);

  if (!data || data?.length == 0) return;

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col lg="4" xl="3" className="theiaStickySidebar">
                <DoctorSidebar doctorDetails={data} />
              </Col>
              <Col lg="8" xl="9">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Dashboard />
                  </Tab.Pane>

                  <Tab.Pane eventKey="second">
                    <Requests />
                  </Tab.Pane>

                  <Tab.Pane eventKey="third">
                    <Patients />
                  </Tab.Pane>

                  <Tab.Pane eventKey="fourth">
                    <Appointments />
                  </Tab.Pane>

                  <Tab.Pane eventKey="fifth">
                    <Clinic />
                  </Tab.Pane>

                  <Tab.Pane eventKey="sixth">
                    <Profile doctorDetails={data} getAllData={getAllData} />
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

export default DoctorDashboard;
