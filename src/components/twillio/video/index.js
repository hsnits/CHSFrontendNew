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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("initializing");
  const location = useLocation();
  const navigate = useNavigate();

  const user = getLocalStorage?.(STORAGE.USER_KEY);
  const { patientId, doctorId, appointmentId, mode } = location.state || {};
  
  // Determine mode from URL if not provided in state
  const actualMode = mode || (window.location.pathname.includes('video') ? 'video' : 
                              window.location.pathname.includes('audio') ? 'audio' : 'video');

  const handleGetToken = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus(isRetry ? "retrying" : "connecting");
      
      const debugState = { patientId, doctorId, appointmentId, mode: actualMode };
      const debugUser = { user: !!user, userId: user?.profile?._id, userRole: user?.role };
      
            console.log("🔍 Video Call Debug - Navigation state:");
      console.table(debugState);
      console.log("🔍 Video Call Debug - User data:");
      console.table(debugUser);
      
      // Validation checks
      if (!appointmentId || !user) {
        throw new Error("Missing appointment or user data. Please try again from your dashboard.");
      }
      
      if (!user?.profile?._id) {
        throw new Error("User profile not found. Please try logging in again.");
      }
      
      setConnectionStatus("requesting_token");
      
      const tokenRequest = {
        mode: actualMode,
        identity: user?.profile?._id,
        roomName: appointmentId,
      };

      console.log("🔑 Token Request Details:");
      console.log("   Mode:", tokenRequest.mode);
      console.log("   Identity:", tokenRequest.identity);
      console.log("   Room Name:", tokenRequest.roomName);
      console.log("📤 Full Request:", tokenRequest);
      console.log("📡 API endpoint: doctor/token");
      console.log("🌐 Base URL:", process.env.REACT_APP_API_BASE_URL || "http://localhost:5000");
      
      const response = await callPostApi(`doctor/token`, tokenRequest);

      console.log("📥 Token response:", JSON.stringify(response, null, 2));
      console.log("📥 Token response status:", response?.status);
      console.log("📥 Token response data:", response?.data);
      console.log("📥 Actual token (first 50 chars):", response?.data?.token?.substring(0, 50) + "...");

      if (response?.status && response?.data?.token) {
        setConnectionStatus("joining_room");
        
        // Join socket rooms
        callSocket.emit("join-room", { userId: user?.profile?._id });
        if (patientId) {
          callSocket.emit("join-room", { userId: patientId });
        }
        
        setToken(response.data.token);
        setConnectionStatus("connected");
        setLoading(false);
        setRetryCount(0);
        console.log("✅ Token set successfully, starting video call...");
      } else {
        // Handle specific error cases
        let errorMsg = "Call setup failed: ";
        if (response?.message?.includes("TWILIO_NOT_CONFIGURED")) {
          errorMsg = "Video calling is not configured on this server. Please contact support.";
        } else if (response?.message?.includes("Invalid Access Token grants")) {
          errorMsg = "Call authentication failed. Please try again or contact support.";
        } else if (response?.message) {
          errorMsg += response.message;
        } else if (!response?.status) {
          errorMsg += "Server returned error status";
        } else if (!response?.data?.token) {
          errorMsg += "No token received from server";
        } else {
          errorMsg += "Unknown error";
        }
        
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      setLoading(false);
      setConnectionStatus("error");
      
      // Handle specific error types
      let errorMessage = "Failed to setup call. ";
      if (error.response?.status === 404) {
        errorMessage = "Call service not found. Please check if the server is running properly.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again in a few moments.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage += "Please check your connection and try again.";
      }
      
      setError(errorMessage);
    }
  }, [actualMode, appointmentId, user, patientId]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      handleGetToken(true);
    }
  }, [retryCount, handleGetToken]);

  const handleBackToDashboard = useCallback(() => {
    navigate(user?.role === "Doctor" ? "/DoctorDashboard" : "/patient", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!appointmentId) {
      setError("No appointment ID provided");
      setLoading(false);
      return;
    }
    
    console.log("🚀 useEffect: Calling handleGetToken for the first time");
    handleGetToken();
  }, [appointmentId]);

  const handleLogout = useCallback(() => {
    setToken(null);
    setLoading(false);
    setConnectionStatus("disconnected");
    navigate(user?.role === "Doctor" ? "/DoctorDashboard" : "/patient", {
      replace: true,
    });
  }, [user, navigate]);

  // Loading component
  const LoadingScreen = () => (
    <div className="call-loading-container">
      <div className="call-loading-content">
        <div className="loading-spinner"></div>
        <h3>
          {connectionStatus === "initializing" && "Initializing call..."}
          {connectionStatus === "connecting" && "Connecting to call service..."}
          {connectionStatus === "retrying" && `Retrying connection... (${retryCount}/3)`}
          {connectionStatus === "requesting_token" && "Requesting access token..."}
          {connectionStatus === "joining_room" && "Joining call room..."}
          {connectionStatus === "connected" && "Connected! Starting call..."}
        </h3>
        <p className="loading-subtitle">
          {connectionStatus === "requesting_token" && "Setting up video call credentials"}
          {connectionStatus === "joining_room" && "Preparing video/audio connection"}
          {connectionStatus === "retrying" && "Connection failed, trying again..."}
          {!["requesting_token", "joining_room", "retrying"].includes(connectionStatus) && "Please wait while we set up your call"}
        </p>
        
        {/* Connection details for debugging */}
        <div className="connection-details">
          <small>Mode: {actualMode} | Room: {appointmentId}</small>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorScreen = () => (
    <div className="call-error-container">
      <div className="call-error-content">
        <div className="error-icon">⚠️</div>
        <h3>Call Setup Failed</h3>
        <p className="error-message">{error}</p>
        
        <div className="error-actions">
          {retryCount < 3 ? (
            <button 
              className="btn-retry" 
              onClick={handleRetry}
              disabled={loading}
            >
              {loading ? "Retrying..." : `Retry (${retryCount}/3)`}
            </button>
          ) : (
            <p className="retry-limit">Maximum retry attempts reached</p>
          )}
          
          <button 
            className="btn-back" 
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
        </div>
        
        {/* Technical details for debugging */}
        <details className="error-details">
          <summary>Technical Details</summary>
          <div className="tech-details">
            <p><strong>Status:</strong> {connectionStatus}</p>
            <p><strong>Appointment ID:</strong> {appointmentId}</p>
            <p><strong>Mode:</strong> {mode}</p>
            <p><strong>User Role:</strong> {user?.role}</p>
            <p><strong>Retry Count:</strong> {retryCount}</p>
          </div>
        </details>
      </div>
    </div>
  );

  return (
    <div className="app-video">
      <div className="header-video">
        <img
          src={ChsLogo}
          style={{ height: 50 }}
          className="img-fluid"
          alt="Logo"
        />
        <div className="header-info">
          <h2>{mode?.charAt(0).toUpperCase() + mode?.slice(1) || "Video"} Consultation</h2>
          {connectionStatus && (
            <span className={`connection-status status-${connectionStatus}`}>
              {connectionStatus.replace("_", " ").toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      <main className="main-video">
        {loading && <LoadingScreen />}
        
        {error && !loading && <ErrorScreen />}
        
        {token && !loading && !error && (
          <>
            {actualMode !== "chat" ? (
              <VideoRoom
                appointmentId={appointmentId}
                token={token}
                handleLogout={handleLogout}
                mode={actualMode}
                isDoctor={user?.role === "Doctor"}
                patientId={patientId}
                doctorId={doctorId}
              />
            ) : (
              <ChatRoom roomName={appointmentId} token={token} />
            )}
          </>
        )}
      </main>
      
      <div className="footer-video">
        <p>Powered by CHS Healthcare | Secure & Encrypted</p>
      </div>
    </div>
  );
}

export default TwillioCall;
