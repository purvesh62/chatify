import { useEffect, useState } from "react";
import Sockette from "sockette";
import { useLocation } from "react-router-dom";
import Text from "../components/Text";

let sc = null;

export default function ChatRoom({ props }) {
  const location = useLocation();
  let { username, roomId, type } = location.state;
  const [socketRoomId, setSocketRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  // console.log(username);
  // console.log(roomId);
  // console.log(type);

  useEffect(() => {
    sc = new Sockette(import.meta.env.VITE_APP_SOCKET_URL, {
      timeout: 3000,
      maxAttempts: 3,
      onopen: (e) => onConnect(e),
      onmessage: (e) => onMessage(e),
      onreconnect: (e) => console.log("Reconnecting...", e),
      onmaximum: (e) => console.log("Stop Attempting!", e),
      onclose: (e) => onDisconnect(e),
      onerror: (e) => onError(e),
    });
  }, []);

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

  return (
    <div className="h-screen flex justify-center">
      <Text
        messages={messages}
        sendMessage={sendMessage}
        roomId={socketRoomId}
        username={username}
      />
    </div>
  );
}
