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
      if (!appointmentId || !user) {
        console.error("Missing required data:", { appointmentId, user: !!user });
        return;
      }
      
      console.log("Requesting token with:", {
        mode: mode || "audio",
        identity: user?.profile?._id,
        roomName: appointmentId,
      });

      const response = await callPostApi(`doctor/token`, {
        mode: mode || "audio",
        identity: user?.profile?._id,
        roomName: appointmentId,
      });

      console.log("🔑 Token response:", response);

      if (response?.status && response?.data?.token) {
        callSocketNew.emit("join-room", { userId: user?.profile?._id });
        if (patientId) {
          callSocketNew.emit("join-room", { userId: patientId });
        }
        setToken(response?.data?.token);
        console.log("✅ Token set successfully");
      } else {
        console.error("❌ Token request failed:", response);
        // Show detailed error message
        let errorMessage = "Failed to setup video call. ";
        if (response?.message) {
          errorMessage += response.message;
        } else if (response?.data?.message) {
          errorMessage += response.data.message;
        } else {
          errorMessage += "Please check if Twilio is configured and try again.";
        }
        
        alert(errorMessage);
        console.error("🔑 Token generation failed - this usually means Twilio credentials are missing");
        
        // Navigate back to dashboard if token fails
        navigate(user?.role === "Doctor" ? "/DoctorDashboard" : "/patient", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      
      // Show detailed error to user
      let errorMessage = "Failed to setup call. ";
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please check your connection and try again.";
      }
      
      alert(errorMessage);
    }
  }, [mode, appointmentId, user, patientId]);

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
          alt="CHS Healthcare"
        />
        <span>CHS Healthcare - {mode === "video" ? "Video" : "Audio"} Consultation</span>
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
