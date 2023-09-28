import PropTypes from "prop-types";
import { useState } from "react";
import "../assets/plantInfoDiv.css";

PlantInfoDiv.propTypes = {
  plant: PropTypes.object,
};

export function PlantInfoDiv({ plant }) {
  const [moreInfo, setMoreInfo] = useState(false);
  return (
    <div key={`${plant.id} ${plant.name}`} className="plantInfo">
      <p id="plant-title">{plant.name}</p>
      <p>
        <b>Number of plants: </b>
      </p>
      <p>{plant.numberOfPlantsPerContainer}</p>
      <div className="moreInfo" style={{ maxHeight: moreInfo ? "27rem" : "0" }}>
        <p>
          <b>Space per plant: </b>
        </p>
        <p>{plant.plantSpacing}</p>

        <p>
          <b>Watering needs: </b>
        </p>
        <p>{plant.detailedWateringInstructions}</p>

        <p>
          <b>When to plant: </b>
        </p>
        <p>{plant.whenToPlant}</p>

        <p>
          <b>First Yield: </b>
        </p>
        <p>{plant.firstYield}</p>
        <p>
          <b>Planting instructions: </b>
        </p>
        <p>{plant.plantingInstructions}</p>
        <p>
          <b>Tips and tricks: </b>
        </p>
        <p>{plant.generalTipsAndTricks}</p>
      </div>
      <button
        className="mybtn centered border-radius"
        onClick={() => setMoreInfo(!moreInfo)}
      >
        {moreInfo ? "Less Info" : "More Info"}
      </button>
    </div>
  );
}
