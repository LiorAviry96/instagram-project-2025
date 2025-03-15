/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userService } from "../services/users";
import {
  socketService,
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EMIT_SET_TOPIC,
} from "../services/socket.service";
import EmojiPicker from "emoji-picker-react";
import { SvgIcon } from "../cmps/SvgIcon";
import { PostContext } from "../cmps/contexts/PostContext";

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
  const { getImageSrc } = useContext(PostContext);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    socketService.on(SOCKET_EVENT_ADD_MSG, addMsg);
    //console.log("msg", msg);

    return () => {
      socketService.off(SOCKET_EVENT_ADD_MSG, addMsg);
    };
  }, []);

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, topic);
  }, [topic]);

  useEffect(() => {
    if (selectedChat) {
      loadChatMessages();
    }
  }, [selectedChat]);

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

  async function loadUsers() {
    try {
      const users = await userService.getUsers();
      setUsers(users);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  }

  async function loadChatMessages() {
    if (!loggedInUser || !selectedChat) return;
    try {
      const chatMessages = await userService.getChatMessages(
        loggedInUser._id,
        selectedChat._id
      );
      console.log("Chat messages:", chatMessages);
      setMsgs(chatMessages);
    } catch (err) {
      console.error("Failed to load chat messages", err);
    }
  }

  const handleChatClick = (user) => {
    setSelectedChat(user);
  };

  function addMsg(newMsg) {
    console.log("added message");
    setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
  }

  function handleFormChange(ev) {
    const { name, value } = ev.target;
    setMsg((prevMsg) => ({ ...prevMsg, [name]: value }));
  }

  async function sendMsg(ev) {
    ev.preventDefault();
    const from = loggedInUser?.fullname || "Me";
    const imgUrl = loggedInUser?.imgUrl || "Me";
    const newMsg = { from, txt: msg.txt, imgUrl };

    socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg);

    try {
      await userService.addUserMsg(loggedInUser._id, selectedChat, msg.txt);
    } catch (err) {
      console.error("Message sending failed", err);
    }

    setMsg({ txt: "" });
  }

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => ({ ...prev, txt: prev.txt + emojiObject.emoji }));
    setShowEmojiPicker(false);
  };

  const handleEmojiButtonClick = (e) => {
    setShowEmojiPicker((prev) => !prev);
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const topPosition = buttonRect.top + window.scrollY - 250;
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
      e.preventDefault();
      sendMsg(e);
    }
  };

  return (
    <div className="chat-container">
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
                src={
                  user.imgUrl
                    ? getImageSrc(user.imgUrl)
                    : "/default-avatar.jpeg"
                }
                alt={user.fullname}
                className="chat-user-avatar"
              />
              <span className="chat-user">{user.fullname}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="selected-chat">
        {selectedChat ? (
          <>
            <div
              className="chat-header"
              onClick={() => setRoom(selectedChat._id)}
            >
              <Link className="owner-story" to={`/user/${selectedChat._id}`}>
                <img
                  src={getImageSrc(selectedChat.imgUrl)}
                  alt={selectedChat.fullname}
                  className="chat-header-avatar"
                />
                <span>{selectedChat.fullname}</span>
              </Link>
            </div>
            <div className="divider--modal"></div>

            <div className="chat-messages">
              <ul className="chat-message-list">
                {msgs.map((msg, idx) => {
                  const user = users.find((u) => u._id === msg.by._id);
                  const userImgUrl = user
                    ? getImageSrc(user.imgUrl)
                    : "/default-avatar.jpeg";

                  return (
                    <li key={idx} className="chat-message">
                      <img
                        src={userImgUrl}
                        alt={msg.from}
                        className="chat-small-avatar"
                      />
                      <div className="chat-text">{msg.message}</div>
                    </li>
                  );
                })}
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
