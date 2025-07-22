import React, { useState, useEffect, useRef } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import { callPostApi } from "../../../_service";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneCall,
  PhoneOff,
} from "lucide-react";
import AppointmentFormModal from "../successpage/callForm";
import AppointmentSuccessModal from "../successpage/callSuccess";
import { callSocket } from "../../../config/socket";
import { getLocalStorage } from "../../../helpers/storage";
import { STORAGE } from "../../../constants";

const VideoRoom = ({ appointmentId, token, handleLogout, mode, isDoctor, patientId, doctorId }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(mode?.toLowerCase() === "video");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  const screenTrack = useRef(null);

  useEffect(() => {
    let interval;
    if (participants.length !== 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [participants]);

  // Connect to the room when component mounts
  useEffect(() => {
    const participantConnected = (participant) => {
      console.log("Participant connected:", participant.identity);
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
      setCallStarted(true);
    };

    const participantDisconnected = (participant) => {
      console.log("Participant disconnected:", participant.identity);
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    console.log("🔗 Attempting to connect to Twilio room with:", {
      token: token ? `${token.substring(0, 20)}...` : "NULL",
      appointmentId,
      mode,
      tokenLength: token ? token.length : 0,
      isDoctor,
      patientId,
      doctorId
    });

    // Validate token before attempting connection
    if (!token) {
      console.error("❌ No token provided for Twilio connection");
      console.error("🔧 This usually means:");
      console.error("   1. Token generation failed on backend");
      console.error("   2. Twilio credentials are missing");
      console.error("   3. Network error occurred");
      return;
    }

    if (token.length < 100) {
      console.error("❌ Token seems too short, expected JWT format:", token);
      console.error("🔧 Received token length:", token.length);
      return;
    }

    console.log("✅ Token validation passed, proceeding with room connection...");

    // Connect to the Twilio video room
    const normalizedMode = mode?.toLowerCase();
    Video.connect(token, {
      name: appointmentId,
      audio: true,
      video: normalizedMode === "video",
    })
      .then((room) => {
        console.log("Connected to room:", room.name);
        setRoom(room);
        
        // Add local participant to the list
        setParticipants([room.localParticipant]);
        
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        
        // Add existing participants
        room.participants.forEach(participantConnected);
        
        // Log local participant tracks
        console.log("Local participant tracks:", {
          audio: room.localParticipant.audioTracks.size,
          video: room.localParticipant.videoTracks.size
        });
        

        // Ensure local audio track is published
        if (room.localParticipant.audioTracks.size === 0) {
          console.log("No local audio track found, creating one...");
          Video.createLocalAudioTrack().then(track => {
            room.localParticipant.publishTrack(track);
            console.log("Local audio track published");
          }).catch(error => {
            console.error("Failed to create local audio track:", error);
          });
        }

        // Ensure local video track is published for video calls
        if (normalizedMode === "video" && room.localParticipant.videoTracks.size === 0) {
          console.log("No local video track found, creating one...");
          Video.createLocalVideoTrack().then(track => {
            room.localParticipant.publishTrack(track);
            console.log("Local video track published");
          }).catch(error => {
            console.error("Failed to create local video track:", error);
          });
        }
      })
      .catch((error) => {
        console.error("❌ Error connecting to Twilio room:", error);
        console.error("🔧 Connection details:", {
          errorName: error.name,
          errorMessage: error.message,
          errorCode: error.code,
          appointmentId,
          tokenProvided: !!token
        });
        
        // Show user-friendly error message
        let errorMessage = "Failed to connect to video call. ";
        
        if (error.code === 20101) {
          errorMessage += "Invalid access token. Please try refreshing the page.";
        } else if (error.code === 53400) {
          errorMessage += "Room does not exist or has expired.";
        } else if (error.message.includes("network")) {
          errorMessage += "Network connection issue. Please check your internet.";
        } else if (error.message.includes("permission")) {
          errorMessage += "Camera/microphone permissions denied. Please allow access and try again.";
        } else {
          errorMessage += error.message || "Unknown error occurred.";
        }
        
        alert(errorMessage);
      });

    // Cleanup function to disconnect from the room when component unmounts
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [appointmentId, token, mode]);

  // Toggle audio
  const toggleAudio = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (isAudioEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (room && mode?.toLowerCase() === "video") {
      room.localParticipant.videoTracks.forEach((publication) => {
        if (isVideoEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia();
        const track = new Video.LocalVideoTrack(stream.getTracks()[0]);
        screenTrack.current = track;

        // Publish screen track
        await room.localParticipant.publishTrack(track);
        setIsScreenSharing(true);

        // When user stops screen sharing from browser UI
        track.on("ended", () => {
          room.localParticipant.unpublishTrack(track);
          track.stop();
          screenTrack.current = null;
          setIsScreenSharing(false);
        });
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    } else {
      // Stop screen sharing
      if (screenTrack.current) {
        room.localParticipant.unpublishTrack(screenTrack.current);
        screenTrack.current.stop();
        screenTrack.current = null;
        setIsScreenSharing(false);
      }
    }
  };

  const initiateCall = async () => {
    if (!token || !appointmentId) {
      console.error("Appointment ID or token is missing");
      return;
    }

    try {
      await callPostApi("doctor/call/start", {
        appointment_id: appointmentId,
        token: token,
        mode,
      });
      setCallStarted(true);
    } catch (error) {
      console.error("Call initiation failed:", error);
    }
  };

  // Handle room disconnect
  const leaveRoom = () => {
    if (room) {
      // Get the other participant's ID to notify them
      const otherParticipant = participants.find(p => p !== room.localParticipant);
      let otherUserId = null;
      
      if (otherParticipant) {
        otherUserId = otherParticipant.identity;
      } else {
        // Fallback: try to get user ID from localStorage or props
        const user = getLocalStorage(STORAGE.USER_KEY);
        if (user?.profile?._id) {
          // If we're the doctor, the other user is the patient, and vice versa
          otherUserId = isDoctor ? patientId : doctorId;
        }
      }
      
      console.log("Leaving room, notifying user:", otherUserId);
      
      // Emit call-end with the other user's ID (or null if not found)
      callSocket.emit("call-end", { 
        toUserId: otherUserId 
      });
      
      room.disconnect();
      if (isDoctor) {
        setShowFormModal(true);
      } else {
        setShowSuccessModal(true);
      }
      // handleLogout();
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Update appointment status to completed
      // await callPostApi(`appointment/${appointmentId}`, {
      //   status: "Completed",
      //   ...formData,
      // });

      // Close form modal and show success modal
      setShowFormModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment. Please try again.");
    }
  };

  const closeFormModal = () => {
    setShowFormModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    handleLogout();
  };

  // Helper functions for rendering audio call UI
  const renderAudioParticipant = (isLocal) => {
    const role = isLocal
      ? isDoctor
        ? "Doctor"
        : "Patient"
      : isDoctor
      ? "Patient"
      : "Doctor";
    const initial = role === "Doctor" ? "D" : "P";

    return (
      <div className="audio-participant">
        <div className="audio-avatar">
          <span className="participant-initial">{initial}</span>
        </div>
        <div className="participant-role">{role}</div>
      </div>
    );
  };

  const renderVideoContent = () => {
    if (!room) {
      return (
        <div className="connecting-status">
          <p>Connecting to room...</p>
          <div className="connection-details">
            <strong>Appointment:</strong> {appointmentId}<br/>
            <strong>Mode:</strong> {mode}<br/>
            <strong>Token:</strong> {token ? "✅ Provided" : "❌ Missing"}
          </div>
        </div>
      );
    }

    // Filter participants to show only local and one remote
    const localParticipant = room.localParticipant;
    const remoteParticipants = participants.filter(p => p !== localParticipant);
    const remoteParticipant = remoteParticipants[0]; // Only show the first remote participant

    return (
      <div className="video-room">
        {/* Meeting Info */}
        <div className="meeting-info">
          {seconds > 0 && <div className="timer">{formatTime(seconds)}</div>}
          <div className="meeting-id">ID: {appointmentId}</div>
        </div>

        {mode?.toLowerCase() === "video" ? (
          <div className="video-participants">
            {/* Remote participant (full screen) */}
            {remoteParticipant ? (
              <div className="remote-participant">
                <Participant
                  key={remoteParticipant.sid}
                  participant={remoteParticipant}
                  isLocal={false}
                />
              </div>
            ) : (
              <div className="remote-participant">
                <div className="connecting-status">
                  <p>Waiting for other participant to join...</p>
                </div>
              </div>
            )}
            
            {/* Local participant (picture-in-picture) */}
            <div className="local-participant">
              <Participant 
                participant={localParticipant} 
                isLocal={true} 
              />
            </div>
          </div>
        ) : (
          <div className="audio-placeholder">
            <h2>Audio Call</h2>
            <div className="audio-participants">
              {/* Local participant */}
              <div className="local-audio-participant">
                {renderAudioParticipant(true)}
              </div>
              
              {/* Remote participant */}
              {remoteParticipant ? (
                <div className="remote-audio-participant">
                  {renderAudioParticipant(false)}
                </div>
              ) : (
                <div className="remote-audio-participant">
                  <div className="audio-participant">
                    <div className="audio-avatar">
                      <span className="participant-initial">?</span>
                    </div>
                    <div className="participant-role">Waiting...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modern Controls */}
        <div className="controls">
          {isDoctor && !callStarted && (
            <button
              onClick={initiateCall}
              title="Start Call"
              className="control-button"
            >
              <PhoneCall />
            </button>
          )}
          <button
            onClick={toggleAudio}
            title={isAudioEnabled ? "Mute" : "Unmute"}
            className="control-button"
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </button>
          {mode?.toLowerCase() === "video" && (
            <button
              onClick={toggleVideo}
              title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
              className="control-button"
            >
              {isVideoEnabled ? <VideoIcon /> : <VideoOff />}
            </button>
          )}
          <button
            onClick={leaveRoom}
            title="End call"
            className="control-button"
          >
            <PhoneOff />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderVideoContent()}
      {showFormModal && (
        <AppointmentFormModal
          appointmentId={appointmentId}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      )}

      {showSuccessModal && (
        <AppointmentSuccessModal
          isDoctor={isDoctor}
          appointmentId={appointmentId}
          onClose={closeSuccessModal}
        />
      )}
    </>
  );
};

export default VideoRoom;
