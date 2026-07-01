// lib/socket.js
import { io } from "socket.io-client";

const socket = io("https://websockets-so33.onrender.com/", {  // your socket server port
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ["websocket"], // ✅ force websocket, avoid polling
});
export default socket;