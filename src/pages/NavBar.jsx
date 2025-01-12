import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service';
import { showSuccessMsg } from '../services/event-bus.service';
import { useNavigate } from 'react-router'
import { logout } from '../store/actions/user.actions';
import { useState } from 'react';
import { CreatePost } from '../cmps/CreatePost';
import { Modal } from '../cmps/Modal';
export function NavBar() {

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate()

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    const user = useSelector((storeState) => storeState.userModule.user);
    console.log(user)

    async function onLogout() {
      try {
        await logout()
        navigate('/login')
        showSuccessMsg(`Bye now`)
      } catch (err) {
        showErrorMsg('Cannot logout', err)
      }
    }
  return (
    <div className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <i className="fas fa-home"></i>
          <Link to="/">Home</Link>
        
        </li>
        {user ? (
          <li className="navbar-item">
              <i className="fas fa-search"></i>
              <Link to={`/user/${user._id}/search`}>Search</Link>          
          </li>
        ) : (
          <li className="navbar-item">
            <i className="fas fa-search"></i>
            <Link to="/login">Search</Link>
          </li>
        )}



        <li className="navbar-item">
          <i className="fas fa-envelope"></i>
          <Link to="/">Messages</Link>

        </li>
        {user ? <li className="navbar-item">
          <i className="fas fa-user"></i>
          <Link to={`/user/${user._id}`}>Profile</Link>
        </li> :  <li className="navbar-item">
          <i className="fas fa-user"></i>
          <Link to="login">Profile</Link>
        </li>}
       
        {user ? (
          <li className="navbar-item">
            <i className="fas fa-pen"></i>
            <span onClick={openModal}>Create Post</span> {/* Trigger modal on click */}
          </li>
        ) : (
          <li className="navbar-item">
            <i className="fas fa-pen"></i>
            <Link to="/login">Create Post</Link>
          </li>
        )}

        {user ? 
        <li className="navbar-item">
        <span onClick={onLogout}>Logout</span> 
        </li> : 
        <li className="navbar-item">
        <Link to="/login">login</Link> 
        </li>} 
      </ul>


        {/* Modal */}
        <Modal show={isModalOpen} onClose={closeModal}>
        <CreatePost />
      </Modal>
    </div>
  );
}
