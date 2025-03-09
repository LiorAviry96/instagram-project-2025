/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/users";
import { useSelector } from "react-redux";

export function Search({ onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const users = await userService.getUsers();
    setList(users);
  }

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(list);
    } else {
      const results = list.filter((user) =>
        user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm, list]);

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <div className="search-modal-container">
      <div className="search-header">
        <h2 className="search-btn">Search</h2>
      </div>
      <div
        className={`search-bar ${isFocused ? "active" : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          className="input-search"
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        {searchTerm && (
          <button className="clear-button" onClick={clearSearchTerm}>
            &times; {/* This is the "X" symbol */}
          </button>
        )}
      </div>
      <div className="divider-search"></div>

      {isFocused && searchResults.length > 0 && (
        <div className="search-dropdown">
          <ul className="search-results">
            {searchResults.map((user) => (
              <li key={user._id} className="search-item">
                <Link to={`/user/${user._id}`}>
                  <img
                    src={`/src/assets/images/${user.imgUrl}.jpeg`}
                    alt={user.fullname}
                    className="user-avatar"
                  />
                  <span className="search-fullname">{user.fullname}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
