import { useState, useEffect } from "react";
import axios from "axios";
import useIndexedDB from "./useIndexedDB";
import { ArrowIcon } from "./icons";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { handleStoreLocalMessage, currentMessages, setCurrentRoom } =
    useIndexedDB();

  const sendMessage = async () => {
    const messageData = {
      id_channel: room,
      author: username,
      content: currentMessage,
    };
    // socket.emit("send_message", messageData);
    const response = await axios.post(
      `${process.env.REACT_APP_PUBLIC_API}messages`,
      messageData
    );
    if (response.status === 200) {
      // handleStoreLocalMessage(messageData);
      // setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    console.log("socket updated");
    socket.on("receive_message", (data) => {
      console.log(data);
      if (!messageList.some((item) => item.id === data.id)) {
        // handleStoreLocalMessage(data);
        setMessageList((list) => [...list, data]);
      }
    });
  }, [socket]);

  useEffect(() => {
    const getMessages = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_PUBLIC_API}messages/by-channel?id_channel=${room}`
      );
      if (response.data.data) {
        setMessageList(response.data.data)
      }
    }
    getMessages()
    setCurrentRoom(room);
    setMessageList(currentMessages);
    window.scrollTo(0, document.body.scrollHeight);
  }, [currentMessages]);

  return (
    <div className="chatContainer">
      <div className="roomContainer">
        <div className="userOnline">
          <div className={`indicator ${socket.connected ? "connected" : ""}`} />
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
          <ArrowIcon size={18} />
        </div>
      </div>
    </div>
  );
}
