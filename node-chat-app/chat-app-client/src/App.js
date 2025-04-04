import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios"; // Fixed: incorrect syntax, should be a string

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/messages").then((response) => {
      setMessages(response.data);
    });

    socket.on("receiveMessage", (data) => { // Fixed: parameter name was `message`, but `data` was used
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage"); // Fixed: braces missing for return function body
    };
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", { sender: "User", message });
    setMessage("");
  };

return (
  <div>
    <h2>Chat Room</h2>
    <div>
      {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.sender}:</strong>{msg.message}
        </p>
      ))}
    </div>
    <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    />
    <button onClick={sendMessage}>Send</button>
  </div>
);
}

export default App;