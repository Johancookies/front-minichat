import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { IconBT } from "./icons";
import ServicesList from "./ServicesList";
import axios from "axios";
import MeetingsList from "./MeetingsList";

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
          }channels?id_user=${username}&id_service_line=${id_product}`
        );
        if (response.data.id_channel) {
          const auxRoom = response.data.id_channel;
          socket.emit("join_room", auxRoom);
          setRoom(auxRoom);
          setShowChat(true);
        }
      } catch (err) {
        console.log("Error");
      }
    };
    verifyChannel();
  };

  // const joinRoom = () => {
  //   socket.emit("join_room", room);
  //   setShowChat(true);
  // };

  return (
    <>
      {!showChat ? (
        <div className="app">
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
        </div>
      ) : (
        <div className="meetingsContainer">
          <MeetingsList />
          <Chat socket={socket} username={username} room={room} />
        </div>
      )}
    </>
  );
}

export default App;
