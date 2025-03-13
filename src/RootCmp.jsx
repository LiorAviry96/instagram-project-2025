import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { FeedIndex } from "./pages/FeedIndex";
import { NavBar } from "./pages/NavBar";
import { Profile } from "./pages/Profile";
import { Explore } from "./pages/Explore";
import { Search } from "./pages/Search";
import { CreateStory } from "./cmps/CreateStory";
import { PostProvider } from "./cmps/contexts/PostContext";
import { Routes, Route } from "react-router";
import { Chat } from "./pages/Chat";
import { Notifications } from "./pages/Notification";
//import { socketService } from "./services/socket.service";
//import { SOCKET_EVENT_USER_FOLLOWED } from "./services/socket.service";

export function RootCmp() {
  return (
    <div className="main-container">
      <PostProvider>
        <NavBar />

        <main className="second-container">
          <Routes>
            <Route path="/home" element={<FeedIndex />} />
            <Route path="/user/:userId" element={<Profile />} />
            <Route path="/user/:userId/search" element={<Search />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/inbox" element={<Chat />} />
            <Route path="/user/:userId/upload" element={<CreateStory />} />
            <Route
              path="/user/:userId/notifications"
              element={<Notifications />}
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </PostProvider>
    </div>
  );
}
