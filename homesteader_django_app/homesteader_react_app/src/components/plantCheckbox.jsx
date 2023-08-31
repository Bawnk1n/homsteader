import { useState } from "react";
import "../assets/plantCheckbox.css";
import CaretDownFill from "../assets/caret-down-fill.svg";
import CaretUpFill from "../assets/caret-up-fill.svg";

export function PlantCheckbox(props) {
  const [showDescription, setShowDescription] = useState(false);

  function toggleShowDescription(e) {
    e.preventDefault();
    showDescription ? setShowDescription(false) : setShowDescription(true);
  }
  return (
    <div key={props.plant.name} className="checkboxDiv">
      <label className="checkboxLabel">
        <div id="btnAndName">
          <button onClick={toggleShowDescription} className="moreInfoBtn">
            {showDescription ? (
              <img src={CaretUpFill} alt="more info btn" />
            ) : (
              <img src={CaretDownFill} alt="more info btn" />
            )}
          </button>
          {props.plant.name}
        </div>

        <input type="checkbox" name="vegetables" value={props.plant.name} />
      </label>

      <div
        id="plant-description"
        style={{
          maxHeight: showDescription ? "10rem" : "0",
          marginBottom: showDescription ? "1rem" : "0",
        }}
      >
        <p>{props.plant.description}</p>
        <p>
          <b>Growing season: </b>
          {props.plant.growingSeason}
        </p>
      </div>
    </div>
  );
}
