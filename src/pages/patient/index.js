import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import SymptomReport from "./syptomReports";
import useGetMountData from "../../helpers/getDataHook";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";
import { getAllAppointment } from "../../redux/slices/patientApi";
import MyOrders from './MyOrders';
import OrderDetails from './OrderDetails';
import SubscriptionDashboard from './SubscriptionDashboard';

function PatientDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Get the "key" from the URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("key") || "first"; // Default to "first" if no key is provided

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const data = useSelector(
    (state) => state.USER?.data?.user?.userProfileResult
  );

  const {
    data: isReports,
    loading,
    getAllData,
  } = useGetMountData(
    data?.profile?._id ? `/patient/reports/${data?.profile?._id}` : null
  );

  const appointmentData = useSelector(
    (state) => state.PATIENT.data?.user?.getAllAppointmentResult
  );

  useEffect(() => {
    dispatch(userProfile());
    dispatch(getAllAppointment(userProfileId));
  }, []);

  useEffect(() => {
    if (activeTab == "second" && userProfileId) {
      dispatch(getAllAppointment(userProfileId));
    } else if (userProfileId && activeTab == "seven") {
      getAllData(`/patient/reports/${userProfileId}`);
    }
  }, [activeTab, userProfileId]);

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Tab.Container id="left-tabs-example" activeKey={activeTab}>
            <Row>
              {/* Side Bar */}
              <SideBar data={data} />
              <Col lg="8" xl="9">
                <Tab.Content>
                  {/* Dashboard view */}
                  <Tab.Pane eventKey="first">
                    <Dashboard
                      data={data}
                      appointmentData={appointmentData}
                      getAllData={getAllData}
                      userProfileId={userProfileId}
                    />
                  </Tab.Pane>
                  {/* My Appointment tab view */}
                  <Tab.Pane eventKey="second">
                    <MyAppointTabView appointmentData={appointmentData} />
                  </Tab.Pane>
                  {/* Health Report view */}
                  <Tab.Pane eventKey="third">
                    <HealthReport data={data} activeTab={activeTab} />
                  </Tab.Pane>
                  {/* Profile Setting */}
                  <Tab.Pane eventKey="fourth">
                    <ProfileSetting data={data} />
                  </Tab.Pane>
                  {/* Symptoms view */}
                  <Tab.Pane eventKey="six">
                    <PatSymptoms />
                  </Tab.Pane>
                  {/* Symptom Reports view */}
                  <Tab.Pane eventKey="seven">
                    <SymptomReport
                      allReports={isReports}
                      loading={loading}
                      getAllData={getAllData}
                      userData={data}
                    />
                  </Tab.Pane>
                  {/* My Orders view */}
                  <Tab.Pane eventKey="orders">
                    <MyOrders />
                  </Tab.Pane>
                  {/* Subscription view */}
                  <Tab.Pane eventKey="subscription">
                    <SubscriptionDashboard />
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

export default PatientDashboard;
