import { NavBar } from "./navbar";
import { LoginButtons } from "./loginButtons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCookie } from "../assets/getCookie";
import "../assets/myGarden.css";

MyGarden.propTypes = {
  isAuthenticated: PropTypes.bool,
  logout: PropTypes.func,
};

export function MyGarden({ isAuthenticated, logout, toggleAuthenticated }) {
  const [userGarden, setUserGarden] = useState();

  useEffect(() => {
    const fetchGarden = async () => {
      const result = await fetch("http://localhost:8000/retrieve_garden", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      });
      if (result.ok) {
        const data = await result.json();
        console.log(data.message);
        setUserGarden(data.garden);
      } else {
        console.log("error");
      }
    };
    fetchGarden();
  }, []);
  return (
    <div>
      {!isAuthenticated && (
        <div id="not_authenticated">
          <NavBar logout={logout} isAuthenticated={isAuthenticated} />
          <LoginButtons />{" "}
          <button onClick={toggleAuthenticated}>Authenticate</button>
        </div>
      )}
      {isAuthenticated && (
        <div>
          <NavBar logout={logout} isAuthenticated={isAuthenticated} />
          <div id="content">
            {!userGarden && (
              <Link to="/create" className="mybtn">
                Create a Garden
              </Link>
            )}
            {userGarden && (
              <div id="containers">
                {userGarden.containers.map((container) => (
                  <div
                    key={container.name + " " + container.id}
                    className="gardenContainer"
                  >
                    {console.log(container.name + " " + container.id)}
                    <h4>{container.name}</h4>
                    <h5>Size: {container.size}</h5>
                    <div className="containerPlants">
                      {container.plants.map((plant) => {
                        return (
                          <div
                            key={plant.name + " " + plant.id}
                            className="plant"
                          >
                            <p>{plant.name}</p>
                          </div>
                        );
                      })}
                    </div>
                    <h5>Instructions: </h5>
                    <p>{container.instructions}</p>
                    <h5>Advice: </h5>
                    <p>{container.usefulAdvice}</p>
                    <h5>Shopping list: </h5>
                    <p>{container.shoppingList}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
