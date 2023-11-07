import { useState } from "react";
import "../assets/styles.css";
import { getCookie } from "../assets/getCookie";
import { useNavigate } from "react-router-dom";

const LoginPage = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      alert("please enter a valid username and password");
      return;
    } else {
      const tokenResponse = await fetch("http://localhost:8000/gettoken");

      const tokenObject = await tokenResponse.json();
      const token = tokenObject.csrfToken;

      document.cookie = `csrftoken=${token}`;

      fetch("http://localhost:8000/loginapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (data.success) {
            console.log("Success:", data);
            props.setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            navigate("/");
          }
        })
        .catch((error) => console.log("Error:", error));
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <form>
        <div className="input-container">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button onClick={(e) => handleSubmit(e)} className="btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
