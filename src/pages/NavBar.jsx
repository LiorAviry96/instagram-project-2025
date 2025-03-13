import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
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

export function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const user = useSelector((storeState) => storeState.userModule.user);
  const { getImageSrc } = useContext(PostContext);
  const navigate = useNavigate();
  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotificationsModal = () =>
    setIsNotificationsModalOpen(!isNotificationsModalOpen);

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
            <span>Home</span>
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
          <span onClick={toggleSearchModal}>Search</span>
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

            <span>Explore</span>
          </Link>
        </li>
        <li
          className={`navbar-item ${activeItem === "messages" ? "active" : ""}`}
          onClick={() => setActiveItem("messages")}
        >
          <Link to="/inbox" className="home-link">
            <SvgIcon iconName="messenger" />

            <span>Messages</span>
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
          <span>Notifications</span>
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
          <span>Create</span>
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
