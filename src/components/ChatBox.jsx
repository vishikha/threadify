// src/components/ChatBox.jsx
import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";

const ChatBox = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", userId);
    };
  }, [userId]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      userId,
      sender: userId === "guest" ? "guest" : "user",
      text: message,
    });

    setMessages((prev) => [...prev, { sender: userId === "guest" ? "guest" : "user", text: message }]);
    setMessage("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        maxHeight: 400,
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          fontWeight: "bold",
        }}
      >
        Chat Support
      </div>

      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <p
            key={i}
            style={{
              margin: "5px 0",
              textAlign: msg.sender === "user" || msg.sender === "guest" ? "right" : "left",
            }}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "8px",
            border: "none",
            outline: "none",
            borderBottomLeftRadius: 8,
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 12px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            borderBottomRightRadius: 8,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;