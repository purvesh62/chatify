import React from "react";
import LeftBubble from "./LeftBubble";
import RightBubble from "./RightBubble";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ChatArea(props) {
  const [imgGif, setImgGif] = useState(
    "https://gif-avatars.com/img/100x100/nicki-minaj-1.gif"
  );

  let messages = props.messages;

  let bubbles = messages.map((m, index) => {
    if (props.username === m.username) {
      return <RightBubble key={index} data={m} />;
    } else {
      return <LeftBubble key={index} data={m} />;
    }
  });
  // ref={messagesEndRef}
  console.log(bubbles);

  useEffect(() => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes&tag=chat&rating=pg-13`
      )
      .then((res) => {
        setImgGif(res.data.data.images.original.url);
      });
  }, []);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  scrollToBottom();

  return (
    <div className="container h-screen flex items-center align-middle lg:px-32">
      <div className="min-w-full mx-auto border-8 border-gray-500 rounded">
        <div className="w-full">
          {/* Header */}
          <div className="relative p-5 border-b border-gray-300 flex justify-between">
            <div className="flex items-start">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src={
                  imgGif
                    ? imgGif
                    : "https://gif-avatars.com/img/100x100/nicki-minaj-1.gif"
                }
                alt="username"
              />
              <div className="flex flex-col">
                <span className="block ml-2 font-bold text-gray-600">
                  Room ID: {props.roomId}
                </span>
                <span className="block ml-2 text-l text-gray-600">
                  Name: {props.username}
                </span>
              </div>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-12 top-5"></span>
            </div>
            <div className="flex flex-col">
              <button
                onClick={(e) => {
                  props.disconnectChat(e);
                }}
                type="button"
                className="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                Disconnect
              </button>
              <select
                defaultValue={"en"}
                className="select border-gray-300 bg-white w-full"
                id="language">
                <option value={"en"}>
                  English
                </option>
                <option value={"ar"}>Arabic</option>
                <option value={"zh"}>Chinese</option>
                <option value={"fr"}>French</option>
                <option value={"gu"}>Gujarati</option>
                <option value={"hi"}>Hindi</option>
                <option value={"pa"}>Punjabi</option>
                <option value={"es"}>Spanish</option>
                <option value={"ta"}>Tamil</option>
                <option value={"te"}>Telugu</option>
              </select>
            </div>
          </div>

          <div
            className="relative w-full py-4 px-2 overflow-y-auto h-[30rem]"
            >
              {/* ref={messagesEndRef} */}
            {bubbles}
          </div>

          <form
            className="flex items-center justify-between w-full p-3 border-t border-gray-300"
            onSubmit={(e) => {
              props.sendMessage(e);
            }}>
            <input
              type="text"
              placeholder="Message"
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              id="message"
              required
            />
            <button type="submit">
              <svg
                className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
