import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import ImageInfo from "./pages/ImageInfo";
import SignUp from "./pages/SignUp";
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {

  return (
    <>
      <Routes>
        {/* Authentication */}
        <Route path="/signin" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>

        {/* Protected Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/info" element={<ImageInfo />}></Route>
        </Route>
      </Routes>

    </>
  )
}

export default App
