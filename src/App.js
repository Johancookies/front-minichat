import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";

// connection
const socket = io.connect("http://172.28.60.15:3001/");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    socket.emit("join_room", room);
    setShowChat(true);
  };

  return (
    <div className="app">
      {!showChat ? (
        <>
          <h1>Minichat</h1>
          <input
            placeholder="Name..."
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            placeholder="Room..."
            onChange={(event) => setRoom(event.target.value)}
          />
          <button
            className={`${
              !(room.length > 0 && username.length > 0) && "disabled"
            }`}
            onClick={() => joinRoom()}
          >
            {"Join Room"}
          </button>
        </>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
