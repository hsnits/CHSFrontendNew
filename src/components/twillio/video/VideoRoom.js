// Google Meet–style layout refactor
import React, { useState, useEffect, useRef, useCallback } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import { callPostApi } from "../../../_service";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
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

  // Debug: log participants and localParticipant whenever they change
  useEffect(() => {
    const localParticipant = room?.localParticipant;
    console.log('[VideoRoom] participants:', participants.map(p => p.identity));
    console.log('[VideoRoom] localParticipant:', localParticipant?.identity);
  }, [participants, room]);

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

  // Replace renderVideoContent with Google Meet–style layout
  const renderMeetLayout = () => {
    const localParticipant = room?.localParticipant;
    const remoteParticipants = participants.filter(p => p !== localParticipant);
    const remoteParticipant = remoteParticipants[0];
    const isVideoMode = mode?.toLowerCase() === "video";
    const hasRemote = remoteParticipant && remoteParticipant.state === "connected";

    return (
      <div className="meet-root" style={{height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#181c24'}}>
        {/* Main video area */}
        <div className="meet-main" style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          {/* Remote video or placeholder */}
          <div className="meet-remote" style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {hasRemote ? (
              <Participant participant={remoteParticipant} isLocal={false} />
            ) : (
              <div className="meet-placeholder" style={{color: '#fff', fontSize: 24, textAlign: 'center'}}>
                Waiting for {isDoctor ? 'patient' : 'doctor'} to join...
              </div>
            )}
          </div>
          {/* Local PiP - always render, with fallback if no video */}
          <div className="meet-pip" style={{position: 'absolute', bottom: 32, right: 32, width: 200, height: 120, background: '#222', borderRadius: 12, boxShadow: '0 2px 12px #0008', overflow: 'hidden', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {localParticipant ? (
              <Participant participant={localParticipant} isLocal={true} />
            ) : (
              <div style={{color: '#fff', fontSize: 14, textAlign: 'center'}}>No local video</div>
            )}
            <div className="meet-pip-label" style={{color: '#fff', fontSize: 12, marginTop: 2}}>You</div>
          </div>
          {/* Timer and names */}
          <div className="meet-header" style={{position: 'absolute', top: 24, left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
            <div style={{background: '#222b', color: '#fff', borderRadius: 8, padding: '4px 16px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 16}}>
              <span>{isDoctor ? 'Doctor' : 'Patient'}: You</span>
              {hasRemote && <span>{isDoctor ? 'Patient' : 'Doctor'}: {remoteParticipant.identity || 'Remote'}</span>}
              {seconds > 0 && <span className="meet-timer">{formatTime(seconds)}</span>}
            </div>
          </div>
        </div>
        {/* Controls bar - always render */}
        <div className="meet-controls" style={{height: 80, width: '100%', position: 'absolute', bottom: 0, right:0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32}}>
          <button onClick={toggleAudio} className="meet-btn" style={{background: 'none', border: 'none', color: isAudioEnabled ? '#fff' : '#f44336', fontSize: 28, margin: '0 12px', cursor: 'pointer'}} title={isAudioEnabled ? 'Mute' : 'Unmute'}>
            {isAudioEnabled ? <Mic size={32} /> : <MicOff size={32} />}
          </button>
          {isVideoMode && (
            <button onClick={toggleVideo} className="meet-btn" style={{background: 'none', border: 'none', color: isVideoEnabled ? '#fff' : '#f44336', fontSize: 28, margin: '0 12px', cursor: 'pointer'}} title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
              {isVideoEnabled ? <VideoIcon size={32} /> : <VideoOff size={32} />}
            </button>
          )}
          <button onClick={leaveRoom} className="meet-btn" style={{background: '#f44336', border: 'none', color: '#fff', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 12px', cursor: 'pointer'}} title="End Call">
            <PhoneOff size={32} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Only show the video overlay if not showing a modal */}
      {(!showFormModal && !showSuccessModal) && renderMeetLayout()}
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
