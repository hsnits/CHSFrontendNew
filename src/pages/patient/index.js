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
import SymptomReport from "./syptomReports";
import useGetMountData from "../../helpers/getDataHook";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";
import {
  getAllAppointment,
  getAppointment,
} from "../../redux/slices/patientApi";

function PatientDashboard() {
  const dispatch = useDispatch();
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const data = useSelector(
    (state) => state.USER?.data?.user?.userProfileResult
  );

  const {
    data: isReports,
    loading,
    getAllData,
  } = useGetMountData(`/patient/reports/${data?.profile?._id}`);

  const appointmentData = useSelector(
    (state) => state.PATIENT.data?.user?.getAllAppointmentResult
  );
  // const appointmentData = useSelector(
  //   (state) => state.PATIENT.data?.user?.getAppointmentResult
  // );

  useEffect(() => {
    dispatch(userProfile());
    // dispatch(getAppointment(userProfileId));
    dispatch(getAllAppointment(userProfileId));
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
                  <Dashboard data={data} appointmentData={appointmentData} getAllData={getAllData} userProfileId={userProfileId}/>
                  {/* My Appointment tab view */}
                  <MyAppointTabView appointmentData={appointmentData} />
                  {/* Sayptoms view */}
                  <PatSymptoms />
                  {/* Sayptom Reports view */}
                  <SymptomReport
                    allReports={isReports}
                    loading={loading}
                    getAllData={getAllData}
                    userData={data}
                  />
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
