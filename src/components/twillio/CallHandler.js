import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { callSocket } from "../../config/socket";
import { io } from "socket.io-client";
import "./chathandler.css";
import { callPostApi } from "../../_service";

const CallHandler = ({ currentUserId }) => {
  const [incoming, setIncoming] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isInCallState, setIsInCallState] = useState(false);
  const navigate = useNavigate();
  
  // Use useRef for audio to persist across renders
  const ringtoneAudio = useRef(null);

  // Initialize ringtone audio
  useEffect(() => {
    try {
      ringtoneAudio.current = new Audio('/sounds/ringtone.mp3');
      ringtoneAudio.current.loop = true;
      ringtoneAudio.current.volume = 0.7;
      ringtoneAudio.current.preload = 'auto';
      
      console.log("🔊 Ringtone audio initialized");
    } catch (error) {
      console.error("❌ Failed to initialize ringtone:", error);
    }
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          console.log("🔔 Notification permission:", permission);
        } catch (error) {
          console.error("❌ Error requesting notification permission:", error);
        }
      } else {
        console.warn("⚠️ Notifications not supported in this browser");
      }
    };

    requestNotificationPermission();
  }, []);

  // Play ringtone
  const playRingtone = () => {
    if (ringtoneAudio.current && !isPlaying) {
      try {
        const playPromise = ringtoneAudio.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("🔊 Ringtone started playing");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("❌ Failed to play ringtone:", error);
              // Fallback: try browser beep
              createFallbackBeep();
            });
        }
      } catch (error) {
        console.error("❌ Error playing ringtone:", error);
        createFallbackBeep();
      }
    }
  };

  // Stop ringtone
  const stopRingtone = () => {
    if (ringtoneAudio.current && isPlaying) {
      try {
        ringtoneAudio.current.pause();
        ringtoneAudio.current.currentTime = 0;
        setIsPlaying(false);
        console.log("🔇 Ringtone stopped");
      } catch (error) {
        console.error("❌ Error stopping ringtone:", error);
      }
    }
    
    // Also clear any fallback beep intervals
    if (window.currentBeepInterval) {
      clearInterval(window.currentBeepInterval);
      window.currentBeepInterval = null;
    }
  };

  // Fallback beep sound if ringtone file fails
  const createFallbackBeep = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBeep = () => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.15);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.4);
      };
      
      // Play immediately and then repeat
      playBeep();
      setIsPlaying(true);
      
      const beepInterval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(beepInterval);
          return;
        }
        playBeep();
      }, 1000);
      
      window.currentBeepInterval = beepInterval;
      console.log("🔊 Fallback beep ringtone started");
    } catch (error) {
      console.error("❌ Failed to create fallback beep:", error);
    }
  };

  // Show browser notification
  const showNotification = (doctorName, mode) => {
    if ('Notification' in window && notificationPermission === 'granted') {
      const title = `Incoming ${mode} call`;
      const body = `Dr. ${doctorName || 'Doctor'} is calling you for a ${mode} consultation. Click to respond.`;
      const icon = '/favicon.png';
      
      try {
        const notification = new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'incoming-call',
          requireInteraction: true,
          data: { appointmentId: incoming?.appointment_id }
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
          console.log("🔔 User clicked on notification");
        };

        // Auto-close after 30 seconds
        setTimeout(() => {
          if (notification) {
            notification.close();
          }
        }, 30000);

        console.log("🔔 Browser notification shown");
        return notification;
      } catch (error) {
        console.error("❌ Failed to show notification:", error);
        return null;
      }
    } else {
      console.log(`🚫 Notifications not available. Permission: ${notificationPermission}`);
      return null;
    }
  };

  // Auto-join socket room
  useEffect(() => {
    if (currentUserId && callSocket.connected) {
      console.log("🚀 Auto-joining socket room for user:", currentUserId);
      callSocket.emit("join-room", { userId: currentUserId });
    } else if (currentUserId && !callSocket.connected) {
      console.log("⏳ Socket not connected yet, will retry when connected");
      const handleConnect = () => {
        console.log("🎉 Socket connected, now joining room for user:", currentUserId);
        callSocket.emit("join-room", { userId: currentUserId });
        callSocket.off("connect", handleConnect);
      };
      callSocket.on("connect", handleConnect);
      
      return () => {
        callSocket.off("connect", handleConnect);
      };
    }
  }, [currentUserId, callSocket.connected]);

  // Socket event handlers
  useEffect(() => {
    const handleConnect = () => {
      console.log("🎉 Socket connected:", callSocket.id);
      setIsConnected(true);
      setConnectionAttempts(0);
      
      if (currentUserId) {
        callSocket.emit("join-room", { userId: currentUserId });
        console.log("🚀 Joined room for user:", currentUserId);
      }
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      
      if (reason === "io server disconnect") {
        setConnectionAttempts(prev => prev + 1);
        setTimeout(() => {
          console.log("🔄 Attempting to reconnect...");
          callSocket.connect();
        }, 2000);
      }
    };

    const handleIncomingCall = ({ appointment_id, doctor_id, mode, token, doctorName, isTest }) => {
      console.log("📞 INCOMING CALL:", {
        appointment_id,
        doctor_id,
        mode,
        doctorName,
        isTest
      });
      
      setIsInCallState(true);
      
      // Safety timeout to clear call state
      const callStateTimeout = setTimeout(() => {
        console.warn("⚠️ Call state timeout - auto-clearing");
        setIsInCallState(false);
        stopRingtone();
        setIncoming(null);
      }, 60000);
      
      window.callStateTimeoutId = callStateTimeout;
      
      if (isTest) {
        console.log("🧪 Test call notification");
        playRingtone();
        showNotification(doctorName, mode);
        
        setTimeout(() => {
          stopRingtone();
          setIsInCallState(false);
          if (window.callStateTimeoutId) {
            clearTimeout(window.callStateTimeoutId);
            window.callStateTimeoutId = null;
          }
        }, 5000);
        return;
      }
      
      setIncoming({ appointment_id, doctor_id, mode, token, doctorName });
      playRingtone();
      showNotification(doctorName, mode);
    };

    const handleCallEnd = () => {
      console.log("📞 Call ended - clearing states");
      stopRingtone();
      setIncoming(null);
      setIsInCallState(false);
      if (window.callStateTimeoutId) {
        clearTimeout(window.callStateTimeoutId);
        window.callStateTimeoutId = null;
      }
      navigate("/patient");
    };

    // Register event listeners
    callSocket.on("connect", handleConnect);
    callSocket.on("disconnect", handleDisconnect);
    callSocket.on("incoming-call", handleIncomingCall);
    callSocket.on("call-ended", handleCallEnd);

    // Join room if already connected
    if (callSocket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      callSocket.off("connect", handleConnect);
      callSocket.off("disconnect", handleDisconnect);
      callSocket.off("incoming-call", handleIncomingCall);
      callSocket.off("call-ended", handleCallEnd);
      
      // Clean up audio and timeouts
      stopRingtone();
      if (window.callStateTimeoutId) {
        clearTimeout(window.callStateTimeoutId);
        window.callStateTimeoutId = null;
      }
    };
  }, [currentUserId, navigate]);

  // Handle call response
  const handleCallResponse = async (response) => {
    if (!incoming) return;

    console.log("📞 Handling call response:", response);
    console.log("📞 Incoming call data:", incoming);

    try {
      stopRingtone();
      
      const result = await callPostApi("patient/call/respond", {
        appointment_id: incoming.appointment_id,
        patient_id: currentUserId,
        response: response
      });

      console.log("📞 API Response:", result);
      console.log("📞 Response status:", result?.status);
      console.log("📞 Response data:", result?.data);

      if (result?.status && response === "accept") {
        console.log("✅ Call accepted, navigating to video call");
        console.log("🔀 Navigation state:", {
          appointmentId: incoming.appointment_id,
          patientId: currentUserId,
          doctorId: incoming.doctor_id,
          mode: incoming.mode
        });
        
        navigate("/video-call", {
          state: {
            appointmentId: incoming.appointment_id,
            patientId: currentUserId,
            doctorId: incoming.doctor_id,
            mode: incoming.mode
          }
        });
      } else if (response === "accept") {
        console.error("❌ Call accepted but API response failed:", result);
      }
      
      setIncoming(null);
      setIsInCallState(false);
      if (window.callStateTimeoutId) {
        clearTimeout(window.callStateTimeoutId);
        window.callStateTimeoutId = null;
      }
    } catch (error) {
      console.error("❌ Error responding to call:", error);
    }
  };

  // Render incoming call popup
  if (incoming) {
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
          
          <h3>Incoming {incoming.mode} call</h3>
          <p>Dr. {incoming.doctorName || 'Doctor'} is calling you</p>
          
          <div className="call-type-info">
            <i className={incoming.mode === 'video' ? 'fas fa-video' : 'fas fa-phone'}></i>
            {incoming.mode} consultation
          </div>
          
          <div className="popup-buttons">
            <button 
              className="accept-btn" 
              onClick={() => handleCallResponse("accept")}
            >
              <i className="fas fa-phone"></i> Accept
            </button>
            <button 
              className="decline-btn" 
              onClick={() => handleCallResponse("decline")}
            >
              <i className="fas fa-phone-slash"></i> Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Component doesn't render anything when no incoming call
  return null;
};

export default CallHandler;
