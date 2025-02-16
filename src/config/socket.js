// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io('http://3.228.233.9:5000/' || process.env.NEXT_PUBLIC_API_BASE_URL);
//  baseURL: "http://localhost:5000/",
