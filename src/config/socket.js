// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io("https://api.chshealthcare.in/");
//  baseURL: "http://localhost:5000/",
