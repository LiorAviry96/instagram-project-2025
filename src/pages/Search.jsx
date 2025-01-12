import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/user.service";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const loggedInUser = userService.getLoggedinUser();
    if (loggedInUser?.following) {
      setFollowing(loggedInUser.following);
    }
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(following); 
    } else {
      const results = following.filter((user) =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm, following]);
  return (
    <div className="search-component">
    
        <div className="search-dropdown">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <ul className="search-results">
            {searchResults.map((user) => (
              <li key={user._id} className="search-item">
                <Link to={`/user/${user._id}`}>
                  <img src={`/src/assets/images/${user.imgUrl}.jpeg`} alt={user.fullname} className="user-avatar" />
                  <span>{user.fullname}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}
