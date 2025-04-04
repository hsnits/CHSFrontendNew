// import React, { useEffect, useRef } from "react";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useParams } from "react-router-dom";
// import CryptoJS from "crypto-js";

// const ZEGO_APP_ID = 556819373;
// const ZEGO_SERVER_SECRET = "2a7bbad8402cc2c5ce932e7832f72604"; // ⚠️ DO NOT expose in production

// function randomID(len = 8) {
//   let result = "";
//   const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
//   for (let i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// // Generate Token (⚠️ UNSAFE for production)
// function generateKitToken(appID, serverSecret, roomID, userID) {
//   const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1-hour expiry
//   const payload = {
//     app_id: appID,
//     user_id: userID,
//     exp: expirationTime,
//   };

//   const token = CryptoJS.HmacSHA256(JSON.stringify(payload), serverSecret).toString();
//   return ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, token);
// }

// export default function ZegoChat() {
//   const { roomId } = useParams();
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     const initializeZegoChat = () => {
//       const userID = randomID(8);
//       const kitToken = generateKitToken(ZEGO_APP_ID, ZEGO_SERVER_SECRET, roomId, userID);

//       // Create Zego instance
//       const zp = ZegoUIKitPrebuilt.create(kitToken);

//       // Join chat-only room (Disabling Audio & Video)
//       zp.joinRoom({
//         container: chatContainerRef.current,
//         sharedLinks: [],
//         scenario: {
//           mode: ZegoUIKitPrebuilt.ChatRoom, // Chat Room mode
//         },
//         showPreJoinView: false, // Disable pre-join view
//         showScreenSharingButton: false,
//         showAudioVideoSettingsButton: false,
//         turnOnCameraWhenJoining: false, // Ensure camera is OFF
//         turnOnMicrophoneWhenJoining: false, // Ensure microphone is OFF
//         showMyCameraToggleButton: false, // Hide camera toggle
//         showMyMicrophoneToggleButton: false, // Hide mic toggle
//         showUserList: true, // Optional: Show list of users in chat
//         showTextChat: true, // Enable text chat
//         showLeaveRoomButton: true, // Allow user to leave
//       });
//     };

//     initializeZegoChat();
//   }, [roomId]);

//   return (
//     <div ref={chatContainerRef} style={{ width: "100vw", height: "100vh" }}></div>
//   );
// }
