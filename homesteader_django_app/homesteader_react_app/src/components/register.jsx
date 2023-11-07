import "../assets/styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../assets/getCookie";
import PropTypes from "prop-types";

RegisterPage.propTypes = {
  toggleAuthenticated: PropTypes.func,
};

const RegisterPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("here");
    const cookie = getCookie("csrftoken");
    console.log(cookie);
    if (password !== passwordMatch) {
      alert("passwords do not match");
      return;
    } else {
      const cookie = getCookie("csrftoken");

      fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookie,
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          password_match: passwordMatch,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            console.log("Success: ", data);
            props.toggleAuthenticated();
            navigate("/");
          } else {
            console.log("Error: ", data.Message);
            alert(data.Message);
          }
        })
        .catch((error) => console.log("Error: ", error));
    }
  }

  return (
    <div className="container">
      <h1>Create Account</h1>
      <form>
        <div className="input-container">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="input-container">
          <label htmlFor="username">Email:</label>
          <input
            type="text"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Re-enter Password:</label>
          <input
            type="password"
            id="password-match"
            onChange={(e) => setPasswordMatch(e.target.value)}
            value={passwordMatch}
            required
          />
        </div>
        <button className="btn" onClick={(e) => handleSubmit(e)}>
          Create
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
