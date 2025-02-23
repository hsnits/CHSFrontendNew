// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io('https://api.chshealthcare.in/' || process.env.NEXT_PUBLIC_API_BASE_URL);
// export const symptomSocket = io("http://localhost:5000/" || process.env.NEXT_PUBLIC_API_BASE_URL);
