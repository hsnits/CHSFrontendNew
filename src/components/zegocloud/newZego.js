// import React, { useEffect, useRef } from "react";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useParams } from "react-router-dom";
// import CryptoJS from "crypto-js";

// const ZEGO_APP_ID = 556819373;
// const ZEGO_SERVER_SECRET = "2a7bbad8402cc2c5ce932e7832f72604"; // ⚠️ DO NOT expose in production

// function randomID(len = 5) {
//   let result = "";
//   const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
//   for (let i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// // Function to generate Zego Token on the frontend (⚠️ UNSAFE)
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

// export default function ZegoRoom() {
//   const { roomId } = useParams();
//   const roomID = randomID(5);
//   const videoContainerRef = useRef(null);

//   useEffect(() => {
//     const initializeZego = () => {
//       const userID = randomID(8);
//       const kitToken = generateKitToken(ZEGO_APP_ID, ZEGO_SERVER_SECRET, roomID, userID);
      
//       // Create Zego instance
//       const zp = ZegoUIKitPrebuilt.create(kitToken);

//       // Start the call
//       zp.joinRoom({
//         container: videoContainerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.GroupCall, // Change to `OneONoneCall` for 1-on-1
//         },
//       });
//     };

//     initializeZego();
//   }, [roomID]);

//   return <div ref={videoContainerRef} style={{ width: "100vw", height: "100vh" }}></div>;
// }
