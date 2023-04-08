import { useEffect, useState } from "react";
import Sockette from "sockette";
import { useLocation } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import { useNavigate } from "react-router-dom";

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
    // if (e) {
    //   e.returnValue =
    //     "If you refresh the browser then you might lose the access to the chatroom"; // Legacy method for cross browser support; // Legacy method for cross browser support
    // }
    alert(
      "On refresh you might lose the access to the chatroom. Do you want to continue? (y/n)"
    );
    navigate("/", {
      state: {
        reload: true,
      },
    });
    // return "If you refresh the browser then you might lose the access to the chatroom"; // Legacy method for cross browser support
  };

  function onConnect(e) {
    console.log("Connected ", e);
    if (location.state.type == "create_room") {
      console.log("creating room");
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
    let data = JSON.parse(e.data);
    console.log("Message Received:", data);
    if (data.type === "create_room") {
      setSocketRoomId(data.room_id);
    } else if (data.type === "join_room") {
      setSocketRoomId(data.room_id);
    } else if (data.type === "chat") {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    }
  }

  function onDisconnect(e) {
    console.log("Disconnected.", e);
  }

  function sendMessage(e) {
    console.log("Submitted");
    e.preventDefault();
    let message = e.target.children[2].value;
    e.target.children[2].value = "";
    sc.json({
      action: "chat",
      message: {
        message: message,
        username: username,
      },
    });
  }

  function disconnectChat(e) {
    e.preventDefault();
    console.log("Disconnecting...");
    sc.close(); // graceful shutdown
    navigate("/", {
      state: {
        reload: true,
      },
    });
  }

  return (
    <div className="h-screen flex justify-center">
      <ChatArea
        messages={messages}
        sendMessage={sendMessage}
        roomId={socketRoomId}
        username={username}
        disconnectChat={disconnectChat}
      />
    </div>
  );
}
