import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callSocket } from "../../config/socket";
import "./chathandler.css";
import { callPostApi } from "../../_service";

const CallHandler = ({ currentUserId }) => {
  const [incoming, setIncoming] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  // Initialize audio context and load ringtone
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Create audio context
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);

        // Load ringtone audio file
        const response = await fetch("/sounds/ringtone.mp3");
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);
        
        console.log("Audio initialized successfully");
      } catch (error) {
        console.error("Failed to initialize audio:", error);
        // Fallback: try to create a simple audio element
        try {
          const audio = new Audio("/sounds/ringtone.mp3");
          audio.preload = "auto";
          setAudioBuffer({ fallback: true, audio });
        } catch (fallbackError) {
          console.error("Fallback audio also failed:", fallbackError);
        }
      }
    };

    // Initialize audio on first user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // Also try to initialize immediately (might work if user has already interacted)
    initializeAudio();

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Play ringtone using Web Audio API
  const playRingtone = () => {
    if (!audioContext || !audioBuffer) {
      console.log("Audio not ready, trying fallback methods");
      // Try fallback methods
      tryFallbackAudio();
      return;
    }

    try {
      if (audioBuffer.fallback) {
        // Use fallback audio element
        const audio = audioBuffer.audio;
        audio.loop = true;
        audio.volume = 0.5;
        
        // Try to play with user interaction check
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Ringtone started (fallback)");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Fallback audio play failed:", error);
              // Create a simple beep sound as last resort
              createBeepSound();
            });
        }
      } else {
        // Use Web Audio API
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }

        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = audioBuffer;
        source.loop = true;
        gainNode.gain.value = 0.3; // Reduce volume
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        source.start(0);
        setIsPlaying(true);
        
        // Store reference to stop later
        window.currentRingtone = { source, gainNode };
        
        console.log("Ringtone started (Web Audio API)");
      }
    } catch (error) {
      console.error("Error playing ringtone:", error);
      createBeepSound();
    }
  };

  // Try fallback audio methods
  const tryFallbackAudio = () => {
    try {
      // Try to create a simple notification sound
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT";
      audio.loop = true;
      audio.volume = 0.3;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Fallback notification sound started");
            setIsPlaying(true);
            window.incomingCallAudio = audio;
          })
          .catch((error) => {
            console.log("Fallback notification failed:", error);
            createBeepSound();
          });
      }
    } catch (error) {
      console.error("Fallback audio creation failed:", error);
      createBeepSound();
    }
  };

  // Create a simple beep sound as last resort
  const createBeepSound = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a more pleasant ringtone-like sound
      const playRingtoneBeep = () => {
        const oscillator1 = context.createOscillator();
        const oscillator2 = context.createOscillator();
        const gainNode = context.createGain();
        
        // Two-tone ringtone (like old phones)
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(800, context.currentTime);
        oscillator1.frequency.setValueAtTime(1000, context.currentTime + 0.2);
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(600, context.currentTime);
        oscillator2.frequency.setValueAtTime(800, context.currentTime + 0.2);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.15);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(context.currentTime + 0.4);
        oscillator2.stop(context.currentTime + 0.4);
      };
      
      // Play the ringtone pattern
      playRingtoneBeep();
      
      // Repeat every 1 second
      const beepInterval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(beepInterval);
          return;
        }
        playRingtoneBeep();
      }, 1000);
      
      window.currentBeepInterval = beepInterval;
      setIsPlaying(true);
      
      console.log("Ringtone beep started");
    } catch (error) {
      console.error("Failed to create beep sound:", error);
    }
  };

  // Stop ringtone
  const stopRingtone = () => {
    try {
      // Stop Web Audio API ringtone
      if (window.currentRingtone) {
        window.currentRingtone.source.stop();
        window.currentRingtone = null;
      }
      
      // Stop fallback audio
      if (window.incomingCallAudio) {
        window.incomingCallAudio.pause();
        window.incomingCallAudio = null;
      }
      
      // Stop beep interval
      if (window.currentBeepInterval) {
        clearInterval(window.currentBeepInterval);
        window.currentBeepInterval = null;
      }
      
      setIsPlaying(false);
      console.log("Ringtone stopped");
    } catch (error) {
      console.error("Error stopping ringtone:", error);
    }
  };

  useEffect(() => {
    if (!currentUserId) {
      console.log("No currentUserId provided to CallHandler");
      return;
    }

    console.log("CallHandler initialized with userId:", currentUserId);

    // Ensure socket is connected
    if (!callSocket.connected) {
      console.log("Socket not connected, attempting to connect...");
      callSocket.connect();
    }

    const handleConnect = () => {
      console.log("Socket connected successfully, joining room for user:", currentUserId);
      setIsConnected(true);
      setConnectionAttempts(0);
      
      // Join the user's room
      callSocket.emit("join-room", { userId: currentUserId });
      
      // Verify room joining
      setTimeout(() => {
        console.log("Socket rooms after joining:", callSocket.rooms);
      }, 1000);
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      
      // Attempt to reconnect
      if (connectionAttempts < 3) {
        setConnectionAttempts(prev => prev + 1);
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          callSocket.connect();
        }, 2000);
      }
    };

    const handleIncomingCall = ({ appointment_id, doctor_id, mode, token }) => {
      console.log("🎉 INCOMING CALL RECEIVED:", {
        appointment_id,
        doctor_id,
        mode,
        token,
        currentUserId,
        socketConnected: callSocket.connected
      });
      
      setIncoming({ appointment_id, doctor_id, mode, token });

      // Play ringtone
      playRingtone();
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      stopRingtone();
      setIncoming(null);
      navigate("/patient");
    };

    const handleTestMessage = (data) => {
      console.log("🧪 Test message received:", data);
    };

    // Socket event listeners
    callSocket.on("connect", handleConnect);
    callSocket.on("disconnect", handleDisconnect);
    callSocket.on("incoming-call", handleIncomingCall);
    callSocket.on("call-ended", handleCallEnd);
    callSocket.on("test-message", handleTestMessage);

    // Join room immediately if already connected
    if (callSocket.connected) {
      console.log("Socket already connected, joining room immediately");
      handleConnect();
    }

    // Debug: Log socket state periodically
    const debugInterval = setInterval(() => {
      console.log("CallHandler Debug:", {
        userId: currentUserId,
        socketConnected: callSocket.connected,
        socketId: callSocket.id,
        rooms: callSocket.rooms,
        hasIncoming: !!incoming,
        isPlaying: isPlaying
      });
    }, 10000);

    return () => {
      console.log("CallHandler cleanup");
      callSocket.off("connect", handleConnect);
      callSocket.off("disconnect", handleDisconnect);
      callSocket.off("incoming-call", handleIncomingCall);
      callSocket.off("call-ended", handleCallEnd);
      callSocket.off("test-message", handleTestMessage);
      
      clearInterval(debugInterval);
      stopRingtone();
    };
  }, [currentUserId, navigate, isPlaying]);

  const handleAccept = async () => {
    console.log("Accepting call:", incoming);
    
    // Stop ringtone
    stopRingtone();

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
      }
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  const handleDecline = async () => {
    console.log("Declining call:", incoming);
    
    // Stop ringtone
    stopRingtone();

    try {
      await callPostApi("patient/call/respond", {
        appointment_id: incoming?.appointment_id,
        patient_id: currentUserId,
        doctor_id: incoming?.doctor_id,
        response: "decline",
      });

      // Also emit socket event for immediate notification with proper user ID
      callSocket.emit("decline-call", { 
        toUserId: incoming?.doctor_id 
      });
      setIncoming(null);
    } catch (error) {
      console.error("Error declining call:", error);
      setIncoming(null);
    }
  };

  if (!incoming) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="incoming-call-indicator">
          <div className="ringing-animation">
            <div className="ring-circle"></div>
            <div className="ring-circle"></div>
            <div className="ring-circle"></div>
          </div>
        </div>
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
