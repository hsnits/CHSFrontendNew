// socket.js
import { io } from "socket.io-client";

// socket for symptoms
export const symptomSocket = io(process.env.REACT_APP_API_BASE_URL);
export const callSocket = io(process.env.REACT_APP_API_BASE_URL, { transports: ['websocket'] });

// export const symptomSocket = io('https://api.chshealthcare.in/' );
// export const symptomSocket = io("http://localhost:5000/" );
