import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/login";
import RegisterPage from "./components/register";
import { getCookie } from "./assets/getCookie";
import { NavBar } from "./components/navbar";
import { LoginButtons } from "./components/loginButtons";
import { CreateGarden } from "./components/createGarden";
import { GardenPlan } from "./components/gardenPlan";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    let checkAuth = localStorage.getItem("isAuthenticated");
    if (checkAuth === "true") {
      return true;
    } else {
      return false;
    }
  });

  const [plan, setPlan] = useState({});

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

  console.log(plan);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div id="page">
              {!isAuthenticated && (
                <div>
                  <NavBar logout={logout} isAuthenticated={isAuthenticated} />
                  <LoginButtons />{" "}
                </div>
              )}
              {isAuthenticated && (
                <div>
                  <NavBar logout={logout} isAuthenticated={isAuthenticated} />
                  <div id="content">
                    <Link to="/create" className="mybtn">
                      Create a Garden
                    </Link>
                  </div>
                </div>
              )}
            </div>
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
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
