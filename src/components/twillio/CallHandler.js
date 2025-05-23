import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callSocket } from "../../config/socket";
import "./chathandler.css";
import { callPostApi } from "../../_service";

const CallHandler = ({ currentUserId }) => {
  const [incoming, setIncoming] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;

    const handleIncomingCall = ({ appointment_id, doctor_id, mode,token }) => {
      console.log("Incoming call received:", {
        appointment_id,
        doctor_id,
        mode,
        token,
      });
      setIncoming({ appointment_id, doctor_id, mode, token });

      // Play sound for incoming call
      const audio = new Audio("/sounds/ringtone.mp3"); // Add a ringtone to your public folder
      audio.loop = true;
      audio.play().catch((error) => console.log("Audio play failed:", error));

      // Store audio element for cleanup
      window.incomingCallAudio = audio;
    };

    callSocket.emit("join-room", { userId: currentUserId });
    callSocket.on("incoming-call", handleIncomingCall);

    return () => {
      callSocket.off("incoming-call", handleIncomingCall);
      if (window.incomingCallAudio) {
        window.incomingCallAudio.pause();
        window.incomingCallAudio = null;
      }
    };
  }, [currentUserId]);

  const handleAccept = async () => {
    // Stop ringtone
    if (window.incomingCallAudio) {
      window.incomingCallAudio.pause();
      window.incomingCallAudio = null;
    }

    try {
      const res = await callPostApi("patient/call/respond", {
        appointment_id: incoming?.appointment_id,
        patient_id: currentUserId,
        doctor_id: incoming?.doctor_id,
        response: "accept",
      });

      if (res?.status) {
        navigate(`/${incoming?.mode}-call`, {
          state: {
            patientId: currentUserId,
            doctorId: incoming?.doctor_id,
            appointmentId: incoming?.appointment_id,
            mode: incoming?.mode,
          },
        });
        setIncoming(null);
      } else {
        console.error("Failed to accept call:", res);
        // Show error message
      }
    } catch (error) {
      console.error("Error accepting call:", error);
      // Show error message
    }
  };

  const handleDecline = async () => {
    // Stop ringtone
    if (window.incomingCallAudio) {
      window.incomingCallAudio.pause();
      window.incomingCallAudio = null;
    }

    try {
      await callPostApi("patient/call/respond", {
        appointment_id: incoming?.appointment_id,
        patient_id: currentUserId,
        doctor_id: incoming?.doctor_id,
        response: "decline",
      });

      // Also emit socket event for immediate notification
      callSocket.emit("decline-call", { toUserId: incoming?.doctor_id });
      setIncoming(null);
    } catch (error) {
      console.error("Error declining call:", error);
      // Still clear the incoming call UI
      setIncoming(null);
    }
  };

  if (!incoming) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Incoming {incoming?.mode} call</h3>
        <p>Doctor is calling you</p>
        <div className="popup-buttons">
          <button className="accept-btn" onClick={handleAccept}>
            Accept
          </button>
          <button className="decline-btn" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallHandler;
