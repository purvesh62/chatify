import { useEffect, useState } from "react";
import Sockette from "sockette";
import { useLocation } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

let sc = null;

export default function ChatRoom({ props }) {
  const navigate = useNavigate();

  const location = useLocation();
  let { username, roomId, type } = location.state;
  const [socketRoomId, setSocketRoomId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    sc = new Sockette(import.meta.env.VITE_APP_SOCKET_URL, {
      timeout: 3000,
      maxAttempts: 3,
      onopen: (e) => onConnect(e),
      onmessage: (e) => onMessage(e),
      onreconnect: (e) => console.log("Reconnecting...", e),
      onmaximum: (e) => console.log("Stop Attempting!", e),
      onclose: (e) => onDisconnect(e),
      onerror: (e) => console.log("On error: ", e),
    });
  }, []);

  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    alert(
      "On refresh you might lose the access to the chatroom. Do you want to continue? (y/n)"
    );
    navigate("/", {
      state: {
        reload: true,
      },
    });
  };

  function onConnect(e) {
    // console.log("Connected ", e);
    if (location.state.type == "create_room") {
      // console.log("creating room");
      sc.json({
        action: "create_room",
        message: {
          username: location.state.username,
        },
      });
    } else if (location.state.type == "join_room") {
      sc.json({
        action: "join_room",
        message: {
          username: location.state.username,
        },
        room_id: roomId,
      });
    }
  }

  function onMessage(e) {
    if (e.data === "") {
      return;
    }
    let data = JSON.parse(e.data);
    // console.log("Incoming message: ", data);
    if (data.type === "create_room") {
      localStorage.setItem("room", data.room_id);
      setSocketRoomId(data.room_id);
    } else if (data.type === "join_room" && data.room_id !== undefined) {
      localStorage.setItem("room", data.room_id);
      setSocketRoomId(data.room_id);
    } else if (data.type === "chat") {
      let selectedLanguage = document.getElementById("language").value;
      if (
        username !== data.message.username &&
        selectedLanguage !== data.message.language &&
        data.message.language !== undefined
      ) {
        console.log(
          `Translating... ${data.message.message} ${selectedLanguage}`
        );
        axios
          .post(import.meta.env.VITE_APP_TRANSLATE_URL, {
            message: data.message.message,
            language: selectedLanguage,
          })
          .then(function (response) {
            if (response.data !== undefined) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  message: response.data.translated_text,
                  username: data.message.username,
                  language: selectedLanguage,
                },
              ]);
            }
          })
          .catch(function (error) {
            console.log(error);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                message: "Error while translated text...",
                username: "System",
                language: selectedLanguage,
              },
              {
                message: data.message.message,
                username: data.message.username,
                language: selectedLanguage,
              },
            ]);
            document.getElementById("language").value = "en";
          });
      } else {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    } else {
      navigate("/", { state: data });
    }
  }

  function onDisconnect(e) {
    console.log("Disconnected.", e);
  }

  function sendMessage(e) {
    e.preventDefault();
    let message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    sc.json({
      action: "chat",
      message: {
        message: message,
        username: username,
        language: document.getElementById("language").value,
      },
    });
  }

  function disconnectChat(e) {
    e.preventDefault();
    sc.close(); // graceful shutdown
    navigate("/", {
      state: {
        reload: true,
      },
    });
  }

  return (
    <div>
      <div className="h-screen flex justify-center py-1">
        <ChatArea
          messages={messages}
          sendMessage={sendMessage}
          roomId={socketRoomId}
          username={username}
          disconnectChat={disconnectChat}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
