import { useState, useEffect } from "react";
import axios from "axios";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time: new Date(),
    };
    await socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (!messageList.includes(data)) {
        setMessageList((list) => [...list, data]);
      }
    });
  }, [socket]);

  useEffect(() => {
    const getRoomChats = async () => {
      try {
        const response = await axios.get(
          `http://172.28.60.15:3001/chats/${room}`
        );
        setMessageList(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRoomChats();
  }, []);

  return (
    <div className="chatContainer">
      <div className="roomContainer">
        <div>
          <span>&#9786;</span>
          {username}
        </div>
        <span>&#9762;</span>
        <div>
          <span>&#9773;</span>
          {room}
        </div>
      </div>
      <div className="chatContent">
        {messageList?.map((messageContent, x) => (
          <div
            key={x}
            className={`messageContainer ${
              messageContent.author === username ? "toRight" : ""
            }`}
          >
            <div
              className={`message ${
                messageContent.author === username ? "" : ""
              }`}
            >
              <span className="username">{messageContent.author}</span>
              <i>{messageContent.message}</i>
            </div>
          </div>
        ))}
      </div>
      <div className="chatFooter">
        <input
          type="text"
          placeholder="..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button
          className={`${!currentMessage.length > 0 && "disabled"}`}
          onClick={() => sendMessage()}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}
