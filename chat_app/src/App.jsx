import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import ChatRoom from "./pages/ChatRoom";
import About from "./pages/About";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/chatroom" element={<ChatRoom />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  );
}

export default App;
