
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import { FeedIndex } from "./pages/FeedIndex"
import { NavBar } from "./pages/NavBar"
import { Profile } from "./pages/Profile"
import { LoginSignup } from "./pages/LoginSigntp"
//import { Navigate } from "react-router-dom";
//import { useSelector } from "react-redux";

import { Routes, Route } from 'react-router'




export function RootCmp() {

    console.log('posts')
    return (
        <div className="main-container">
         
         <NavBar />

            <main className="feed">
                <Routes> 
                <Route path="/" element={<FeedIndex />} />
                    <Route path="/user/:userId" element={<Profile />} />
                    <Route path="login" element={<LoginSignup />}>
                        <Route index element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                    </Route>
                </Routes>
            </main>
       
        </div>
    )
}