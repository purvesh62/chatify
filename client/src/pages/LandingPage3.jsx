import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Home = (props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let previousRoomId = localStorage.getItem("room");
  const navigate = useNavigate();
  const location = useLocation();

  const [createRoomUsername, setCreateRoomUsername] = useState("");
  const [joinRoomUsername, setJoinRoomUsername] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
      window.location.reload(false);
    }
  }, []);

  const handleCreateRoom = (e) => {
    navigate("/chatroom", {
      state: { username: createRoomUsername, type: "create_room" },
    });
  };

  const handleJoinRoom = (e) => {
    localStorage.setItem("username", joinRoomUsername);
    navigate("/chatroom", {
      state: {
        username: joinRoomUsername,
        roomId: joinRoomId,
        type: "join_room",
      },
    });
  };

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div className="h-full bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="h-screen py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 lg:gap-16">
          {/* Jumpotron Header */}
          <div className="flex flex-col justify-center px-4">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                Chatify!
              </span>
            </h1>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <p className="text-lg font-normal text-gray-500 lg:text-xl mb-2 dark:text-gray-400">
              Create your own chat room and invite your friends to join you! Our
              chat room application allows you to create a private chat room and
              start chatting with your friends in seconds. Join us now and start
              chatting with your friends!
            </p>
            <button
              onClick={() => {
                navigate("/about");
              }}
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
            </button>
          </div>

          {/* Create Room Form */}
          <div className="flex justify-center items-center">
            <div className="w-full lg:max-w-xl  p-6 space-y-2 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800 items-center">
              <h1 className="mb-4 text-xl font-extrabold text-gray-700 dark:text-white md:text-4xl lg:text-5xl">
                Let's chat!
              </h1>
              {previousRoomId !== null && (
                <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                  Most recent Room ID:{" "}
                  <mark className="px-1 py-0.5 text-white bg-blue-600 rounded dark:bg-blue-500">
                    {localStorage.getItem("room")}
                  </mark>
                </p>
              )}
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    <Tab label="Create Room" {...a11yProps(0)} />
                    <Tab label="Join Room" {...a11yProps(1)} />
                  </Tabs>
                </Box>

                <CustomTabPanel value={value} index={0}>
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      handleCreateRoom(e);
                    }}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your name
                      </label>
                      <TextField
                        value={createRoomUsername}
                        onChange={(e) => setCreateRoomUsername(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <Button
                      sx={{ borderRadius: "5px"}}
                      variant="contained"
                      type="submit"
                      className="w-full px-2 py-2.5 text-base font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Create Room
                    </Button>
                  </form>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      handleJoinRoom(e);
                    }}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your name
                      </label>
                      <TextField
                        onChange={(e) => setJoinRoomUsername(e.target.value)}
                        name="name"
                        id="name"
                        placeholder="Your name"
                        value={joinRoomUsername}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="join-room-ip"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Room ID
                      </label>
                      <TextField
                        value={joinRoomId}
                        onChange={(e) => setJoinRoomId(e.target.value)}
                        type="text"
                        name="join-room-ip"
                        id="join-room-ip"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Room ID"
                        required
                      />
                    </div>
                    <Button
                      variant="contained"
                      type="submit"
                      className="w-full px-2 py-2.5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Join Room
                    </Button>
                  </form>
                </CustomTabPanel>
              </Box>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
