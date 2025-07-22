import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callSocket } from "../../config/socket";
import { io } from "socket.io-client";
import "./chathandler.css";
import { callPostApi } from "../../_service";

const CallHandler = ({ currentUserId }) => {
  const [incoming, setIncoming] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [isInCallState, setIsInCallState] = useState(false); // Track if user is in any call-related activity
  const navigate = useNavigate();

  // Add immediate debugging
  console.log("🔧 CallHandler component loaded with userId:", currentUserId);
  console.log("🔌 Socket connection details:", {
    connected: callSocket.connected,
    id: callSocket.id,
    url: callSocket.io.opts?.uri
  });

  // Listen for backend connection confirmation
  callSocket.on("connection-confirmed", (data) => {
    console.log("🎊 Backend connection confirmed:", data);
  });

  // Listen for test response
      callSocket.on("test-response", (data) => {
      console.log("🎉 Test response received:", data);
    });

    // Listen for test messages from backend
    callSocket.on("test-message", (data) => {
      console.log("📨 Test message received from backend:", data);
    });

  // Make test function available globally for debugging
  window.testSocketJoin = () => {
    console.log("🧪 Manual socket join test");
    console.log("Socket status:", { connected: callSocket.connected, id: callSocket.id });
    if (currentUserId) {
      callSocket.emit("join-room", { userId: currentUserId });
      console.log("✅ Emitted join-room for:", currentUserId);
    } else {
      console.log("❌ No currentUserId available");
    }
  };

  // Make test communication function available
  window.testBackendComm = () => {
    console.log("🧪 Testing backend communication...");
    callSocket.emit("test-event", { message: "Hello from frontend", userId: currentUserId });
  };

  // Add comprehensive debugging function
  window.debugSocket = () => {
    console.log("🔍 Socket Debug Info:", {
      connected: callSocket.connected,
      id: callSocket.id,
      userId: currentUserId,
      transport: callSocket.io.engine?.transport?.name,
      readyState: callSocket.io.engine?.readyState,
      url: callSocket.io.opts?.uri,
      rooms: callSocket.rooms,
      listeners: Object.keys(callSocket._callbacks || {}),
      connectionAttempts: connectionAttempts
    });
    
    // Test backend connectivity
    fetch('http://localhost:5000/doctor/debug-sockets')
      .then(res => res.json())
      .then(data => {
        console.log("🔧 Backend Socket Status:", data);
      })
             .catch(err => {
         console.error("❌ Backend connection failed:", err);
       });
   };

  // Test message receiving
  window.testMessageReceive = () => {
    fetch('http://localhost:5000/doctor/test-socket-emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUserId, 
        message: "Test from frontend debug" 
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("📤 Test message sent:", data);
    })
    .catch(err => {
      console.error("❌ Test message failed:", err);
    });
  };

  // Test single session functionality
  window.testSingleSession = () => {
    fetch('http://localhost:5000/doctor/test-single-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUserId
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("🔒 Single session status:", data);
    })
    .catch(err => {
      console.error("❌ Single session test failed:", err);
    });
  };

  // Force session refresh (simulate new login)
  window.forceSessionRefresh = () => {
    console.log("🔄 Forcing session refresh...");
    
    // Disconnect current socket
    if (callSocket.connected) {
      callSocket.disconnect();
    }
    
    // Reconnect after a short delay
    setTimeout(() => {
      callSocket.connect();
      
      // Join room again after connection
      setTimeout(() => {
        if (currentUserId) {
          callSocket.emit("join-room", { userId: currentUserId });
          console.log("🚀 Re-joined room after session refresh");
        }
      }, 1000);
    }, 500);
  };

  // Simulate multiple logins (for testing single session enforcement)
  window.simulateMultipleLogin = () => {
    console.log("🧪 SIMULATING MULTIPLE LOGIN - This should trigger session replacement");
    
    // Wait a bit to ensure current socket is not considered "recent"
    setTimeout(() => {
      // Create a new socket connection (simulating login from another tab)
      const testSocket = io('http://localhost:5000', {
        transports: ["websocket", "polling"],
        forceNew: true
      });

      testSocket.on('connect', () => {
        console.log("🆕 Test socket connected:", testSocket.id);
        
        // Try to join the same user room
        testSocket.emit("join-room", { userId: currentUserId });
        console.log("📤 Test socket attempting to join same user room");
        
        testSocket.on('room-joined', (data) => {
          console.log("✅ Test socket joined room:", data);
          console.log("🔥 This should have destroyed the original session");
        });
      });

      // Clean up test socket after 10 seconds
      setTimeout(() => {
        testSocket.disconnect();
        console.log("🧹 Test socket disconnected");
      }, 10000);
    }, 6000); // Wait 6 seconds to ensure current socket is not considered "recent"
  };

  // Test force destroy session
  window.forceDestroyMySession = () => {
    console.log("🔨 TESTING FORCE DESTROY - This should destroy current session");
    
    fetch('http://localhost:5000/doctor/force-destroy-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUserId
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("💥 Force destroy response:", data);
    })
    .catch(err => {
      console.error("❌ Force destroy failed:", err);
    });
  };

  // Clear session replacement flags (for testing)
  window.clearSessionFlags = () => {
    sessionStorage.removeItem('handling_session_replacement');
    sessionStorage.removeItem('session_replacement_reload');
    console.log("🧹 Cleared all session replacement flags");
  };

  // Check session replacement flags (for debugging)
  window.checkSessionFlags = () => {
    const handling = sessionStorage.getItem('handling_session_replacement');
    const reload = sessionStorage.getItem('session_replacement_reload');
    console.log("🔍 Session flags:", {
      handling_session_replacement: handling,
      session_replacement_reload: reload
    });
  };

  // Test genuine replacement (should show popup)
  window.testGenuineReplacement = () => {
    console.log("🧪 TESTING GENUINE REPLACEMENT - This should show the popup");
    
    fetch('http://localhost:5000/doctor/test-genuine-replacement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUserId
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("🔥 Genuine replacement test response:", data);
    })
    .catch(err => {
      console.error("❌ Genuine replacement test failed:", err);
    });
  };

  // Check and clear call state (for debugging)
  window.checkCallState = () => {
    console.log("🔍 Call State Debug:", {
      isInCallState,
      hasIncoming: !!incoming,
      isPlaying,
      hasTimeout: !!window.callStateTimeoutId
    });
  };

        window.forceClearCallState = () => {
     console.log("🧹 FORCE CLEARING CALL STATE");
     setIsInCallState(false);
     setIncoming(null);
     stopRingtone();
     if (window.callStateTimeoutId) {
       clearTimeout(window.callStateTimeoutId);
       window.callStateTimeoutId = null;
     }
     console.log("✅ Call state forcefully cleared");
   };

   // Test call state protection
   window.testCallStateProtection = () => {
     console.log("🧪 TESTING CALL STATE PROTECTION");
     console.log("1. Setting call state...");
     setIsInCallState(true);
     
     setTimeout(() => {
       console.log("2. Testing genuine replacement (should be suppressed)...");
       testGenuineReplacement();
     }, 1000);
     
     setTimeout(() => {
       console.log("3. Clearing call state...");
       setIsInCallState(false);
     }, 3000);
     
     setTimeout(() => {
       console.log("4. Testing genuine replacement again (should show popup)...");
       testGenuineReplacement();
     }, 4000);
   };

  // Force socket reconnection and room join
  window.forceSocketReconnect = () => {
    console.log("🔄 Forcing socket reconnection...");
    if (callSocket.connected) {
      callSocket.disconnect();
    }
    setTimeout(() => {
      callSocket.connect();
      setTimeout(() => {
        if (currentUserId) {
          callSocket.emit("join-room", { userId: currentUserId });
          console.log("🚀 Re-emitted join-room after reconnection");
        }
      }, 1000);
    }, 500);
  };

  // Test call notification function
  window.testCallNotification = (doctorName = "Test Doctor", mode = "video") => {
    console.log("🧪 Testing call notification manually...");
    fetch('http://localhost:5000/doctor/test-call-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        patientId: currentUserId, 
        doctorName, 
        mode 
      })
    })
    .then(r => r.json())
    .then(data => {
      console.log("📤 Test notification API response:", data);
    })
    .catch(err => {
      console.error("❌ Test notification failed:", err);
    });
  };

  // Request notification permission on component mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          console.log("Notification permission:", permission);
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      } else {
        setNotificationPermission(Notification.permission);
      }
    };

    requestNotificationPermission();
  }, []);

  // Show browser notification for incoming call
  const showNotification = (doctorName, mode) => {
    if ('Notification' in window && notificationPermission === 'granted') {
      const title = `Incoming ${mode} call`;
      const body = `Dr. ${doctorName || 'Doctor'} is calling you for a ${mode} consultation. Click to respond.`;
      const icon = '/favicon.png'; // Use your app's icon
      
      try {
        const notification = new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'incoming-call',
          requireInteraction: true, // Keep notification until user interacts
          // Note: Actions are not supported in regular notifications
          // Only ServiceWorker notifications support actions
        });

        // Handle notification clicks
        notification.onclick = () => {
          window.focus();
          notification.close();
          // The accept/decline UI will handle the call response
        };

        // Auto-close notification after 30 seconds if no response
        setTimeout(() => {
          if (notification) {
            notification.close();
          }
        }, 30000);

        console.log("📢 Browser notification shown successfully");
        return notification;
      } catch (error) {
        console.error("❌ Failed to show browser notification:", error);
        // Fallback: just focus the window
        window.focus();
        return null;
      }
    } else {
      console.log("🚫 Notifications not available or not granted");
      return null;
    }
  };

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
    
    // Check if this is a reload after session replacement
    const isReloadAfterReplacement = sessionStorage.getItem('session_replacement_reload');
    if (isReloadAfterReplacement) {
      console.log("🔄 This is a reload after session replacement - clearing flags");
      sessionStorage.removeItem('session_replacement_reload');
      sessionStorage.removeItem('handling_session_replacement');
    }
    
    // Force immediate room join if socket is already connected
    if (callSocket.connected) {
      console.log("🚀 Socket already connected, forcing room join...");
      callSocket.emit("join-room", { userId: currentUserId });
    }

    // Ensure socket is connected
    if (!callSocket.connected) {
      console.log("Socket not connected, attempting to connect...");
      callSocket.connect();
    }

    const handleConnect = () => {
      console.log("🔗 Socket connected successfully, joining room for user:", currentUserId);
      console.log("🔧 Connection details:", {
        socketId: callSocket.id,
        transport: callSocket.io.engine?.transport?.name,
        readyState: callSocket.io.engine?.readyState,
        url: callSocket.io.opts?.uri
      });
      
      setIsConnected(true);
      setConnectionAttempts(0);
      
      // Join the user's room
      console.log("📤 Emitting join-room for user:", currentUserId);
      callSocket.emit("join-room", { userId: currentUserId });
      
      // Listen for room join confirmation
      callSocket.once("room-joined", (data) => {
        console.log("✅ Room join confirmed:", data);
        
        if (data.replacedOldSession) {
          console.log("🔄 NEW SESSION CREATED - Old session was destroyed");
          console.log("👍 You are now the ACTIVE session for this user");
        } else {
          console.log("🆕 Fresh session created (no previous session found)");
        }
      });
      
      // Verify room joining
      setTimeout(() => {
        console.log("📋 Socket rooms after joining:", callSocket.rooms);
        console.log("📊 Socket connection details:", {
          id: callSocket.id,
          connected: callSocket.connected,
          userId: currentUserId,
          transport: callSocket.io.engine?.transport?.name
        });
      }, 1000);
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      
      // Attempt to reconnect
      if (connectionAttempts < 3) {
        setConnectionAttempts(prev => prev + 1);
        setTimeout(() => {
          console.log("🔄 Attempting to reconnect...");
          callSocket.connect();
        }, 2000);
      }
    };

    const handleConnectError = (error) => {
      console.error("❌ Socket connection error:", error);
      setIsConnected(false);
    };

    const handleError = (error) => {
      console.error("❌ Socket error:", error);
    };

    const handleSessionReplaced = (data) => {
      console.warn("🚨 THIS SESSION IS BEING REPLACED:", data);
      
      // Check if this is a genuine replacement or just a page refresh
      if (!data.isGenuineReplacement) {
        console.log("ℹ️ Not a genuine replacement - ignoring");
        return;
      }
      
                    // Check if we're in any call-related state - DON'T show popup during calls
       if (isInCallState || incoming || isPlaying) {
         console.log("📞 Call activity detected - suppressing SESSION REPLACEMENT popup (keeping call notification):", {
           isInCallState,
           hasIncoming: !!incoming,
           isPlaying
         });
         // DON'T clear incoming call or stop ringtone - just suppress the session replacement popup
         console.log("🚫 Session replacement popup suppressed due to active call state");
         return;
       }
      
      // Check if we're already in the middle of handling a session replacement
      const isHandlingReplacement = sessionStorage.getItem('handling_session_replacement');
      if (isHandlingReplacement) {
        console.log("⏭️ Already handling session replacement - skipping");
        return;
      }
      
      // Set flag to prevent multiple popups
      sessionStorage.setItem('handling_session_replacement', 'true');
      
      console.warn("⚠️ GENUINE OLD SESSION NOTIFICATION - showing popup to user");
      
      // Stop any ongoing ringtones
      stopRingtone();
      
      // Clear any incoming call state
      setIncoming(null);
      
      // Disconnect socket to prevent further issues
      if (callSocket.connected) {
        callSocket.disconnect();
      }
      
      // Show notification to OLD session user
      setTimeout(() => {
        const userChoice = window.confirm(
          "🔄 SESSION REPLACED\n\n" +
          "Your session has been replaced by a new login from another device/tab.\n\n" +
          "• Click OK to refresh and continue with this tab\n" +
          "• Click Cancel to close this tab\n\n" +
          "Note: Only one session can be active at a time."
        );
        
        if (userChoice) {
          // User wants to continue with this tab - set flag and reload
          console.log("🔄 User chose to continue - reloading page");
          sessionStorage.setItem('session_replacement_reload', 'true');
          window.location.reload();
        } else {
          // User wants to close this tab
          console.log("🚪 User chose to close tab");
          sessionStorage.removeItem('handling_session_replacement');
          if (window.opener || window.history.length > 1) {
            window.close();
          } else {
            // If can't close, redirect to login
            window.location.href = '/login';
          }
        }
      }, 500); // Small delay to ensure disconnect completes
    };

    const handleIncomingCall = ({ appointment_id, doctor_id, mode, token, doctorName, isTest }) => {
      console.log("🎉 INCOMING CALL RECEIVED:", {
        appointment_id,
        doctor_id,
        mode,
        token,
        doctorName,
        isTest,
        currentUserId,
        socketConnected: callSocket.connected
      });
      
      // Set call state immediately to prevent session replacement popups
      setIsInCallState(true);
      console.log("📞 Entered call state - session replacement popups disabled");
      
      // Safety timeout: Clear call state after 60 seconds if not cleared manually
      const callStateTimeout = setTimeout(() => {
        console.warn("⚠️ Call state timeout reached - auto-clearing call state");
        setIsInCallState(false);
        stopRingtone();
        setIncoming(null);
      }, 60000); // 60 seconds
      
      // Store timeout ID for cleanup
      window.callStateTimeoutId = callStateTimeout;
      
      if (isTest) {
        console.log("🧪 This is a TEST call notification");
        // For test calls, just show notification and play sound, don't set incoming state
        playRingtone();
        showNotification(doctorName, mode);
        
        // Auto-stop test after 5 seconds
        setTimeout(() => {
          stopRingtone();
          setIsInCallState(false); // Clear call state after test
          // Clear safety timeout
          if (window.callStateTimeoutId) {
            clearTimeout(window.callStateTimeoutId);
            window.callStateTimeoutId = null;
          }
          console.log("🛑 Test call notification stopped - call state cleared");
        }, 5000);
        return;
      }
      
      setIncoming({ appointment_id, doctor_id, mode, token, doctorName });

      // Play ringtone
      playRingtone();

      // Show browser notification
      showNotification(doctorName, mode);
    };

    const handleCallEnd = () => {
      console.log("Call ended - clearing all call states");
      stopRingtone();
      setIncoming(null);
      setIsInCallState(false);
      // Clear safety timeout
      if (window.callStateTimeoutId) {
        clearTimeout(window.callStateTimeoutId);
        window.callStateTimeoutId = null;
      }
      console.log("📞 Call state cleared - session replacement popups re-enabled");
      navigate("/patient");
    };

    const handleTestMessage = (data) => {
      console.log("🧪 Test message received:", data);
    };

    // Socket event listeners
    callSocket.on("connect", handleConnect);
    callSocket.on("disconnect", handleDisconnect);
    callSocket.on("connect_error", handleConnectError);
    callSocket.on("error", handleError);
    callSocket.on("session-replaced", handleSessionReplaced);
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
      
      // Clean up session replacement flags
      sessionStorage.removeItem('handling_session_replacement');
      
      callSocket.off("connect", handleConnect);
      callSocket.off("disconnect", handleDisconnect);
      callSocket.off("connect_error", handleConnectError);
      callSocket.off("error", handleError);
      callSocket.off("session-replaced", handleSessionReplaced);
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
        // Clear call state before navigation
        setIncoming(null);
        setIsInCallState(false);
        // Clear safety timeout
        if (window.callStateTimeoutId) {
          clearTimeout(window.callStateTimeoutId);
          window.callStateTimeoutId = null;
        }
        console.log("📞 Call accepted - clearing call state before navigation");
        
        navigate(`/${incoming?.mode}-call`, {
          state: {
            patientId: currentUserId,
            doctorId: incoming?.doctor_id,
            appointmentId: incoming?.appointment_id,
            mode: incoming?.mode,
          },
        });
      } else {
        console.error("Failed to accept call:", res);
        // Clear call state on failure too
        setIncoming(null);
        setIsInCallState(false);
        // Clear safety timeout
        if (window.callStateTimeoutId) {
          clearTimeout(window.callStateTimeoutId);
          window.callStateTimeoutId = null;
        }
      }
    } catch (error) {
      console.error("Error accepting call:", error);
      // Clear call state on error
      setIncoming(null);
      setIsInCallState(false);
      // Clear safety timeout
      if (window.callStateTimeoutId) {
        clearTimeout(window.callStateTimeoutId);
        window.callStateTimeoutId = null;
      }
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
      
              // Clear call state
        setIncoming(null);
        setIsInCallState(false);
        // Clear safety timeout
        if (window.callStateTimeoutId) {
          clearTimeout(window.callStateTimeoutId);
          window.callStateTimeoutId = null;
        }
        console.log("📞 Call declined - call state cleared");
    } catch (error) {
      console.error("Error declining call:", error);
      // Clear call state on error too
      setIncoming(null);
      setIsInCallState(false);
      // Clear safety timeout
      if (window.callStateTimeoutId) {
        clearTimeout(window.callStateTimeoutId);
        window.callStateTimeoutId = null;
      }
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
        <p>{incoming?.doctorName ? `Dr. ${incoming.doctorName}` : 'Doctor'} is calling you</p>
        <div className="call-type-info">
          <i className={`fa-solid ${incoming?.mode === 'video' ? 'fa-video' : incoming?.mode === 'audio' ? 'fa-microphone' : 'fa-comments'}`}></i>
          {incoming?.mode?.charAt(0).toUpperCase() + incoming?.mode?.slice(1)} Consultation
        </div>
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
