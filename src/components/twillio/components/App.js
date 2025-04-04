import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import VideoRoom from "./VideoRoom";
import { useLocation, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../../helpers/storage";
import { STORAGE } from "../../../constants";
import { callPostApi } from "../../../_service";
import { callSocket } from "../../../config/socket";

function TwillioCall() {
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const user = getLocalStorage?.(STORAGE.USER_KEY);
  const { patientId, doctorId, appointmentId, mode } = location.state || {};

  const handleGetToken = useCallback(async () => {
    try {
      if (!appointmentId || !user) return;
      const response = await callPostApi(`doctor/token`, {
        mode: mode || "audio",
        identity: user?.profile?._id,
        roomName: appointmentId,
      });

      if (response?.status) {
        callSocket.emit("join-room", { userId: user?.profile?._id });
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
    <div className="app">
      <header>
        <h1>CHS Appointment</h1>
      </header>
      <main>
        {token ? (
          <VideoRoom
            appointmentId={appointmentId}
            token={token}
            handleLogout={handleLogout}
            mode={mode || "audio"}
          />
        ) : (
          <h2>Connecting...</h2>
        )}
      </main>
      <footer>
        <p>Powered by Twilio Programmable Video</p>
      </footer>
    </div>
  );
}

export default TwillioCall;
