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

//took csrfToken out of functions, might work might not

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedValue = localStorage.getItem("isAuthenticated");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const [plan, setPlan] = useState({});

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);
  //const csrfToken = getCookie("csrftoken"); might use this later, doesnt work currently with dev server

  useEffect(() => {
    fetch("http://127.0.0.1:8000/authenticateapi/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });
  }, []);

  function logout() {
    if (isAuthenticated) {
      fetch("http://127.0.0.1:8000/logoutapi/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
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
    if (isAuthenticated) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }

  function updatePlan(generatedPlan) {
    setPlan(generatedPlan);
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div id="page">
              {!isAuthenticated && <LoginButtons />}
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
          element={<LoginPage toggleAuthenticated={toggleAuthenticated} />}
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
              specificRevisionsMade={plan.specificRevisionsMade}
              garden={plan.garden}
              furtherAdvice={plan.furtherAdvice}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
