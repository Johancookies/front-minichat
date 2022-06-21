import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { IconBT } from "./icons";
import ServicesList from "./ServicesList";

// connection
const socket = io.connect("https://back-real-time-chat.herokuapp.com/");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(1);
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    socket.emit("join_room", room);
    setShowChat(true);
  };

  return (
    <div className="app">
      {!showChat ? (
        <div className="entranceContainer">
          <div className="appName">
            <IconBT size={60} />
          </div>
          <input
            className="logInput"
            placeholder="Nombre..."
            onChange={(event) => setUsername(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && joinRoom()}
          />
          {/* <input
            placeholder="Room..."
            onChange={(event) => setRoom(event.target.value)}
          /> */}
          <button
            className={`${!(username.length > 0) && "disabled"}`}
            onClick={() => joinRoom()}
          >
            {"¡Chat!"}
          </button>
          <ServicesList />
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
