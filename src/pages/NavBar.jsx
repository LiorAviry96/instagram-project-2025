/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../store/actions/user.actions";
import { useState, useContext } from "react";
import { CreateStory } from "../cmps/CreateStory";
import { Modal } from "../cmps/Modal";
import { Search } from "./Search";
import { PostContext } from "../cmps/contexts/PostContext";
import { ModalSlide } from "../cmps/ModalSlide";
import { SvgIcon } from "../cmps/SvgIcon";
import { Notifications } from "./Notification";
import {
  socketService,
  SOCKET_EVENT_USER_FOLLOWED,
  SOCKET_EVENT_USER_LIKED,
  SOCKET_EVENT_USER_COMMENT,
} from "../services/socket.service";
import { userService } from "../services/users";

export function NavBar() {
  const navigate = useNavigate();
  const user = useSelector((storeState) => storeState.userModule.user);
  const loggedInUser = userService.getLoggedinUser();
  const { getImageSrc } = useContext(PostContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem("notifications")) || [];
  });
  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotificationsModal = () =>
    setIsNotificationsModalOpen(!isNotificationsModalOpen);

  useEffect(() => {
    if (!loggedInUser) return;
    // Listen for new notifications from the socket

    socketService.on(SOCKET_EVENT_USER_FOLLOWED, () => {
      notifHandler("follow");
    });
    socketService.on(SOCKET_EVENT_USER_LIKED, () => {
      notifHandler("like");
    });
    socketService.on(SOCKET_EVENT_USER_COMMENT, () => {
      notifHandler("like");
    });
    return () => {
      socketService.off(SOCKET_EVENT_USER_FOLLOWED, notifHandler);
      socketService.off(SOCKET_EVENT_USER_LIKED, notifHandler);
      socketService.off(SOCKET_EVENT_USER_COMMENT, notifHandler);
    };
  }, []);

  const notifHandler = (data, typeNotif) => {
    console.log("data", data);

    const newNotification = {
      type: typeNotif,
      fromUser: {
        userId: data._id,
        fullname: data.fullname,
        imgUrl: data.imgUrl,
      },
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev];
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
  };
  async function onLogout() {
    try {
      await logout();
      navigate("/");
      console.log("Bye now");
    } catch (err) {
      console.log("Cannot logout", err);
    }
  }

  if (!user) {
    return <Link to={"/login"} />;
  }

  return (
    <div
      className={`navbar ${
        isSearchModalOpen || isNotificationsModalOpen ? "small-nav" : ""
      }`}
    >
      <img
        className="logo"
        src="/assets/images/Instagram_logo.png"
        alt="Logo"
      />
      <ul className="navbar-menu">
        <li
          className={`navbar-item ${activeItem === "home" ? "active" : ""}`}
          onClick={() => setActiveItem("home")}
        >
          <Link to="/home" className="home-link">
            <SvgIcon
              iconName={`${activeItem === "home" ? "home-bold" : "home"}`}
            />
            <span className="navbar-text">Home</span>
          </Link>
        </li>
        <li
          className={`navbar-item ${activeItem === "search" ? "active" : ""}`}
          onClick={() => {
            setActiveItem("search");
            toggleSearchModal();
          }}
        >
          <SvgIcon
            iconName={`${activeItem === "search" ? "searchBold" : "search"}`}
            onClick={toggleSearchModal}
          />
          <span className="navbar-text" onClick={toggleSearchModal}>
            Search
          </span>
        </li>
        <li
          className={`navbar-item ${activeItem === "explore" ? "active" : ""}`}
          onClick={() => setActiveItem("explore")}
        >
          <Link to="/explore" className="home-link">
            <SvgIcon
              iconName={`${
                activeItem === "explore" ? "explore-bold" : "explore"
              }`}
            />

            <span className="navbar-text">Explore</span>
          </Link>
        </li>
        <li
          className={`navbar-item ${activeItem === "messages" ? "active" : ""}`}
          onClick={() => setActiveItem("messages")}
        >
          <Link to="/inbox" className="home-link">
            <SvgIcon iconName="messenger" />

            <span className="navbar-text">Messages</span>
          </Link>
        </li>
        <li
          className={`navbar-item ${
            activeItem === "notifications" ? "active" : ""
          }`}
          onClick={() => {
            setActiveItem("notifications");
            toggleNotificationsModal();
          }}
        >
          <SvgIcon
            iconName={`${
              activeItem === "notifications" ? "heartBlack" : "heart"
            }`}
            onClick={toggleNotificationsModal}
          />
          <span className="navbar-text">Notifications</span>
        </li>
        <li
          className={`navbar-item ${
            activeItem === "createPost" ? "active" : ""
          }`}
          onClick={() => {
            setActiveItem("createPost");
            setIsModalOpen(true);
          }}
        >
          <SvgIcon iconName="addFeed" />
          <span className="navbar-text">Create</span>
        </li>
        <li
          className={`navbar-item ${activeItem === "profile" ? "active" : ""}`}
          onClick={() => setActiveItem("profile")}
        >
          <Link to={`/user/${user._id}`} className="profile-link">
            <img
              className="profile-image icon"
              src={getImageSrc(user.imgUrl)}
              alt="Profile"
            />
            <span className="navbar-text">Profile</span>
          </Link>
        </li>

        <li className="hamburger-menu">
          <i className="fa-solid fa-bars" onClick={toggleMenu}>
            <span>More</span>
            {isMenuOpen && (
              <ul className="menu-options">
                <li className="menu-option" onClick={onLogout}>
                  Logout
                </li>
              </ul>
            )}
          </i>
        </li>
      </ul>

      {/* Create Story Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateStory onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <ModalSlide
          show={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        >
          <Search onClose={() => setIsSearchModalOpen(false)} />
        </ModalSlide>
      )}

      {/* Notifications Modal */}
      {isNotificationsModalOpen && (
        <ModalSlide
          show={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
        >
          <Notifications onClose={() => setIsNotificationsModalOpen(false)} />
        </ModalSlide>
      )}
    </div>
  );
}
