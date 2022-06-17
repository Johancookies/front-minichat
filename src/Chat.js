import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time: toString(new Date()),
    };
    await socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (!messageList.includes(data)) {
        setMessageList((list) => [...list, data]);
      }
    });
  }, [socket]);

  // useLayoutEffect(() => {
  //   const getRoomChats = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://172.28.60.15:3001/chats/${room}`
  //       );
  //       setMessageList(response.data.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getRoomChats();
  // }, []);

  // useEffect(() => {
  //   window.scrollTo(0, document.body.scrollHeight);
  // }, []);

  return (
    <div className="chatContainer">
      <div className="roomContainer">
        <div className="userOnline">
          <div className="indicator"></div>
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
              <span>{messageContent.message}</span>
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
          onClick={() => sendMessage()}
        >
          &#9658;
        </div>
      </div>
    </div>
  );
}
