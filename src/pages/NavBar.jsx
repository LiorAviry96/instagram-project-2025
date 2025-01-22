import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { useNavigate } from "react-router";
import { logout } from "../store/actions/user.actions";
import { useState } from "react";
import { CreateStory } from "../cmps/CreateStory";
import { Modal } from "../cmps/Modal";
import { Search } from "./Search";
import { Login } from "./Login";

export function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);

  const user = useSelector((storeState) => storeState.userModule.user);

  async function onLogout() {
    try {
      await logout();
      navigate("/login");
      showSuccessMsg("Bye now");
    } catch (err) {
      showErrorMsg("Cannot logout", err);
    }
  }

  if (!user) {
    return (
      <Login/>
    );
  }

  return (
    <div className="navbar">
      <img className="logo" src="/src/assets/images/Instagram_logo.png" alt="Logo" />
      <ul className="navbar-menu">
        <li className="navbar-item">
          <i className="fas fa-home"></i>
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <i className="fas fa-search"></i>
          <span className="search-btn" onClick={toggleSearchModal}>
            Search
          </span>
        </li>
        <li className="navbar-item">
          <i className="fa-regular fa-comment-dots"></i>
          <Link to="/">Messages</Link>
        </li>
        <li className="navbar-item">
          <i className="fa-regular fa-heart"></i>
          <span className="search-btn" >
            Notifications
          </span>
        </li>
        <li className="navbar-item">
          <i className="fas fa-pen"></i>
          <span onClick={() => setIsModalOpen(true)}>Create Post</span>
        </li>
        <li className="navbar-item">
          <img
            className="profile-image"
            src={`/src/assets/images/${user.imgUrl || "default-profile"}.jpeg`}
            alt="Profile"
          />
          <Link to={`/user/${user._id}`}>Profile</Link>
        </li>
        <li className="navbar-item">
          <span className="logout" onClick={onLogout}>
            Logout
          </span>
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
