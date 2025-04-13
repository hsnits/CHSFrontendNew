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

const VideoRoom = ({ appointmentId, token, handleLogout, mode, isDoctor }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(mode === "video");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    // Connect to the Twilio video room
    Video.connect(token, {
      name: appointmentId,
      audio: true,
      video: mode === "video",
    })
      .then((room) => {
        setRoom(room);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      })
      .catch((error) => {
        console.error("Error connecting to room:", error);
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
    if (room) {
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
    } catch (error) {
      console.error("Call initiation failed:", error);
    }
  };

  // Handle room disconnect
  const leaveRoom = () => {
    if (room) {
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
      await callPostApi(`appointment/${appointmentId}`, {
        status: "Completed",
        ...formData
      });
      
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
    // If you want to fully exit the call when modal is closed
    handleLogout();
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // This will call the original handleLogout from props
    handleLogout();
  };

  const renderVideoContent = () => {
    if (!room) {
      return <p>Connecting to room...</p>;
    }

    return (
      <div className="video-room">
        {seconds > 0 && <div className="timer">{formatTime(seconds)}</div>}

        {mode === "video" ? (
          <>
            <div className="remote-participants">
              {participants.map((participant) => (
                <Participant
                  key={participant.sid}
                  participant={participant}
                  isLocal={false}
                />
              ))}
            </div>
            <div className="local-participant">
              <Participant participant={room.localParticipant} isLocal={true} />
            </div>
          </>
        ) : (
          <div className="audio-placeholder">
            <h2>Audio Call Ongoing</h2>
          </div>
        )}

        <div className="controls">
          {isDoctor && (
            <button onClick={initiateCall} title="Start Call">
              <PhoneCall />
            </button>
          )}
          <button onClick={toggleAudio} title="Toggle Audio">
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </button>
          {mode === "video" && (
            <button onClick={toggleVideo} title="Toggle Video">
              {isVideoEnabled ? <VideoIcon /> : <VideoOff />}
            </button>
          )}
          <button onClick={toggleScreenShare} title="Share Screen">
            {isScreenSharing ? <MonitorOff /> : <Monitor />}
          </button>
          <button onClick={leaveRoom} title="Leave Room">
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