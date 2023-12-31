import React from "react";

export default function RightBubble({data}) {
  return (
    <div className="chat chat-end lg:mr-4 xs:mr-1 mb-1 flex flex-col">

      <div className="chat-header mb-1 text-gray-700">
        {data.username}
        {/*<time className="text-xs opacity-50 ml-2 text-gray-700">12:45</time>*/}
      </div>

      <div className="flex flex-row-reverse gap-2">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full border-1 border-gray-50">
            <p className="h-full text-center pt-1.5 chat-bubble-warning">{data.username && data.username[0]}</p>
          </div>
        </div>

        <div className="chat-bubble chat-bubble-warning text-gray-900">
          {data.message}
        </div>
      </div>
    </div>
  );
}
