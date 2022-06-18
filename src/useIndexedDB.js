import { useEffect, useState } from "react";

function useIndexedDB() {
  const [currentData, setCurrentData] = useState(false);
  const [currentAction, setCurrentAction] = useState("getMessages");
  const [currentRoom, setCurrentRoom] = useState(false);

  const [currentMessages, setCurrentMessages] = useState([]);

  useEffect(() => {
    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;

    if (!indexedDB) {
      console.log("indexedDB could not be found in this browser.");
      return;
    }

    const request = indexedDB.open("MessagesDB", 1);

    request.onerror = function (event) {
      console.log("An error occurred with indexedDB", event);
    };

    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("messages", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("room", ["room"], { unique: false });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["messages"], "readwrite");
      const store = transaction.objectStore("messages");

      if (currentAction === "storeMessage") {
        store.add(currentData);
      }

      if (currentRoom && currentAction === "getMessages") {
        const index = store.index("room");
        const request = index.getAll([currentRoom]);

        request.onsuccess = function () {
          setCurrentMessages(request.result);
        };

        request.onerror = function () {
          console.log("Error getting messages");
        };
      }

      transaction.oncomplete = function () {
        db.close();
      };
    };
  }, [currentAction, currentData, currentRoom]);

  const handleStoreLocalMessage = (data) => {
    if (data) {
      setCurrentAction("storeMessage");
      setCurrentData(data);
    }
  };

  return { handleStoreLocalMessage, currentMessages, setCurrentRoom };
}

export default useIndexedDB;
