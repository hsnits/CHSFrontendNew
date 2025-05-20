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
import { ROLES, STORAGE } from "../constants";
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
import PrivacyPolicy from "../components/static/privacyPolicy";
import TermsAndConditions from "../components/static/TermsAndConditions";
import CancellationRefundPolicy from "../components/static/CancellationRefundPolicy";
import ShippingDeliveryPolicy from "../components/static/ShippingDeliveryPolicy";
import ScrollToTop from "../components/common/scrolltoTop";
import CallHandler from "../components/twillio/CallHandler";
// import VideoCall from "../components/twillio/VideoCall";
import { getLocalStorage } from "../helpers/storage";
import TwillioCall from "../components/twillio/video";

const Routes = () => {
  const userData = getLocalStorage(STORAGE.USER_KEY);

  return (
    <BrowserRouter>
      {userData?.profile && (
        <CallHandler currentUserId={userData?.profile?._id} />
      )}
      <ScrollToTop />
      <Routing>
        {/* twillio  */}

        <Route path="/video-call" element={<TwillioCall />} />
        <Route path="/audio-call" element={<TwillioCall />} />
        {/* <Route path="/chat-call" element={<ChatRoom />} /> */}

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
        {/* static routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<CancellationRefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingDeliveryPolicy />} />
        <Route path="/contact" element={<Contact />} />

        {/* </PublicRoute> */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
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

        <Route path="/payment-status" element={<OrderSuccess />} />
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
