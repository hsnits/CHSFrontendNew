import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import {
  connect,
  createLocalVideoTrack,
  createLocalAudioTrack,
} from "twilio-video";
import {  symptomSocket } from "../../../config/socket";
import { callPostApi } from "../../../_service";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const DoctorCall = ({ doctorId, patientId, appointmentId, role, mode }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [twilioToken, setTwilioToken] = useState(null);
  const [callDeclined, setCallDeclined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(mode === "video");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const roomRef = useRef(null);
  const localTracks = useRef([]);

  useEffect(() => {
    if (!doctorId && !patientId) return;
    
    const userId = role === "doctor" ? doctorId : patientId;
    
    // Socket connection
    const socket = symptomSocket;
    socket.emit("join-room", { userId });

    // Socket event listeners
    const handleCallAccepted = async ({ token, roomName }) => {
      console.log("Call accepted with token:", token);
      setTwilioToken(token);
      startTwilioCall(token, roomName);
      setInCall(true);
      setIsCalling(false);
    };

    const handleCallDeclined = () => {
      console.log("Call declined");
      setCallDeclined(true);
      setIsCalling(false);
      
      // Reset after a few seconds
      setTimeout(() => {
        setCallDeclined(false);
      }, 5000);
    };

    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-declined", handleCallDeclined);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-declined", handleCallDeclined);
      endCall();
    };
  }, [doctorId, patientId, role]);

  const initiateCall = async () => {
    if (!doctorId || !appointmentId || !patientId) {
      console.error("Doctor ID, Patient ID or Appointment ID is missing");
      return;
    }

    setIsCalling(true);
    setCallDeclined(false);

    try {
      const response = await callPostApi("doctor/call/start", {
        doctor_id: doctorId,
        appointment_id: appointmentId,
        patient_id: patientId,
        mode,
      });

      if (response?.status && response?.data.token) {
        setTwilioToken(response.data.token);
        // Don't start the call yet - wait for patient acceptance
      } else {
        setIsCalling(false);
        console.error("Failed to get token:", response);
      }
    } catch (error) {
      setIsCalling(false);
      console.error("Call initiation failed:", error);
    }
  };

  const toggleMic = () => {
    if (!roomRef.current) return;
    
    localTracks.current.forEach(track => {
      if (track.kind === 'audio') {
        if (micOn) {
          track.disable();
        } else {
          track.enable();
        }
      }
    });
    
    setMicOn(!micOn);
  };

  const toggleVideo = () => {
    if (!roomRef.current || mode !== "video") return;
    
    localTracks.current.forEach(track => {
      if (track.kind === 'video') {
        if (videoOn) {
          track.disable();
        } else {
          track.enable();
        }
      }
    });
    
    setVideoOn(!videoOn);
  };

  const startTwilioCall = async (token, rName) => {
    try {
      // Clean up any existing tracks
      localTracks.current.forEach(track => track.stop());
      localTracks.current = [];
      
      // Create new tracks
      const tracks = [];
      
      if (mode === "video") {
        try {
          const videoTrack = await createLocalVideoTrack({
            width: 640,
            height: 480,
            frameRate: 24
          });
          tracks.push(videoTrack);
          localTracks.current.push(videoTrack);
          
          // Attach local video to DOM
          if (localVideoRef.current) {
            const videoElements = videoTrack.attach();
            localVideoRef.current.innerHTML = '';
            localVideoRef.current.appendChild(videoElements);
          }
        } catch (e) {
          console.error("Error creating video track:", e);
        }
      }
      
      try {
        const audioTrack = await createLocalAudioTrack();
        tracks.push(audioTrack);
        localTracks.current.push(audioTrack);
      } catch (e) {
        console.error("Error creating audio track:", e);
      }
      
      // Connect to room
      const roomName = rName || `appointment-${appointmentId}`;
      console.log("Connecting to room:", roomName);
      
      const room = await connect(token, {
        name: roomName,
        tracks,
        dominantSpeaker: true,
        maxAudioBitrate: 16000,
        preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
      });
      
      console.log("Connected to room:", room.name);
      roomRef.current = room;
      setInCall(true);

      // Handle remote participants that may already be connected
      room.participants.forEach(participant => {
        handleParticipantConnected(participant);
      });

      // Handle participants connecting
      room.on('participantConnected', participant => {
        console.log(`Participant connected: ${participant.identity}`);
        handleParticipantConnected(participant);
      });

      // Handle room disconnection
      room.on('disconnected', () => {
        console.log('Disconnected from room');
        setInCall(false);
      });
      
    } catch (error) {
      console.error("Error connecting to Twilio:", error);
      setInCall(false);
    }
  };

  const handleParticipantConnected = (participant) => {
    // Handle participant's existing tracks
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        handleTrackSubscribed(publication.track);
      }
    });
    
    // Handle new track subscriptions
    participant.on('trackSubscribed', handleTrackSubscribed);
    
    // Handle track unsubscriptions
    participant.on('trackUnsubscribed', track => {
      if (track.kind === 'video' && remoteVideoRef.current) {
        // Remove the track element
        const elements = remoteVideoRef.current.getElementsByTagName(track.kind);
        while (elements[0]) {
          elements[0].remove();
        }
      }
    });
  };

  const handleTrackSubscribed = (track) => {
    if (track.kind === 'video' && remoteVideoRef.current) {
      const element = track.attach();
      element.style.width = '100%';
      element.style.height = '100%';
      remoteVideoRef.current.innerHTML = '';
      remoteVideoRef.current.appendChild(element);
    } else if (track.kind === 'audio') {
      document.body.appendChild(track.attach());
    }
  };

  const endCall = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    
    // Stop and clean up local tracks
    localTracks.current.forEach(track => {
      track.stop();
    });
    localTracks.current = [];
    
    // Clean up video elements
    if (localVideoRef.current) {
      localVideoRef.current.innerHTML = '';
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = '';
    }
    
    setInCall(false);
    setIsCalling(false);
    setTwilioToken(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative">
      <h1 className="text-lg font-semibold absolute top-4 left-4">
        {role.charAt(0).toUpperCase() + role.slice(1)} {mode === "video" ? "Video" : "Audio"} Call
      </h1>

      {/* Video Call Container */}
      {mode === "video" && (
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          {/* Remote Video (Full Screen) */}
          <div
            ref={remoteVideoRef}
            className="w-full h-full bg-gray-800 rounded-xl border-4 border-orange-500 overflow-hidden"
          >
            {!inCall && (
              <div className="flex items-center justify-center h-full text-gray-400">
                {isCalling ? "Calling..." : "No connection"}
              </div>
            )}
          </div>

          {/* Local Video (Small Preview - Top Right) */}
          <div className="absolute top-4 right-4 w-32 h-40 bg-gray-600 rounded-md border-2 border-blue-400 overflow-hidden">
            <div ref={localVideoRef} className="w-full h-full"></div>
          </div>
        </div>
      )}

      {/* Audio Call Placeholder (If No Video) */}
      {mode === "audio" && (
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border-4 border-blue-500">
            <Mic size={50} />
          </div>
          
          {callDeclined && (
            <div className="absolute top-1/2 text-red-500 text-xl">
              Call declined
            </div>
          )}
          
          {isCalling && !inCall && !callDeclined && (
            <div className="absolute top-1/2 mt-16 text-white text-xl">
              Calling...
            </div>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute bottom-6 flex gap-4 bg-gray-900 p-4 rounded-lg shadow-md">
        {role === "doctor" && !inCall && !isCalling && (
          <Button
            onClick={initiateCall}
            className="bg-green-500 text-white px-6 py-2 rounded-lg"
            disabled={isCalling}
          >
            {isCalling ? "Calling..." : "Start Call"}
          </Button>
        )}

        {inCall && (
          <>
            <Button
              onClick={toggleMic}
              className={`px-4 py-2 rounded-full ${
                micOn ? "bg-gray-700" : "bg-red-500"
              }`}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>

            {mode === "video" && (
              <Button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded-full ${
                  videoOn ? "bg-gray-700" : "bg-red-500"
                }`}
              >
                {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
            )}
          </>
        )}

        <Button
          onClick={endCall}
          className="bg-red-600 text-white px-6 py-2 rounded-lg"
          disabled={!inCall && !isCalling}
        >
          <PhoneOff size={20} />
        </Button>
      </div>

      {callDeclined && (
        <p className="text-red-500 absolute top-4 right-4">
          Call was declined.
        </p>
      )}
    </div>
  );
};

export default DoctorCall;