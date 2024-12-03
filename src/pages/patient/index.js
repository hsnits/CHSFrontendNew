import React, { useEffect } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import { Col, Container, Row } from "react-bootstrap";
import "../patient/Patient.css";
import Footer from "../../components/Footer";
import Tab from "react-bootstrap/Tab";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../redux/slices/userApi";
import SideBar from "./sideBar";
import Dashboard from "./dashboard";
import MyAppointTabView from "./myAppointTabView";
import HealthReport from "./healthReport";
import ProfileSetting from "./profileSetting";
import PatSymptoms from "./symptoms";

function PatientDashboard() {
  const dispatch = useDispatch();

  const data = useSelector(
    (state) => state.USER?.data?.user?.userProfileResult
  );

  useEffect(() => {
    dispatch(userProfile());
  }, []);

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              {/* Side Bar */}
              <SideBar data={data} />
              <Col lg="8" xl="9">
                <Tab.Content>
                  {/* Dashboard view */}
                  <Dashboard data={data} />
                  {/* My Appointment tab view */}
                  <MyAppointTabView />
                  {/* Sayptoms view */}
                  <PatSymptoms />
                  {/* Health Report view */}
                  <HealthReport />
                  {/* Profile Setting */}
                  <ProfileSetting data={data} />
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

export default PatientDashboard;
