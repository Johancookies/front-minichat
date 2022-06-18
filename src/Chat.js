import { useState, useEffect } from "react";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import useIndexedDB from "./useIndexedDB";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { handleStoreLocalMessage, currentMessages, setCurrentRoom } =
    useIndexedDB();

  const sendMessage = () => {
    const messageData = {
      room: room,
      author: username,
      content: currentMessage,
    };
    socket.emit("send_message", messageData);
    handleStoreLocalMessage(messageData);
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (!messageList.includes(data)) {
        handleStoreLocalMessage(data);
        setMessageList((list) => [...list, data]);
      }
    });
  }, [socket]);

  useEffect(() => {
    setCurrentRoom(room);
    setMessageList(currentMessages);
    console.log(currentMessages);
  }, [currentMessages]);

  return (
    <div className="chatContainer">
      <div className="roomContainer">
        <div className="userOnline">
          <div className="indicator" />
          <span>{username}</span>
        </div>
        <div className="roomNumber">
          <b>{room}</b>
        </div>
      </div>

      <div className="chatContent">
        {/* <ScrollToBottom className="scrollToBottom"> */}
        {messageList?.map((messageContent, x) => (
          <div
            key={x}
            className={`messageContainer ${
              messageContent.author === username ? "toRight" : ""
            }`}
          >
            <div
              className={`message ${
                messageContent.author === username ? "currentUser" : ""
              }`}
            >
              <span className="author">{messageContent.author}</span>
              <span>{messageContent.content}</span>
            </div>
          </div>
        ))}
        {/* </ScrollToBottom> */}
      </div>

      <div className="chatFooter">
        <input
          type="text"
          placeholder="..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <div
          className={`sendButton ${!currentMessage.length > 0 && "disabled"}`}
          onClick={() => {
            sendMessage();
          }}
        >
          &#9658;
        </div>
      </div>
    </div>
  );
}
