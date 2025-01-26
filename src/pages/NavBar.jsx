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

export function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    return (
      <Link to={'/'}/>
    );
  }

  return (
    <div className="navbar">
      <img className="logo" src="/src/assets/images/Instagram_logo.png" alt="Logo" />
      <ul className="navbar-menu">
      <li className="navbar-item">
        <Link to="/home" className="home-link">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
      </li>
      <li className="navbar-item">
        <i className="fas fa-search"></i>
        <span className="search-btn" onClick={toggleSearchModal}>
          Search
        </span>
      </li>
      <li className="navbar-item">
        <MessagesSVG className="messages-icon" />
        <Link to="/home">Messages</Link>
      </li>
        <li className="navbar-item">
          <i className="fa-regular fa-heart"></i>
          <span className="search-btn" >
            Notifications
          </span>
        </li>
        <li className="navbar-item" onClick={() => setIsModalOpen(true)}>
          <CreatePostSvg className="create-post-icon" />
          <span>Create Post</span>
      </li>
        <li className="navbar-item">
        <Link to={`/user/${user._id}`} className="profile-link">
          <img
            className="profile-image"
            src={getImageSrc(user.imgUrl)}
            alt="Profile"
          />
          <span>Profile</span>
       </Link>
        </li>
        
        <li className="hamburger-menu">
        <i className="fa-solid fa-bars" onClick={toggleMenu}> </i>
        <span>More</span>
        {isMenuOpen && (
          <ul className="menu-options">
            <li className="menu-option" onClick={onLogout}>
              Logout
            </li>
          </ul>
        )}
      </li>
      </ul>

      {/* Create Story Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateStory onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="search-modal-container">
          <Search onClose={() => setIsSearchModalOpen(false)} />
        </div>
      )}



  

    </div>
  );
}
