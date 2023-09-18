import PropTypes from "prop-types";
import { useState } from "react";

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
        <b>Container: </b>
        {container.containerInfo}
      </p>
      <p>
        <b>Plants: </b>
      </p>
      {container.plants.map((plant) => {
        return (
          <div key={`${plant.id} ${plant.name} yoot`} className="plantInfo">
            <p>{plant.name}</p>
            <p>Number of plants: {plant.numberOfPlantsPerContainer}</p>
            <p>Space per plant: {plant.plantSpacing}</p>
            <p>Watering needs: {plant.detailedWateringInstructions}</p>
            <p>When to plant: {plant.whenToPlant}</p>
            <p>First Yield: {plant.firstYield}</p>
          </div>
        );
      })}
      <p>
        <b>Instructions: </b> {container.detailedInstructions}
      </p>
      <p>
        <b>Shopping list: </b> {container.shoppingList}
      </p>
    </div>
  );
}
