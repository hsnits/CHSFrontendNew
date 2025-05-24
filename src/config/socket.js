// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io(process.env.REACT_APP_SOCKET_BASE_URL);

const SOCKET_URL = process.env.REACT_APP_SOCKET_BASE_URL;

export const callSocket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  withCredentials: true,
  path: "/socket.io/",
  forceNew: true,
});

// Add connection status logging
callSocket.on("connect", () => {
  console.log("Socket connected successfully");
});

callSocket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

callSocket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

// Add Symptom connection status logging
symptomSocket.on("connect", () => {
  console.log("Symptom Socket connected successfully");
});

symptomSocket.on("connect_error", (error) => {
  console.error("Symptom Socket connection error:", error);
});

symptomSocket.on("disconnect", (reason) => {
  console.log("Symptom Socket disconnected:", reason);
});

// export const symptomSocket = io('https://api.chshealthcare.in/' );
// export const symptomSocket = io("http://localhost:5000/" );
