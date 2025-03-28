import { signup } from "../store/actions/user.actions";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ImgUploaderUser } from "../cmps/ImgUploaderUser";

export function SignUp() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    fullname: "",
    imgUrl: "",
  });
  const navigate = useNavigate();

  async function handleSignup(ev) {
    ev.preventDefault();
    if (
      !credentials.username ||
      !credentials.password ||
      !credentials.fullname
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      await signup(credentials);
      navigate("/home");
    } catch (err) {
      console.error("Signup failed", err);
      alert("Signup failed. Please try again.");
    }
  }

  function handleChange(ev) {
    const { name, value } = ev.target;
    setCredentials({ ...credentials, [name]: value });
  }
  function onUploaded(imgUrl) {
    setCredentials((credentials) => ({ ...credentials, imgUrl }));
  }
  return (
    <div className="signup">
      <i
        data-visualcompletion="css-img"
        aria-label="Instagram"
        className="logo-login"
        role="img"
      ></i>
      <h2>Sign up to see photos and videos from your friends.</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={credentials.fullname}
          onChange={handleChange}
        />
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
        <ImgUploaderUser onUploaded={onUploaded} />

        <button type="submit">Sign Up</button>
      </form>
      <p className="signup-switch">
        Already have an account?{" "}
        <button onClick={() => navigate("/")}>Log In</button>
      </p>
    </div>
  );
}
