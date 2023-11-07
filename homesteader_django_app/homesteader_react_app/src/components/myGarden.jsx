import { NavBar } from "./navbar";
import { LoginButtons } from "./loginButtons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCookie } from "../assets/getCookie";
import "../assets/myGarden.css";
import { PlantModal } from "./plantModal";

MyGarden.propTypes = {
  isAuthenticated: PropTypes.bool,
  logout: PropTypes.func,
  username: PropTypes.string,
};

export function MyGarden({ isAuthenticated, logout, username }) {
  const [userGarden, setUserGarden] = useState();

  const [showModal, setShowModal] = useState(false);
  const [visibleModal, setVisibleModal] = useState();

  function closeModal() {
    setShowModal(false);
    console.log(showModal);
  }

  function openModal(id) {
    setVisibleModal(id);
    setShowModal(true);
  }

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

  async function deleteGarden() {
    let user_confirm = confirm(
      "Deleting your garden is irreversible, continue?"
    );
    if (!user_confirm) {
      return;
    }
    const response = await fetch("http://localhost:8000/delete_garden", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "success") {
      console.log("User garden deleted succesfully");
      window.location.reload();
    } else {
      console.error("Error deleting garden: ", data.message);
    }
  }
  return (
    <div id="page">
      {!isAuthenticated && (
        <div id="not_authenticated">
          <NavBar logout={logout} isAuthenticated={isAuthenticated} />
          <LoginButtons />{" "}
          {/* <button onClick={toggleAuthenticated}>Authenticate</button> */}
        </div>
      )}
      {isAuthenticated && (
        <div id="main-page">
          <NavBar
            logout={logout}
            isAuthenticated={isAuthenticated}
            username={username}
          />
          <div id="content">
            {!userGarden && (
              <Link to="/create" className="mybtn">
                Create a Garden
              </Link>
            )}
            {userGarden && (
              <div id="containers">
                {console.log(userGarden)}
                <h2>Garden: {userGarden.name}</h2>
                {userGarden.containers.map((container) => (
                  <div
                    key={container.name + " " + container.id}
                    className="gardenContainer"
                  >
                    {/* {console.log(container.name + " " + container.id)} */}
                    <h4>{container.name}</h4>
                    <h5>Size: {container.size}</h5>
                    <div className="containerPlants">
                      {container.plants.map((plant) => {
                        return (
                          <div
                            key={plant.name + " " + plant.id}
                            className="plant"
                            onClick={() => {
                              if (!showModal) {
                                openModal(plant.id);
                              }
                            }}
                          >
                            <img
                              src="../src/assets/images/Small Pot.png"
                              width="100px"
                            />
                            <p>{plant.name}</p>

                            {showModal && plant.id === visibleModal && (
                              <PlantModal
                                plant={plant}
                                containerId={container.id}
                                closeModal={closeModal}
                              />
                            )}
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
      {userGarden && (
        <button onClick={deleteGarden} className="mybtn">
          Delete Garden
        </button>
      )}
    </div>
  );
}
