import PropTypes from "prop-types";
import { useState } from "react";
import { PlantInfoDiv } from "./plantInfoDiv";
import { reviseContainer } from "../assets/apiCalls";

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
                const newContainer = await reviseContainer(
                  JSON.stringify(container)
                );
                console.log(newContainer);
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
      {container.plants.map((plant) => {
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
    </div>
  );
}
