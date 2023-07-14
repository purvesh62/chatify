import { useState, useEffect } from "react";
import Sockette from "sockette";

let ws = null;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState();

  useEffect(() => {
    ws = new Sockette(import.meta.env.VITE_APP_SOCKET_URL, {
      timeout: 3000,
      maxAttempts: 3,
      onopen: (e) => onConnect(e),
      onmessage: (e) => onMessage(e),
      onreconnect: (e) => console.log("Reconnecting...", e),
      onmaximum: (e) => console.log("Stop Attempting!", e),
      onclose: (e) => onDisconnect(e),
      onerror: (e) => onError(e),
    });
    return function cleanup() {
      ws && ws.close();
      ws = null;
    };
  }, []);

  function onConnect(e) {
    console.log("Connected ", e);
  }

  function onMessage(e) {
    console.log("Message Received:", e);
    let data = JSON.parse(e.data);
    if (data.type === "create_room" || data.type === "join_room") {
      localStorage.setItem("room_id", data.room_id);
      setRoomName(data.room_id);
    } else if (data.type === "chat") {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    }
  }

  function onDisconnect(e) {
    console.log("Disconnected.", e);
  }

  function onError(e) {
    console.log("Error:", e);
  }

  function handleClick() {
    ws.json({
      action: "create_room",
      message: "Hello",
    });
  }

  function handleDisconnect() {
    ws.close();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const room = e.target.elements["room-name"].value;
    ws.json({
      action: "join_room",
      message: "Hello",
      room_id: room,
    });
  }

  function sendMessage(e) {
    console.log("Submitted");
    e.preventDefault();
    // let message = e.target.firstChild.value;
    let message = e.target.children[2].value;
    ws.json({
      action: "chat",
      message: message,
    });
  }

  return (
    <div className="h-screen bg-gray-50">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="h-screen py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Jumpotron Header */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Chat Room
            </h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
              Here at Flowbite we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">
              Read more about our app
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </div>
          
          {/* Create Room Form */}
          <div className="flex h-92">
            <div className="w-full lg:max-w-xl  p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800 items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Let's chat!
              </h2>
              <form className="mt-8 space-y-6" action="#">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-2 py-2.5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Create Room
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    //   <div className="px-1">
    //     <div>
    //       <div>
    //         <button
    //           onClick={() => {
    //             handleClick();
    //           }}>
    //           Create Room
    //         </button>
    //         <button
    //           onClick={() => {
    //             handleDisconnect();
    //           }}>
    //           Disconnect
    //         </button>
    //       </div>
    //       <div>
    //         <form onSubmit={(e) => handleSubmit(e)}>
    //           <input
    //             className="bg-gray-50 border-1 border-sky-500"
    //             type="room-name"
    //             name="room-name"
    //             id=""
    //             placeholder="Join room?"
    //           />
    //           <button type="submit">Submit</button>
    //         </form>
    //       </div>

    //       {/* {roomName && (
    //         <div>
    //           {roomName}
    //           <form
    //             onSubmit={(e) => {
    //               sendMessage(e);
    //             }}>
    //             <input type="message" name="message" id="message" />
    //             <button type="submit">Send message</button>
    //           </form>
    //           <div>
    //             {messages.length}
    //             {messages.map((m) => {
    //               return (
    //                 <p className={{ color: "black" }} key={m}>
    //                   {m}
    //                 </p>
    //               );
    //             })}
    //           </div>
    //         </div>
    //       )} */}
    //       {roomName && <Text messages={messages} sendMessage={sendMessage} />}
    //     </div>
    //   </div>
    // </div>
  );
}
