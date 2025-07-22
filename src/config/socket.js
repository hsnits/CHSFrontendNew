// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_BASE_URL || "http://localhost:5000";

console.log("🔧 Socket Configuration:", {
  SOCKET_URL,
  env: process.env.REACT_APP_SOCKET_BASE_URL,
  fallback: !process.env.REACT_APP_SOCKET_BASE_URL ? "Using localhost:5000" : "Using env variable"
});

// Socket for symptoms
// export const symptomSocket = io(SOCKET_URL);
export const symptomSocket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  withCredentials: true,
  path: "/socket.io",
  forceNew: true,
  autoConnect: true,
});

export const callSocket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  withCredentials: true,
  path: "/socket.io",
  forceNew: true,
  autoConnect: true,
});

// Add connection status logging
callSocket.on("connect", () => {
  console.log("✅ Call socket connected successfully");
  console.log("📊 Socket details:", {
    id: callSocket.id,
    connected: callSocket.connected,
    url: SOCKET_URL
  });
});

callSocket.on("disconnect", (reason) => {
  console.log("❌ Call socket disconnected:", reason);
});

callSocket.on("connect_error", (error) => {
  console.error("🚨 Call socket connection error:", error);
  console.error("🔍 Connection details:", {
    url: SOCKET_URL,
    errorType: error.type,
    errorMessage: error.message
  });
});

// Add connection status logging for symptom socket
symptomSocket.on("connect", () => {
  debugger;
  console.log("Symptom socket connected successfully");
});

symptomSocket.on("disconnect", (reason) => {
  debugger;
  console.log("Symptom socket disconnected:", reason);
});

symptomSocket.on("connect_error", (error) => {
  console.error("Symptom socket connection error:", error);
});

// export const symptomSocket = io('https://api.chshealthcare.in/' );
// export const symptomSocket = io("http://localhost:5000/" );
