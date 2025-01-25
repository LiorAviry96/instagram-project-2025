/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { login } from "../store/actions/user.actions"
import { useState , useEffect } from "react"
import { useNavigate } from 'react-router'
import { userService } from '../services/user.service'

export function Login() {

    const [credentials, setCredentials] = useState({ username: '', password: ''})
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }
    async function handleLogin(ev = null){
        if (ev) ev.preventDefault()

            if (!credentials.username) return
            await login(credentials)
            navigate('/home')
    }

   

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    return (
        <div className="login">
        <i data-visualcompletion="css-img" aria-label="Instagram" className="logo-login"  role="img"></i>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
            </form>
            <p className="signup-switch">
                Don't have an account? <button onClick={() => navigate("/signup")}>Sign Up</button>
            </p>
        </div>
    );
}