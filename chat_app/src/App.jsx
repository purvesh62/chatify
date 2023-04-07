import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Sockette from "sockette";

import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import ChatRoom from "./pages/ChatRoom";
import Chat from "./components/Chat"
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/chatroom" element={<ChatRoom />}></Route>
      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  );
}

export default App;
