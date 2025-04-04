// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "react-bootstrap";
// import { io } from "socket.io-client";

// const PatientCall = ({ patientId }) => {
//   const [incomingCall, setIncomingCall] = useState(false);
//   const [callData, setCallData] = useState(null); // Store appointment & doctor details
//   const socket = useRef(null);

//   useEffect(() => {
//     if (!patientId) return; // Prevent initializing socket if patientId is missing

//     // Initialize socket connection
//     socket.current = io("http://localhost:5000", { transports: ["websocket"] });

//     // Join patient-specific room
//     socket.current.emit("join-patient", patientId);

//     // Listen for incoming call event
//     socket.current.on("incoming-call", ({ appointment_id, doctor_id }) => {
//       console.log("Incoming call from doctor:", doctor_id);
//       setCallData({ appointment_id, doctor_id });
//       setIncomingCall(true);
//     });

//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, [patientId]);

//   const handleCallResponse = async (response) => {
//     if (!callData) return;

//     try {
//       let result = await fetch("http://localhost:5000/patient/call/respond", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patient_id: patientId,
//           appointment_id: callData.appointment_id,
//           response,
//         }),
//       });

//       let data = await result.json();
//       console.log(data,data?.token, "result");

//       // Emit response via socket to doctor
//       socket.current.emit(
//         response === "accept" ? "patient-accept" : "patient-decline",
//         {
//           doctorId: callData.doctor_id,
//           token: data?.token,
//         }
//       );

//       setIncomingCall(false);
//       setCallData(null);
//     } catch (error) {
//       console.error("Error sending call response:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       {incomingCall && (
//         <div className="p-4 bg-gray-100 rounded-md shadow-md">
//           <p className="text-lg font-bold mb-2">Incoming Call from Doctor</p>
//           <div className="flex gap-4">
//             <Button
//               onClick={() => handleCallResponse("accept")}
//               variant="success"
//             >
//               Accept
//             </Button>
//             <Button
//               onClick={() => handleCallResponse("decline")}
//               variant="danger"
//             >
//               Decline
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientCall;
