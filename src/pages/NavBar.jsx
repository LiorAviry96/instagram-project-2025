import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { useNavigate } from "react-router";
import { logout } from "../store/actions/user.actions";
import { useState, useContext } from "react";
import { CreateStory } from "../cmps/CreateStory";
import { Modal } from "../cmps/Modal";
import { Search } from "./Search";
import { CreatePostSvg } from "../cmps/svg/CreatePostSvg";
import { MessagesSVG } from "../cmps/svg/MessagesSvg";
import { PostContext } from "../cmps/contexts/PostContext";
import { ModalSearch } from "../cmps/ModalSearch";

export function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home"); // State to track active navbar item
  const user = useSelector((storeState) => storeState.userModule.user);
  const { getImageSrc } = useContext(PostContext);
  const navigate = useNavigate();
  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  async function onLogout() {
    try {
      await logout();
      navigate("/");
      showSuccessMsg("Bye now");
    } catch (err) {
      showErrorMsg("Cannot logout", err);
    }
  }

  if (!user) {
    return <Link to={"/"} />;
  }

  return (
    <div className={`navbar ${isSearchModalOpen ? "small-nav" : ""}`}>
      <img
        className="logo"
        src="/src/assets/images/Instagram_logo.png"
        alt="Logo"
      />
      <ul className="navbar-menu">
        <li
          className={`navbar-item ${activeItem === "home" ? "active" : ""}`}
          onClick={() => setActiveItem("home")}
        >
          <Link to="/home" className="home-link">
            <i className="fas fa-home icon"></i>
            <span>Home</span>
          </Link>
        </li>
        <li
          className={`navbar-item ${activeItem === "search" ? "active" : ""}`}
          onClick={() => setActiveItem("search")}
        >
          <i className="fas fa-search icon" onClick={toggleSearchModal}></i>
          <span className="search-btn" onClick={toggleSearchModal}>
            Search
          </span>
        </li>
        <li
          className={`navbar-item ${activeItem === "messages" ? "active" : ""}`}
          onClick={() => setActiveItem("messages")}
        >
          <MessagesSVG className="messages-icon icon" />
          <Link to="/home">Messages</Link>
        </li>
        <li
          className={`navbar-item ${
            activeItem === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveItem("notifications")}
        >
          <i className="fa-regular fa-heart icon"></i>
          <Link className="notification-btn" to="/home">
            Notifications
          </Link>
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
          {" "}
          <CreatePostSvg className="create-post-icon icon" />
          <span>Create Post</span>
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
            <span>Profile</span>
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
        <ModalSearch
          show={isSearchModalOpen}
          onClose={() => setIsModalOpen(false)}
          className=""
        >
          <Search onClose={() => setIsSearchModalOpen(false)} />
        </ModalSearch>
      )}
    </div>
  );
}
