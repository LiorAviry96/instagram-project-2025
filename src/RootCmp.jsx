
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import { FeedIndex } from "./pages/FeedIndex"

import { Routes, Route } from 'react-router'
import { NavBar } from "./pages/NavBar"
import { Profile } from "./pages/Profile"



export function RootCmp() {

    return (
        <div className="main-container">
         

            <main>
                <Routes>
                   
                    <Route path="feed" element={<FeedIndex />} />
                    <Route path="/" element={<NavBar />} />
                    <Route path="/" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />

                </Routes>
            </main>
       
        </div>
    )
}