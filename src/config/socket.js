// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io(`http://localhost:5000/`);
