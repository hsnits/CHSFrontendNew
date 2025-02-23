import React from "react";
import { BrowserRouter, Route, Routes as Routing } from "react-router-dom";
import PatientDashboard from "../pages/patient";
import DoctorProfile from "../pages/doctorProfile/DoctorProfile";
import DoctorDashboard from "../pages/doctorDashboard/DoctorDashboard";
import Pharmacy from "../pages/pharmacy/Pharmacy";
import ProductDesc from "../components/pharmacy/ProductDesc";
import Cart from "../components/pharmacy/Cart";
import Checkout from "../components/pharmacy/Checkout";
import OrderSuccess from "../components/pharmacy/OrderSuccess";
import Login from "../pages/auth/Login";
import DoctorRegister from "../pages/auth/DoctorRegister";
import Home from "../pages/home/Home";
import { ROLES } from "../constants";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../components/common/notFoundPage";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import DoctorList from "../pages/doctorList/DoctorList";
import BookingSuccess from "../pages/BookingSuccess/BookingSuccess";
import VirtualConsultation from "../pages/services/VirtualConsultation";
import DoctorBooking from "../pages/doctorBooking";
import Career from "../pages/career/Career";
import InvestorRegistration from "../pages/investor/InvestorRegistration";
import Appointments from "../pages/doctorDashboard/appoitments";
import PrescriptionRefills from "../pages/services/PrescriptionRefills";
import LabTest from "../pages/services/LabTest";
import Diagnostics from "../pages/services/Diagnostics";
import PublicRoute from "./PublicRoute";
import VerifyOtp from "../pages/auth/verifyOtp";

const Routes = () => {
  return (
    <BrowserRouter>
      <Routing>
        {/* auth routes */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <DoctorRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/verifyOtp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* </PublicRoute> */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/VirtualConsultation" element={<VirtualConsultation />} />
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/DoctorList" element={<DoctorList />} />
        <Route path="/DoctorProfile" element={<DoctorProfile />} />
        <Route
          path="/DoctorDashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/ProductDesc" element={<ProductDesc />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route
          path="/DoctorBooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <DoctorBooking />
            </ProtectedRoute>
          }
        />

        <Route path="/OrderSuccess" element={<OrderSuccess />} />
        <Route
          path="/BookingSuccess"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="/career" element={<Career />} />
        <Route
          path="/InvestorRegistration"
          element={<InvestorRegistration />}
        />

        {/* <Route path="/Appointment" element={<Appointments />} /> */}
        <Route path="/PrescriptionRefills" element={<PrescriptionRefills />} />
        <Route path="/LabTest" element={<LabTest />} />
        <Route path="/Diagnostics" element={<Diagnostics />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routing>
    </BrowserRouter>
  );
};

export default Routes;
