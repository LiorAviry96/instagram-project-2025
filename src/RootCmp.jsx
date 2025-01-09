
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import { FeedIndex } from "./pages/FeedIndex"
import { NavBar } from "./pages/NavBar"
import { Profile } from "./pages/Profile"
import { Search } from "./pages/Search"
import { CreatePost } from "./cmps/CreatePost"


import { Routes, Route } from 'react-router'




export function RootCmp() {

    return (
        <div className="main-container">
         
         <NavBar />

            <main className="feed">
                <Routes> 
                <Route path="/" element={<FeedIndex />} />
                    <Route path="/user/:userId" element={<Profile />} />
                    <Route path="/user/:userId/search" element={<Search />} />
                    <Route path="/user/:userId/upload" element={<CreatePost />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                </Routes>
            </main>
       
        </div>
    )
}