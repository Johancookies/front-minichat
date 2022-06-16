import { useState, useEffect } from "react";

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
              <span>{messageContent.message}</span>
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
