import PropTypes from "prop-types";
import { useState } from "react";
import { PlantInfoDiv } from "./plantInfoDiv";

Container.propTypes = {
  container: PropTypes.object,
  isHidden: PropTypes.bool,
};

export function Container({ container, isHidden }) {
  return (
    <div
      className="containerDiv"
      style={{ display: isHidden ? "none" : "block" }}
    >
      <p>
        <b>{container.containerInfo}</b>
      </p>

      {container.plants.map((plant) => {
        return (
          <PlantInfoDiv key={`${plant.id} ${plant.name} yoot`} plant={plant} />
        );
      })}
      <p>
        <b>Instructions: </b> {container.detailedInstructions}
      </p>
      <p>
        <b>Tips: </b> {container.generalTipsAndTricks}
      </p>
      <p>
        <b>Shopping list: </b> {container.shoppingList}
      </p>
    </div>
  );
}
