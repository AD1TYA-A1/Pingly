// lib/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {  // your socket server port
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ["websocket"], // ✅ force websocket, avoid polling
});
export default socket;