import "../assets/gardenPlan.css";
import { useEffect, useState } from "react";
import { Container } from "./containerDiv";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./navbar";
import Unknown from "../assets/images/question-circle.svg";
import { getCookie } from "../assets/getCookie";
import { structures } from "../assets/data";

GardenPlan.propTypes = {
  plan: PropTypes.object,
  updatePlan: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  username: PropTypes.string,
  logout: PropTypes.func,
};

export function GardenPlan({
  plan,

  isAuthenticated,
  username,
  logout,
}) {
  const navigate = useNavigate();
  const [localPlan, setLocalPlan] = useState(() => {
    if (!plan || Object.keys(plan).length < 1) {
      return JSON.parse(localStorage.getItem("gardenPlan"));
    } else {
      return plan;
    }
  });

  let { containers, leftoverContainers, leftoverPlants } = localPlan;

  useEffect(() => {
    localStorage.setItem("gardenPlan", JSON.stringify(localPlan));
  }, [localPlan]);

  const [visibleContainer, setVisibleContainer] = useState();
  const [isRevising, setIsRevising] = useState(false);

  //for Add A Container select / button in revisions
  const [newContainer, setNewContainer] = useState("Small Pot");

  return (
    <>
      <NavBar
        isAuthenticated={isAuthenticated}
        username={username}
        logout={logout}
      />
      <div className="content">
        <h1>Garden Plan</h1>

        <div id="revisions">
          <h3>Revisions</h3>
          {leftoverContainers.length > 0 ? (
            <p>
              {"Excess containers: " +
                leftoverContainers
                  .map((container) => container.name)
                  .join(", ")}
            </p>
          ) : null}

          {leftoverPlants.length > 0 ? <p>Excess plants: </p> : null}

          <div className="flex">
            {leftoverPlants.map((plant) => {
              return (
                <div key={plant} className="leftoverPlant">
                  <h6>{plant}</h6>
                  <button
                    className={`mybtn ${
                      visibleContainer === undefined ? "disabled" : null
                    }`}
                    onClick={() => {
                      //dont do anything if no container is selected
                      if (visibleContainer === undefined) {
                        return null;
                      }
                      setLocalPlan((old) => {
                        const newContainers = old.containers.map(
                          (container) => {
                            if (container.id === visibleContainer) {
                              return {
                                ...container,
                                plants: [
                                  ...container.plants,
                                  {
                                    name: plant,
                                    numberOfPlants: "?",
                                    plantingInstructions: "?",
                                    whenToPlant: "?",
                                    firstYield: "?",
                                    generalTipsAndTricks: "?",
                                    littleKnownFact: "?",
                                    advancedGardeningTip: "?",
                                  },
                                ],
                                //added needsRevision here to make sure we know which containers need to be sent back to the ai
                                needsRevision: true,
                              };
                            } else {
                              return container;
                            }
                          }
                        );
                        return {
                          ...old,
                          containers: newContainers,
                          leftoverPlants: old.leftoverPlants.filter(
                            (name) => name !== plant
                          ),
                        };
                      });
                    }}
                  >
                    Add to current container
                  </button>
                </div>
              );
            })}
          </div>
          {leftoverPlants.length > 0 && (
            <>
              <h4>Add a container</h4>

              <select onChange={(e) => setNewContainer(e.target.value)}>
                {structures.map((structure) => {
                  return (
                    <option value={structure.name} key={structure.name}>
                      {structure.name}
                    </option>
                  );
                })}
              </select>
              <button
                onClick={() => {
                  const structureInfo = structures.filter(
                    (structure) => structure.name === newContainer
                  );
                  const addMe = structureInfo[0];
                  const lastID = containers[containers.length - 1].id;
                  addMe.id = lastID + 1;
                  addMe.plants = [];
                  addMe.instructions = "";
                  addMe.usefulAdvice = "";
                  addMe.shoppingList = "";
                  addMe.isNewContainer = true;
                  setLocalPlan((old) => {
                    return {
                      ...old,
                      containers: [...old.containers, addMe],
                    };
                  });
                }}
                className="mybtn"
              >
                Add
              </button>
            </>
          )}
        </div>
        <div id="buttons">
          <h2>Containers</h2>
          {containers.map((container) => {
            let result = container.name;

            let check = result.match(/Raised Bed|Large Pot/i);

            let src;
            if (!check) {
              src = result;
            } else {
              src = check[0];
            }
            if (result === null) {
              src = Unknown;
            }

            return (
              <img
                src={
                  src === Unknown ? Unknown : `../src/assets/images/${src}.png`
                }
                key={container.id}
                onClick={() => {
                  if (!isRevising) {
                    setVisibleContainer(container.id);
                  }
                }}
                alt={container.name}
                className="btnImg"
              />
            );
          })}
        </div>
        <div>
          {containers.map((container) => {
            return (
              <div key={`${container.id} ${container.name}`}>
                {visibleContainer === container.id && (
                  <h3 className="containerHeader">
                    {container.size
                      ? container.size + " " + container.name
                      : container.name}
                  </h3>
                )}
                <Container
                  container={container}
                  id={`container ${container.name} ${container.id}`}
                  isHidden={visibleContainer === container.id ? false : true}
                  setLocalPlan={setLocalPlan}
                  localPlan={localPlan}
                  setIsRevising={setIsRevising}
                  isRevising={isRevising}
                />
              </div>
            );
          })}
          <button
            className="mybtn border-radius"
            onClick={() => {
              const gardenName = prompt(
                "Please enter the name of your garden:"
              );
              if (gardenName != null) {
                const gardenData = {
                  name: gardenName,
                  containers: localPlan.containers,
                };

                fetch("http://localhost:8000/save_garden", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                  },
                  credentials: "include",
                  body: JSON.stringify(gardenData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status === "success") {
                      console.log("Garden saved successfully");
                      navigate("/");
                    } else {
                      console.log("Error saving garden: ", data.message);
                      if (data.message === "User already has a garden") {
                        alert(
                          "Delete your current garden before creating a new one (at the bottom of the Garden page)"
                        );
                      }
                    }
                  })
                  .catch((error) =>
                    console.error("There was an error: ", error)
                  );
              }
            }}
          >
            Save Garden
          </button>
        </div>
      </div>
    </>
  );
}

// ------------------DEV BUTTONS----------------

//change local plan
{
  /* <button
onClick={() => {
  setLocalPlan((old) => {
    return {
      ...old,
      containers: [
        ...old.containers.filter((c) => c.plants != undefined),
      ],
    };
  });
}}
>
Reset
</button> */
}
