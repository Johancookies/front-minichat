import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { IconBT } from "./icons";
import ServicesList from "./ServicesList";
import axios from "axios";

// connection
const socket = io.connect(process.env.REACT_APP_PUBLIC_API);

function App() {
  const [username, setUsername] = useState(1);
  const [room, setRoom] = useState(1);
  const [showChat, setShowChat] = useState(false);

  const handleVerifyChannel = (id_product) => {
    const verifyChannel = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_PUBLIC_API
          }channels?id_user=${1}&id_service_line=${id_product}`
        );
        if (response.data.id_channel) {
          setRoom(response.data.id_channel);
          socket.emit("join_room", room);
          setShowChat(true);
        }
      } catch (err) {
        console.log("Error");
      }
    };
    verifyChannel();
  };

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
          {/* <input
            className="logInput"
            placeholder="Nombre..."
            onChange={(event) => setUsername(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && joinRoom()}
          />
          {/* <input
            placeholder="Room..."
            onChange={(event) => setRoom(event.target.value)}
          /> */}
          {/* <button
            className={`${!(username.length > 0) && "disabled"}`}
            onClick={() => joinRoom()}
          >
            {"¡Chat!"}
          </button>{" "} */}
          <ServicesList handleVerifyChannel={handleVerifyChannel} />
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
