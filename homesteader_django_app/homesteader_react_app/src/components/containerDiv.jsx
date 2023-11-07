import PropTypes from "prop-types";
import { useState } from "react";
import { PlantInfoDiv } from "./plantInfoDiv";
import { reviseContainer, fillContainer } from "../assets/apiCalls";

Container.propTypes = {
  container: PropTypes.object,
  isHidden: PropTypes.bool,
  setLocalPlan: PropTypes.func,
  localPlan: PropTypes.object,
  isRevising: PropTypes.bool,
  setIsRevising: PropTypes.func,
};

export function Container({
  container,
  isHidden,
  setLocalPlan,
  localPlan,
  isRevising,
  setIsRevising,
}) {
  return (
    <div
      className="containerDiv"
      style={{ display: isHidden ? "none" : "block" }}
    >
      {container.needsRevision === true && (
        <div>
          <h5>{isRevising ? "Revising..." : "Container needs revision"}</h5>
          <button
            className={`mybtn ${isRevising ? "disabled" : null}`}
            onClick={async () => {
              console.log("started api call");
              if (!isRevising) {
                setIsRevising(true);

                // TODO I am here doing things
                //if the container has been added by the user via the Add button
                if (container.isNewContainer === true) {
                  const info = `I live in a ${localPlan.gardenClimate} climate`;

                  let plantArray = [];
                  container.plants.forEach((plant) =>
                    plantArray.push(plant.name)
                  );

                  let newContainer = await fillContainer(
                    container,
                    plantArray,
                    info,
                    container.id
                  );

                  newContainer = await JSON.parse(newContainer);
                  newContainer = newContainer.container;

                  // const newContainer = await response.json();
                  setLocalPlan((old) => {
                    return {
                      ...old,
                      containers: [
                        ...old.containers.filter(
                          (c) => c.id != newContainer.id
                        ),
                        newContainer,
                      ],
                      //this is breaking my brain but I THINK it is going to filter the old leftoverPlants array to not include
                      // any plants that are in this new container
                      leftoverPlants: [
                        ...old.leftoverPlants.filter(
                          (plantName) =>
                            !newContainer.plants
                              .map((plant) => plant.name)
                              .includes(plantName)
                        ),
                      ],
                    };
                  });
                  //if the container was set by the AI but the user has changed it somehow
                } else {
                  const newContainer = await reviseContainer(
                    JSON.stringify(container)
                  );
                  const parsed = JSON.parse(newContainer);
                  parsed.needsRevision = false;
                  setLocalPlan((old) => {
                    //check if there is a leftoverPlants key in the newly revised container
                    let newLeftoverPlants;
                    parsed.leftoverPlants
                      ? (newLeftoverPlants = parsed.leftoverPlants)
                      : (newLeftoverPlants = old.leftoverPlants);
                    //replace old container with the revised container
                    const newContainers = old.containers.map((container) => {
                      if (container.id === parsed.id) {
                        return parsed;
                      } else {
                        return container;
                      }
                    });
                    return {
                      ...old,
                      containers: newContainers,
                      leftoverPlants: [
                        ...old.leftoverPlants,
                        ...newLeftoverPlants,
                      ],
                    };
                  });
                }

                setIsRevising(false);
              }
            }}
          >
            Revise
          </button>
        </div>
      )}
      {/* <p>
        <b>{container.name}</b>
      </p> */}
      {container.plants &&
        container.plants.map((plant) => {
          return (
            <PlantInfoDiv
              key={`${plant.id} ${plant.name}`}
              plant={plant}
              setLocalPlan={setLocalPlan}
            />
          );
        })}
      <div className="furtherInfo">
        <p>
          <b>Instructions: </b> {container.instructions}
        </p>
        <p>
          <b>Tips: </b> {container.usefulAdvice}
        </p>
        <p>
          <b>Shopping list: </b> {container.shoppingList}
        </p>
      </div>
      {container.plants.length === 0 && (
        <button
          onClick={() => {
            setLocalPlan((old) => {
              return {
                ...old,
                containers: [
                  ...old.containers.filter((c) => c.id != container.id),
                ],
              };
            });
          }}
        >
          Delete Container
        </button>
      )}
    </div>
  );
}
