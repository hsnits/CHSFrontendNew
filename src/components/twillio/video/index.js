import React, { useState, useCallback, useEffect } from "react";
import "./index.css";
import VideoRoom from "./VideoRoom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../../helpers/storage";
import { STORAGE } from "../../../constants";
import { callPostApi } from "../../../_service";
import { callSocket } from "../../../config/socket";
import ChatRoom from "../ChatRoom";
import ChsLogo from "../../../assets/img/chs_logo.png";

function TwillioCall() {
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const user = getLocalStorage?.(STORAGE.USER_KEY);
  const { patientId, doctorId, appointmentId, mode } = location.state || {};

  const handleGetToken = useCallback(async () => {
    const callSocketNew = callSocket;
    try {
      if (!appointmentId || !user) return;
      const response = await callPostApi(`doctor/token`, {
        mode: mode || "audio",
        identity: user?.profile?._id,
        roomName: appointmentId,
      });

      if (response?.status) {
        callSocketNew.emit("join-room", { userId: user?.profile?._id });
        callSocketNew.emit("join-room", { userId: patientId });
        setToken(response?.data?.token);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }, [mode, appointmentId, user]);

  useEffect(() => {
    if (!appointmentId) {
      navigate("/", { replace: true });
    } else {
      handleGetToken();
    }
  }, [appointmentId, handleGetToken, navigate]);

  const handleLogout = useCallback(() => {
    setToken(null);
    navigate(user?.role == "Doctor" ? "/DoctorDashboard" : "/patient", {
      replace: true,
    });
  }, []);

  return (
    <div className="app-video">
      <div className="header-video">
        <img
          src={ChsLogo}
          style={{ height: 50 }}
          className="img-fluid"
          alt="Logo"
        />
        {/* <h1>CHS Appointment</h1> */}
      </div>
      <main className="main-video">
        {token ? (
          <>
            {mode !== "chat" ? (
              <VideoRoom
                appointmentId={appointmentId}
                token={token}
                handleLogout={handleLogout}
                mode={mode || "audio"}
                isDoctor={user?.role == "Doctor"}
                patientId={patientId}
                doctorId={doctorId}
              />
            ) : (
              <ChatRoom roomName={appointmentId} token={token} />
            )}
          </>
        ) : (
          <h2>Connecting...</h2>
        )}
      </main>
      <div className="footer-video">
        <p>Powered by CHS Healthcare</p>
      </div>
    </div>
  );
}

export default TwillioCall;
