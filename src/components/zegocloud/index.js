// import React, { useEffect, useRef, useState } from "react";
// import { ZegoExpressEngine } from "zego-express-engine-webrtc";
// import axios from "axios";
// import { STORAGE } from "../../constants"; // Assuming this contains STORAGE.USER_KEY
// import { getLocalStorage } from "../../helpers/storage"; // Helper to get localStorage data

// const VideoCall = ({  roomID }) => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const [zegoClient, setZegoClient] = useState(null);
//    // Get user info from localStorage and extract userID
//   const userID = getLocalStorage(STORAGE.USER_KEY)?._id;
//    console.log( userID, "  UserID:", );

//   useEffect(() => {
//     const initializeZego = async () => {
//       try {
//         // Fetch token and appID from backend
//         const response = await axios.post("http://localhost:5000/get-zego-token", { userID });
//         const { token, appID } = response.data;
//         console.log("Token and AppID:", { token, appID });

//         // Validate token and appID
//         if (!token || !appID) {
//           throw new Error("Invalid token or appID from server");
//         }

//         // Initialize ZegoExpressEngine
//         const zego = new ZegoExpressEngine(parseInt(appID), "wss://webliveroom-api.zegocloud.com/ws");
//         setZegoClient(zego);
//         console.log("Zego Client Initialized:", zego);

//         // Login to room
//         const loginResult = await zego.loginRoom(roomID, token, { userID, userName: userID });
//         console.log("Login Result:", loginResult);

//         if (!loginResult) {
//           throw new Error("Failed to login to Zego room");
//         }

//         // Start local video stream
//         const localStream = await zego.createStream({ camera: { video: true, audio: true } });
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = localStream;
//           console.log("Local stream assigned to video element");
//         } else {
//           console.error("Local video ref is not available");
//         }

//         // Publish local stream with a unique streamID (using userID)
//         const streamID = `${userID}_stream`;
//         await zego.startPublishingStream(streamID, localStream);
//         console.log("Local stream published with streamID:", streamID);

//         // Handle remote stream updates
//         zego.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
//           console.log("Room Stream Update:", { roomID, updateType, streamList });
//           if (updateType === "ADD" && streamList.length > 0) {
//             const remoteStreamID = streamList[0].streamID;
//             if (remoteStreamID === streamID) {
//               console.log("Ignoring own stream:", remoteStreamID);
//               return; // Skip playing your own stream
//             }
//             try {
//               const remoteStream = await zego.startPlayingStream(remoteStreamID);
//               if (remoteVideoRef.current) {
//                 remoteVideoRef.current.srcObject = remoteStream;
//                 console.log("Remote stream assigned to video element:", remoteStreamID);
//               } else {
//                 console.error("Remote video ref is not available");
//               }
//             } catch (err) {
//               console.error("Error playing remote stream:", err);
//             }
//           }
//         });

//       } catch (error) {
//         console.error("ZegoCloud Initialization Error:", error);
//       }
//     };

//     initializeZego();

//     // Cleanup function
//     return () => {
//       if (zegoClient) {
//         zegoClient.logoutRoom(roomID);
//         console.log("Logged out of room:", roomID);
//       }
//     };
//   }, [userID, roomID]); // Dependencies include userID and roomID

//   return (
//     <div>
//       <h2>Video Call - Room {roomID}</h2>
//       <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{ width: "300px", border: "2px solid green" }}
//         />
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           style={{ width: "300px", border: "2px solid red" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default VideoCall;