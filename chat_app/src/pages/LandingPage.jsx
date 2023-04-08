import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Home = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [createRoomUsername, setCreateRoomUsername] = useState("");
  const [joinRoomUsername, setJoinRoomUsername] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title)
      window.location.reload(false);
    }
  }, []);

  const handleCreateRoom = (e) => {
    // e.preventDefault();
    console.log("create room username: ", createRoomUsername);
    // localStorage.setItem("username", createRoomUsername);
    navigate("/chatroom", {
      state: { username: createRoomUsername, type: "create_room" },
    });
  };

  const handleJoinRoom = (e) => {
    // e.preventDefault();
    console.log("join room username: ", joinRoomUsername);
    console.log("join room id: ", joinRoomId);
    localStorage.setItem("username", joinRoomUsername);
    navigate("/chatroom", {
      state: {
        username: joinRoomUsername,
        roomId: joinRoomId,
        type: "join_room",
      },
    });
    // navigate("/chatroom");
  };

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };

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
          <div className="flex justify-center items-center">
            <div className="w-full lg:max-w-xl  p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800 items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Let's chat!
              </h2>

              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul
                  className="flex flex-wrap -mb-px text-sm font-medium text-center"
                  id="myTab"
                  data-tabs-toggle="#myTabContent"
                  role="tablist">
                  <li className="mr-2" role="presentation">
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg"
                      id="create-room"
                      data-tabs-target="#profile"
                      type="button"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false">
                      Create Room
                    </button>
                  </li>
                  <li className="mr-2" role="presentation">
                    <button
                      className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      id="join-room"
                      data-tabs-target="#dashboard"
                      type="button"
                      role="tab"
                      aria-controls="dashboard"
                      aria-selected="false">
                      Join Room
                    </button>
                  </li>
                </ul>
              </div>
              <div id="myTabContent">
                <div
                  className="hidden px-4 rounded-lg "
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="create-room">
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
                      <input
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
                    <button
                      type="submit"
                      className="w-full px-2 py-2.5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Create Room
                    </button>
                  </form>
                </div>
                {/* Join room */}
                <div
                  className="hidden px-4 rounded-lg "
                  id="dashboard"
                  role="tabpanel"
                  aria-labelledby="join-room">
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
                      <input
                        value={joinRoomUsername}
                        onChange={(e) => setJoinRoomUsername(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="join-room-ip"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Room ID
                      </label>
                      <input
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
                    <button
                      type="submit"
                      className="w-full px-2 py-2.5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Join Room
                    </button>
                  </form>
                </div>
                <div
                  className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  id="settings"
                  role="tabpanel"
                  aria-labelledby="settings-tab">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This is some placeholder content the{" "}
                    <strong className="font-medium text-gray-800 dark:text-white">
                      Settings tab's associated content
                    </strong>
                    . Clicking another tab will toggle the visibility of this
                    one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                  </p>
                </div>
                <div
                  className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  id="contacts"
                  role="tabpanel"
                  aria-labelledby="contacts-tab">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This is some placeholder content the{" "}
                    <strong className="font-medium text-gray-800 dark:text-white">
                      Contacts tab's associated content
                    </strong>
                    . Clicking another tab will toggle the visibility of this
                    one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
