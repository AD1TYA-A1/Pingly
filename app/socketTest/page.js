// const socketRef = useRef(null);

//   useEffect(() => {
//     // ✅ Socket created AFTER listeners can be registered
//     socketRef.current = io("http://localhost:5000");

//     socketRef.current.on("connect", () => {
//       console.log("connected:", socketRef.current.id); // ✅ Will show ID
//     });

//     socketRef.current.on("disconnect", () => {
//       console.log("disconnected");
//     });

"use client"
import React from 'react'
import { useEffect, useState } from 'react';
const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");


const Page = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [joinedRoom, setJoinedRoom] = useState(false);

    

    useEffect(() => {
        console.log("Inside use Effect");
        if (socket.connected) {
            console.log("Socket Connected with ID: ", socket.id);

        }
        // ✅ Listen for incoming messages from other users
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
            
        });

        socket.on("connection", () => {
            console.log("connected:", socket.id); // ✅ will now show ID
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });

        // cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // ✅ Join a room
    const joinRoom = () => {
        if (!roomId.trim()) return;
        socket.emit("join_room", roomId);
        setJoinedRoom(true);
        console.log("Joined room:", roomId);
    };

    // ✅ Send message to server
    const sendMessage = () => {
        if (message.trim() === "") return;

        const msgData = {
            message: message,
            sender: socket.id,  // who sent it
            room: roomId,
            time: new Date().toLocaleTimeString(),
        };

        // ✅ Add to own messages list immediately
        setMessages((prev) => [...prev, { ...msgData, self: true }]);

        // ✅ Emit to server
        socket.emit("send_message", msgData);
        setMessage("");
    };

    // Room join screen
    if (!joinedRoom) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100vh", gap: "12px"
            }}>
                <h2>Enter Room ID to Chat</h2>
                <p style={{ color: "#888", fontSize: "13px" }}>
                    Share the same Room ID with the person you want to chat with
                </p>
                <input
                    type="text"
                    placeholder="e.g. room_abc123"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                    style={{
                        padding: "12px", borderRadius: "8px",
                        border: "1px solid #ccc", width: "280px", fontSize: "14px"
                    }}
                />
                <button
                    onClick={joinRoom}
                    style={{
                        padding: "12px 28px", background: "#0070f3",
                        color: "white", border: "none",
                        borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    Join Room
                </button>
            </div>
        );
    }

    return (
        <>
            <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>CHAT</h2>
                    <span style={{
                        background: "#e0f0ff", color: "#0070f3",
                        padding: "4px 10px", borderRadius: "20px", fontSize: "12px"
                    }}>
                        Room: {roomId}
                    </span>
                </div>

                {/* Messages */}
                <div style={{
                    border: "1px solid #ccc", borderRadius: "12px",
                    height: "400px", overflowY: "auto",
                    padding: "15px", marginBottom: "10px", background: "#f9f9f9"
                }}>
                    {messages.length === 0 && (
                        <p style={{ color: "#aaa", textAlign: "center", marginTop: "160px" }}>
                            Waiting for messages...
                        </p>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            display: "flex",
                            justifyContent: msg.self ? "flex-end" : "flex-start",
                            marginBottom: "10px"
                        }}>
                            <div>
                                <div style={{
                                    background: msg.self ? "#0070f3" : "#e0e0e0",
                                    color: msg.self ? "white" : "black",
                                    padding: "10px 14px",
                                    borderRadius: msg.self ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                    maxWidth: "250px", wordBreak: "break-word", fontSize: "14px"
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{
                                    fontSize: "11px", color: "#999",
                                    textAlign: msg.self ? "right" : "left", marginTop: "3px"
                                }}>
                                    {msg.self ? "You" : `User ${msg.sender?.slice(0, 4)}`} • {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        style={{
                            flex: 1, padding: "12px", borderRadius: "8px",
                            border: "1px solid #ccc", fontSize: "14px"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            padding: "12px 20px", background: "#0070f3", color: "white",
                            border: "none", borderRadius: "8px",
                            cursor: "pointer", fontWeight: "bold"
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    )
}

export default Page
