import PropTypes from "prop-types";
import { useState } from "react";
import "../assets/plantInfoDiv.css";

PlantInfoDiv.propTypes = {
  plant: PropTypes.object,
  setLocalPlan: PropTypes.func,
};

export function PlantInfoDiv({ plant, setLocalPlan }) {
  const [moreInfo, setMoreInfo] = useState(false);
  return (
    <div key={`${plant.id} ${plant.name}`} className="plantInfo">
      <p id="plant-title">{plant.name}</p>
      <p>
        <b>Number of plants: {plant.numberOfPlants}</b>
      </p>
      {/* <p>{plant.numberOfPlants}</p> */}
      <div className="moreInfo" style={{ maxHeight: moreInfo ? "40rem" : "0" }}>
        <p>
          <b>Difficulty: </b>
        </p>
        <p>{plant.difficultyLevel}</p>
        <p>
          <b>Flavor profile: </b>
        </p>
        <p>{plant.flavorProfile}</p>
        <p>
          <b>Planting instructions: </b>
        </p>
        <p>{plant.plantingInstructions}</p>
        <p>
          <b>When to plant: </b>
        </p>
        <p>{plant.whenToPlant}</p>

        <p>
          <b>First Yield: </b>
        </p>
        <p>{plant.firstYield}</p>
        <p>
          <b>Tips and tricks: </b>
        </p>
        <p>{plant.generalTipsAndTricks}</p>
        <p>
          <b>Little known fact!: </b>
        </p>
        <p>{plant.littleKnownFact}</p>
        <p>
          <b>Advanced tip: </b>
        </p>
        <p>{plant.advancedGardeningTip}</p>
      </div>
      <button
        className="mybtn border-radius"
        onClick={() => setMoreInfo(!moreInfo)}
      >
        {moreInfo ? "Less Info" : "More Info"}
      </button>
      <button
        className="mybtn border-radius"
        onClick={() => {
          setLocalPlan((old) => {
            if (old && Array.isArray(old.containers)) {
              const newContainers = old.containers.map((container) => {
                if (Array.isArray(container.plants)) {
                  return {
                    ...container,
                    plants: container.plants.filter(
                      (plantObject) => plantObject.name !== plant.name
                    ),
                    needsRevision: true,
                  };
                } else {
                  return container;
                }
              });
              return {
                ...old,
                containers: newContainers,
                leftoverPlants: [...old.leftoverPlants, plant.name],
              };
            } else {
              console.error("the expected objects are not defined");
              return old;
            }
          });
        }}
      >
        Remove Plant
      </button>
    </div>
  );
}
