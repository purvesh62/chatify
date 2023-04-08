import React from "react";
import LeftBubble from "./LeftBubble";
import RightBubble from "./RightBubble";
import { useEffect, useRef } from "react";

export default function ChatArea(props) {
  console.log("props: ", props);
  let messages = props.messages;

  let bubbles = messages.map((m) => {
    if (props.username === m.username) {
      return <RightBubble data={m} />;
    } else {
      return <LeftBubble data={m} />;
    }
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  scrollToBottom();

  return (
    <div className="container h-screen flex items-center align-middle px-32">
      <div className="min-w-full mx-auto border-8 border-gray-500 rounded lg:block">
        <div className="w-full">
          {/* Header */}
          <div className="relative p-3 border-b border-gray-300 flex justify-between">
            <div className="flex items-center">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="https://gif-avatars.com/img/100x100/nicki-minaj-1.gif"
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
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>
            <div>
              <button
                onClick={(e) => {
                  props.disconnectChat(e);
                }}
                type="button"
                class="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                Disconnect
              </button>
            </div>
          </div>

          <div
            className="relative w-full p-6 overflow-y-auto h-[30rem]"
            ref={messagesEndRef}>
            {bubbles}
          </div>

          <form
            className="flex items-center justify-between w-full p-3 border-t border-gray-300"
            onSubmit={(e) => {
              props.sendMessage(e);
            }}>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Message"
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              required
            />
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
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
