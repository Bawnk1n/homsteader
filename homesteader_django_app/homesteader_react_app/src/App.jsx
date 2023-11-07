import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./components/login";
import RegisterPage from "./components/register";
import { getCookie } from "./assets/getCookie";
import { NavBar } from "./components/navbar";
import { LoginButtons } from "./components/loginButtons";
import { CreateGarden } from "./components/createGarden";
import { GardenPlan } from "./components/gardenPlan";
import { MyGarden } from "./components/myGarden";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function authenticate() {
      const response = await fetch("http://localhost:8000/is_authenticated", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          setUsername(data.username);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        console.error("failed to authenticate");
      }
    }
    authenticate();
  }, []);

  const [plan, setPlan] = useState({});
  const [gardenClimate, setGardenClimate] = useState();

  async function logout() {
    console.log(getCookie("csrftoken"));

    if (isAuthenticated) {
      fetch("http://localhost:8000/logoutapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setIsAuthenticated(false);
            console.log("succesfully logged out");
          }
        });
    }
  }

  function toggleAuthenticated() {
    setIsAuthenticated(!isAuthenticated);
  }

  function updatePlan(generatedPlan, newGarden) {
    if (newGarden) {
      setPlan((old) => {
        return {
          ...old,
          garden: newGarden,
        };
      });
    } else {
      setPlan(generatedPlan);
    }
  }

  // console.log(plan);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MyGarden
              isAuthenticated={isAuthenticated}
              toggleAuthenticated={toggleAuthenticated}
              logout={logout}
              username={username}
            />
          }
        />
        <Route
          path="login"
          element={
            <LoginPage
              toggleAuthenticated={toggleAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="register"
          element={<RegisterPage toggleAuthenticated={toggleAuthenticated} />}
        />
        <Route
          path="create"
          element={
            <CreateGarden
              logout={logout}
              isAuthenticated={isAuthenticated}
              updatePlan={updatePlan}
              username={username}
            />
          }
        />
        <Route
          path="plan"
          element={
            <GardenPlan
              plan={plan}
              updatePlan={updatePlan}
              isAuthenticated={isAuthenticated}
              username={username}
              logout={logout}
            />
          }
        />
        <Route
          component={
            <div>
              <h2>404 page not found</h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
