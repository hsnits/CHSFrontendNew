// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL);
//  baseURL: "http://localhost:5000/",
