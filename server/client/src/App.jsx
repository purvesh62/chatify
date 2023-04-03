import { useState, useEffect } from 'react'
import './App.css'
import Sockette from 'sockette'
let ws = null;

function App() {
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState();

  useEffect(() => {
    ws = new Sockette(
      "wss://2b53u49ch2.execute-api.us-east-1.amazonaws.com/production",
      {
        timeout: 5e3,
        maxAttempts: 1,
        onopen: e => console.log("connected:", e),
        onmessage: e => onMessage(e),
        onreconnect: e => console.log("Reconnecting...", e),
        onmaximum: e => console.log("Stop Attempting!", e),
        onclose: e => console.log("Closed!", e),
        onerror: e => console.log("Error:", e)
      }
    );
    return function cleanup() {
      ws && ws.close();
      ws = null;
    };
  }, [])

  function onMessage(e) {
    console.log("Message Received:", e)
    let data = JSON.parse(e.data);
    if (data.type === 'create_room' || data.type === 'join_room') {
      localStorage.setItem("room_id", data.room_id)
      setRoomName(data.room_id);
    }
    else if (data.type === 'chat') {
      setMessages(prevMessages => [...prevMessages, data.message]);
    }
  }

  function handleClick() {
    ws.json({
      action: "create_room",
      message: "Hello"
    });
  };

  function handleDisconnect() {
    ws.close();
  };

  function handleSubmit(e) {
    e.preventDefault();
    const room = e.target.elements["room-name"].value;
    ws.json({
      action: "join_room",
      message: "Hello",
      room_id: room
    });
  }

  function sendMessage(e) {
    e.preventDefault();
    let message = e.target.firstChild.value;
    ws.json({
      action: "chat",
      message: message,
    });
  }

  // ws.send('Hello, world!');
  // ws.json({ action: 'create_room' });
  // ws.close(); // graceful shutdown

  // Reconnect 10s later
  // setTimeout(ws.reconnect, 10e3);
  return (
    <div>
      <p>React App</p>
      <div>
        <button onClick={() => { handleClick() }}>Create Room</button>
        <button onClick={() => { handleDisconnect() }}>Disconnect</button>
      </div>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="room-name" name="room-name" id="" placeholder='Join room?' />
          <button type='submit'>Submit</button>
        </form>
      </div>

      {roomName && <div>
        {roomName}
        <form onSubmit={(e) => { sendMessage(e) }}>
          <input type="message" name="message" id="message" />
          <button type='submit'>Send message</button>
        </form>
        <div>
          {messages.length}
          {messages.map(m => {
            return <p className={{ color: "black" }} key={m}>{m}</p>;
          })}
        </div>
      </div>}
    </div>
  )
}

export default App
