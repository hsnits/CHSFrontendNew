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
import "./HospitalDashboard.css";

function HospitalDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllData = async () => {
    try {
      setLoading(true);
      
      // Get user data and hospital profile data in parallel
      const [userResponse, hospitalResponse] = await Promise.all([
        callGetApi(`/user`).catch(err => ({ status: false, error: err })),
        callGetApi(`/hospital/profile`).catch(err => ({ status: false, error: err }))
      ]);
      
      console.log("🔄 User data response:", userResponse);
      console.log("🔄 User data actual content:", JSON.stringify(userResponse, null, 2));
      console.log("🏥 Hospital profile response:", hospitalResponse);
      console.log("🏥 Hospital profile actual content:", JSON.stringify(hospitalResponse, null, 2));
      
      if (userResponse?.success || userResponse?.status) {
        let mergedData = userResponse.data;
        
        // Always merge hospital profile data if available (contains latest bed data)
        if ((hospitalResponse?.success || hospitalResponse?.status) && hospitalResponse.data) {
          console.log("🔄 Merging hospital profile data with user data");
          
          // Create a proper nested structure for the sidebar
          const hospitalDetails = {
            hospitalName: hospitalResponse.data.hospitalName,
            hospitalType: hospitalResponse.data.hospitalType,
            bedCapacity: hospitalResponse.data.totalBeds,
            totalDoctors: hospitalResponse.data.totalDoctors,
            totalNurses: hospitalResponse.data.totalNurses,
            totalStaff: hospitalResponse.data.totalStaff,
            icuBeds: hospitalResponse.data.icuBeds,
            emergencyBeds: hospitalResponse.data.emergencyBeds,
            operationTheaters: hospitalResponse.data.operationTheaters,
            establishedYear: hospitalResponse.data.establishedYear,
            // Include all other hospital details
            ...hospitalResponse.data
          };
          
          mergedData = {
            ...userResponse.data,
            profile: {
              ...userResponse.data.profile,
              // Merge flattened hospital data
              ...hospitalResponse.data,
              // Also create nested structure for backward compatibility
              hospitalDetails: hospitalDetails,
              // Quick stats compatibility
              totalBeds: hospitalResponse.data.totalBeds,
              doctorCount: hospitalResponse.data.totalDoctors,
              nurseCount: hospitalResponse.data.totalNurses,
            }
          };
          
          console.log("✅ Merged user data with hospital profile:", mergedData);
          console.log("🔍 Final profile structure:", {
            profile: mergedData.profile,
            hospitalDetails: mergedData.profile?.hospitalDetails,
            totalBeds: mergedData.profile?.totalBeds,
            bedCapacity: mergedData.profile?.bedCapacity
          });
        } else {
          console.log("⚠️ Hospital profile data not available, using user data only");
        }
        
        setData(mergedData);
      } else {
        console.error("❌ Failed to fetch user data");
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
      <Breadcrumb title="Hospital Dashboard" showButton={false} />
      <section className="section-area">
        <Container>
          <Tab.Container activeKey={activeKey}>
            <Row>
              <Col lg={3}>
                <Sidebar userData={data} />
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    {/* Pass merged user data to Dashboard for local calculations */}
                    <Dashboard userData={data} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Appointments />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Availability userData={data} refreshData={getAllData} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <Profile userData={data} refreshData={getAllData} />
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

export default HospitalDashboard; 