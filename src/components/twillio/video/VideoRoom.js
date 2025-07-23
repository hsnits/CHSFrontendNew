import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [connectionState, setConnectionState] = useState("connecting");
  const [connectionError, setConnectionError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Get user data from localStorage
  const user = getLocalStorage(STORAGE.USER_KEY);

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

  // Helper functions for participant management
  const participantConnected = useCallback((participant) => {
    console.log("✅ Participant connected:", participant.identity);
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
    setCallStarted(true);
    setConnectionState("connected");
  }, []);

  const participantDisconnected = useCallback((participant) => {
    console.log("❌ Participant disconnected:", participant.identity);
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  }, []);

  // Connect to room function
  const connectToRoom = useCallback(async () => {
      if (!token || connectionState === "room_joined") return;

      try {
        setConnectionState("establishing");
        setRetryAttempt(prev => prev + 1);

        if (room) {
          try {
            room.disconnect();
          } catch (error) {
            console.error("Error disconnecting from existing room:", error);
          }
          setRoom(null);
          setParticipants([]);
        }

        // Create local tracks first (like working DoctorCall.js)
        const normalizedMode = mode?.toLowerCase();
        
        const tracks = [];
        const trackCreationPromises = [];
        
        // Always create audio track for both audio and video calls
        trackCreationPromises.push(
          Video.createLocalAudioTrack({
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }).then(audioTrack => {
            tracks.push(audioTrack);
            console.log("✅ Local audio track created");
            return audioTrack;
          }).catch(error => {
            console.error("❌ Failed to create local audio track:", error);
            return null;
          })
        );
        
        // Create video track for video calls
        if (normalizedMode === "video") {
          trackCreationPromises.push(
            Video.createLocalVideoTrack({
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 30 }
            }).then(videoTrack => {
              tracks.push(videoTrack);
              console.log("✅ Local video track created");
              return videoTrack;
            }).catch(error => {
              console.error("❌ Failed to create local video track:", error);
              return null;
            })
          );
        }

        // Wait for all tracks to be created
        await Promise.allSettled(trackCreationPromises);
        
        console.log(`📹 Created ${tracks.length} local tracks (audio + ${normalizedMode === "video" ? "video" : "audio-only"})`);

        // Connect to the Twilio video room with tracks
        const newRoom = await Video.connect(token, {
          name: appointmentId,
          tracks: tracks.filter(track => track !== null), // Filter out any null tracks
          dominantSpeaker: true,
          maxAudioBitrate: 16000,
          preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
          networkQuality: { local: 1, remote: 1 }
        });

        console.log("✅ Connected to room:", newRoom.name);
        console.log("📊 Local participant tracks:", newRoom.localParticipant.tracks.size);
        
        setRoom(newRoom);
        setConnectionState("room_joined");
        
        // Add local participant to the list
        setParticipants([newRoom.localParticipant]);
        
        // Set up event listeners
        newRoom.on("participantConnected", participantConnected);
        newRoom.on("participantDisconnected", participantDisconnected);
        newRoom.on("disconnected", (room) => {
          console.log("📴 Room disconnected:", room);
          setConnectionState("disconnected");
          setRoom(null);
          setParticipants([]);
        });
        
        // Handle existing participants
        newRoom.participants.forEach(participantConnected);

        // Reset retry attempt on successful connection
        setRetryAttempt(0);
        
      } catch (error) {
        console.error("❌ Error connecting to room:", error);
        setConnectionState("error");
        setConnectionError(error.message);
        
      }
  }, [token, appointmentId, mode, participantConnected, participantDisconnected]);

  // Handle retry logic separately to avoid circular dependencies
  useEffect(() => {
    if (connectionState === "error" && retryAttempt < 3) {
      const delay = Math.pow(2, retryAttempt) * 1000; // 1s, 2s, 4s
      console.log(`🔄 Retrying connection in ${delay}ms (attempt ${retryAttempt + 1}/3)`);
      const timeoutId = setTimeout(() => {
        connectToRoom();
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [connectionState, retryAttempt, connectToRoom]);

  // Connect to the room when component mounts
  useEffect(() => {
    if (token && connectionState === "connecting") {
      connectToRoom();
    }
  }, [token, connectToRoom]);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      if (room) {
        console.log("🧹 Cleaning up room connection");
        room.disconnect();
        setRoom(null);
        setParticipants([]);
        setConnectionState("disconnected");
      }
    };
  }, [room]);

  // Retry connection function
  const retryConnection = () => {
    if (retryAttempt < 3) {
      setConnectionError(null);
      setConnectionState("connecting");
    }
  };

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
    // Show connection status if not ready
    if (connectionState !== "ready" && connectionState !== "connected") {
      return (
        <div className="connection-status-container">
          <div className="connection-status-content">
            {connectionState === "error" ? (
              <>
                <div className="error-icon">❌</div>
                <h3>Connection Failed</h3>
                <p className="error-message">{connectionError}</p>
                <div className="error-actions">
                  {retryAttempt < 3 ? (
                    <button 
                      className="btn-retry" 
                      onClick={retryConnection}
                    >
                      Retry ({retryAttempt}/3)
                    </button>
                  ) : (
                    <p className="retry-limit">Maximum retry attempts reached</p>
                  )}
                  <button 
                    className="btn-back" 
                    onClick={handleLogout}
                  >
                    Leave Call
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="loading-spinner"></div>
                <h3>
                  {connectionState === "connecting" && "Connecting to call..."}
                  {connectionState === "establishing" && "Establishing connection..."}
                  {connectionState === "room_joined" && "Joined room successfully"}
                  {connectionState === "media_setup" && "Setting up audio/video..."}
                </h3>
                <p className="status-subtitle">
                  {connectionState === "connecting" && "Please wait while we connect you"}
                  {connectionState === "establishing" && "Securing video connection"}
                  {connectionState === "room_joined" && "Preparing media streams"}
                  {connectionState === "media_setup" && "Almost ready..."}
                </p>
                <div className="connection-details">
                  <small>Room: {appointmentId} | Mode: {mode || "video"} | Attempt: {retryAttempt + 1}</small>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    if (!room) {
      return (
        <div className="connection-status-container">
          <div className="connection-status-content">
            <div className="loading-spinner"></div>
            <h3>Initializing room...</h3>
          </div>
        </div>
      );
    }

    // Filter participants to show only local and one remote
    const localParticipant = room.localParticipant;
    const remoteParticipants = participants.filter(p => p !== localParticipant);
    const remoteParticipant = remoteParticipants[0]; // Only show the first remote participant

    // Add stable rendering with transition states
    const isVideoMode = mode?.toLowerCase() === "video";
    const hasRemoteParticipant = remoteParticipant && remoteParticipant.state === "connected";

    return (
      <div className="google-meet-container">
        {/* Meeting Header */}
        <div className="meeting-header">
          <div className="meeting-info">
            <h3 className="meeting-title">Healthcare Consultation</h3>
            <span className="meeting-id">ID: {appointmentId}</span>
          </div>
          <div className="meeting-time">
            {seconds > 0 && <span className="timer">{formatTime(seconds)}</span>}
          </div>
        </div>

        {/* Main Video Area */}
        <div className="main-video-area">
          {isVideoMode ? (
            <div className="video-grid">
              {/* Main speaker view */}
              <div className="main-speaker">
                {hasRemoteParticipant ? (
                  <div className="participant-container">
                    <Participant
                      key={remoteParticipant.sid}
                      participant={remoteParticipant}
                      isLocal={false}
                    />
                    <div className="participant-info">
                      <span className="participant-name">
                        {isDoctor ? 'Patient' : 'Dr. ' + (remoteParticipant.identity || 'Doctor')}
                      </span>
                      <div className="connection-indicator">
                        <div className="signal-bars">
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="waiting-participant">
                    <div className="waiting-avatar">
                      <div className="avatar-placeholder">
                        {isDoctor ? 'P' : 'D'}
                      </div>
                    </div>
                    <p className="waiting-text">
                      Waiting for {isDoctor ? 'patient' : 'doctor'} to join...
                    </p>
                  </div>
                )}
              </div>

              {/* Local participant (picture-in-picture) */}
              <div className="local-participant-pip">
                <div className="participant-container">
                  <Participant 
                    participant={localParticipant} 
                    isLocal={true} 
                  />
                  <div className="participant-info">
                    <span className="participant-name">You</span>
                    <div className="local-indicator">
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="6" fill="#34a853"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Audio Call Interface */
            <div className="audio-call-interface">
              <div className="audio-header">
                <h2 className="audio-title">Audio Call</h2>
                <p className="audio-subtitle">Healthcare Consultation</p>
              </div>
              
              <div className="audio-participants-grid">
                {/* Local participant */}
                <div className="audio-participant local">
                  <div className="audio-avatar">
                    <span className="avatar-text">
                      {isDoctor ? 'Dr' : (user?.profile?.firstName?.[0] || 'P')}
                    </span>
                    <div className={`audio-indicator ${isAudioEnabled ? 'speaking' : 'muted'}`}>
                      {isAudioEnabled ? (
                        <div className="sound-waves">
                          <div className="wave"></div>
                          <div className="wave"></div>
                          <div className="wave"></div>
                        </div>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="participant-details">
                    <h4 className="participant-name">You</h4>
                    <p className="participant-role">{isDoctor ? 'Doctor' : 'Patient'}</p>
                  </div>
                </div>

                {/* Remote participant */}
                {hasRemoteParticipant ? (
                  <div className="audio-participant remote">
                    <div className="audio-avatar">
                      <span className="avatar-text">
                        {isDoctor ? 'P' : 'Dr'}
                      </span>
                      <div className="audio-indicator speaking">
                        <div className="sound-waves">
                          <div className="wave"></div>
                          <div className="wave"></div>
                          <div className="wave"></div>
                        </div>
                      </div>
                    </div>
                    <div className="participant-details">
                      <h4 className="participant-name">
                        {isDoctor ? 'Patient' : 'Doctor'}
                      </h4>
                      <p className="participant-role">{isDoctor ? 'Patient' : 'Healthcare Provider'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="audio-participant waiting">
                    <div className="audio-avatar waiting">
                      <span className="avatar-text">
                        {isDoctor ? 'P' : 'Dr'}
                      </span>
                      <div className="waiting-indicator">
                        <div className="pulse"></div>
                      </div>
                    </div>
                    <div className="participant-details">
                      <h4 className="participant-name">
                        Waiting for {isDoctor ? 'patient' : 'doctor'}...
                      </h4>
                      <p className="participant-role">Connecting...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Controls Bar */}
        <div className="google-meet-controls">
          <div className="controls-section left">
            <div className="meeting-code">
              <span>Room: {appointmentId}</span>
            </div>
          </div>
          
          <div className="controls-section center">
            {isDoctor && !callStarted && (
              <button
                onClick={initiateCall}
                className="control-btn call-btn"
                title="Start Call"
              >
                <PhoneCall size={20} />
                <span className="btn-label">Start Call</span>
              </button>
            )}
            
            <button
              onClick={toggleAudio}
              className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            {isVideoMode && (
              <button
                onClick={toggleVideo}
                className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? <VideoIcon size={20} /> : <VideoOff size={20} />}
              </button>
            )}
            
            {isDoctor && (
              <button
                onClick={leaveRoom}
                className="control-btn end-call-btn"
                title="End Call"
              >
                <PhoneOff size={20} />
              </button>
            )}
          </div>
          
          <div className="controls-section right">
            <div className="participant-count">
              <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
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
