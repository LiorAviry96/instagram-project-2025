/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userService } from "../services/users/user.service"; // Ensure this imports the user service correctly
import {
  socketService,
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EMIT_SET_TOPIC,
} from "../services/socket.service";
import EmojiPicker from "emoji-picker-react";
import { SvgIcon } from "../cmps/SvgIcon";

export function Chat() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [topic, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [msg, setMsg] = useState({ txt: "" });
  const [msgs, setMsgs] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const loggedInUser = useSelector((state) => state.userModule.user);

  useEffect(() => {
    loadUsers();
  }, []);

  /*useEffect(() => {
    socketService.on(SOCKET_EVENT_ADD_MSG, addMsg);
    return () => {
      socketService.off(SOCKET_EVENT_ADD_MSG, addMsg);
    };
  }, []);*/

  // Fetch all users from the userService, similar to what you did in the search page
  async function loadUsers() {
    const users = await userService.getUsers(); // Replace with the actual function that gets all users
    setUsers(users);
  }

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(users);
    } else {
      const results = users.filter((user) =>
        user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm, users]);

  const handleChatClick = (user) => {
    setSelectedChat(user);
  };

  function addMsg(newMsg) {
    setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
  }

  function handleFormChange(ev) {
    const { name, value } = ev.target;
    setMsg((prevMsg) => ({ ...prevMsg, [name]: value }));
  }

  function sendMsg(ev) {
    ev.preventDefault();
    const from = loggedInUser?.fullname || "Me";
    const newMsg = { from, txt: msg.txt };
    socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg);
    setMsg({ txt: "" });
  }

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => ({ ...prev, txt: prev.txt + emojiObject.emoji }));
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  const handleEmojiButtonClick = (e) => {
    setShowEmojiPicker((prev) => !prev);
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const topPosition = buttonRect.top + window.scrollY - 250; // Adjust height
    document.documentElement.style.setProperty(
      "--emoji-picker-top",
      `${topPosition}px`
    );
    document.documentElement.style.setProperty(
      "--emoji-picker-left",
      `${buttonRect.left}px`
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMsg();
    }
  };
  return (
    <div className="chat-container">
      {/* Chat Sidebar */}
      <div className="chat-sidebar">
        <div className="username-chat">
          <h3>{selectedChat?.fullname}</h3>
        </div>

        <div className="chat-list">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="chat-item"
              onClick={() => handleChatClick(user)}
            >
              <img
                src={`/src/assets/images/${user.imgUrl}.jpeg`} // Replace with your image path
                alt={user.fullname}
                className="chat-user-avatar"
              />
              <span className="chat-user">{user.fullname}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Chat */}
      <div className="selected-chat">
        {selectedChat ? (
          <>
            <div
              className="chat-header"
              name="topic"
              value={`${selectedChat._id}`}
              onClick={({ target }) => setRoom(target.value)}
            >
              <Link className="owner-story" to={`/user/${selectedChat._id}`}>
                <img
                  src={`/src/assets/images/${selectedChat.imgUrl}.jpeg`} // Replace with your image path
                  alt={selectedChat.fullname}
                  className="chat-header-avatar"
                />
                <span>{selectedChat.fullname}</span>
              </Link>
            </div>
            <div className="divider--modal"></div>

            <div className="chat-messages">
              {/* This will be your message history (if any) */}

              <ul className="chat-message-list">
                {msgs.map((msg, idx) => (
                  <li key={idx} className="chat-message">
                    <strong>{msg.from}:</strong> {msg.txt}
                  </li>
                ))}
              </ul>
              <form onSubmit={sendMsg} className="chat-input-form">
                <SvgIcon
                  iconName="emojiBig"
                  onClick={handleEmojiButtonClick}
                  className="emoji-button"
                />
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <input
                  type="text"
                  value={msg.txt}
                  onChange={handleFormChange}
                  name="txt"
                  placeholder="Type a message..."
                  autoComplete="off"
                  className="chat-input"
                  onKeyDown={handleKeyDown}
                />
                {msg.txt && (
                  <button type="submit" className="chat-submit-btn">
                    Send
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <span>Select a user to start chatting</span>
          </div>
        )}
      </div>
    </div>
  );
}
