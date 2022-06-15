import { useState, useEffect } from "react";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    await socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

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
        {messageList?.map((messageContent) => (
          <h6>{messageContent.message}</h6>
        ))}
      </div>
      <div className="chatFooter">
        <input
          type="text"
          placeholder="..."
          onChange={(event) => setCurrentMessage(event.target.value)}
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
