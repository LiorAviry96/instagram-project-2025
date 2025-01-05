import { Link } from 'react-router-dom'

export function NavBar() {
    console.log('navbar test')
  return (
    <div className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <i className="fas fa-home"></i>
          <Link to="/">Home</Link>
        
        </li>
        <li className="navbar-item">
          <i className="fas fa-search"></i>
          <span>Search</span>
        </li>
        <li className="navbar-item">
          <i className="fas fa-envelope"></i>
          <span>Messages</span>
        </li>
        <li className="navbar-item">
          <i className="fas fa-user"></i>
          <Link to="/:userid">Profile</Link>
        </li>
        <li className="navbar-item">
          <i className="fas fa-pen"></i>
          <span>Create Post</span>
        </li>
      </ul>
    </div>
  );
}
