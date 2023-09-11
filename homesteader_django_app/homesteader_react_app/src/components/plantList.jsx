import { PlantCheckbox } from "./plantCheckbox";
import { gardenPlants } from "../assets/presetPlants";
import CaretDownFill from "../assets/caret-down-fill.svg";
import CaretUpFill from "../assets/caret-up-fill.svg";
import { useState } from "react";

export function PlantList(props) {
  const [maxHeight, setMaxHeight] = useState(props.maxHeight);

  function makeTaller() {
    setMaxHeight((old) => old + 10);
  }

  function makeShorter() {
    setMaxHeight((old) => old - 10);
  }

  return (
    <div className="formElement">
      <div
        className={`labelAndBtn ${props.showCategory ? "fade-out" : ""}`}
        style={{
          borderBottom: props.showCategory ? "none" : "1px solid darkgrey",
        }}
      >
        <label htmlFor={props.category} className="labelHeader">
          Which {props.category} would you like to grow?
        </label>
        <button
          className="mybtn"
          onClick={(e) => {
            e.preventDefault();
            props.setShowCategory(!props.showCategory);
          }}
        >
          {props.showCategory ? (
            <span>
              {`Hide ${props.category}`} <img src={CaretUpFill} />
            </span>
          ) : (
            <span>
              {`Show ${props.category}`} <img src={CaretDownFill} />
            </span>
          )}
        </button>
      </div>
      <div
        id="plantList"
        style={{ maxHeight: props.showCategory ? `${maxHeight}rem` : "0" }}
      >
        {gardenPlants.map((plant) => {
          if (
            plant.category ===
            props.category.charAt(0).toUpperCase() + props.category.slice(1)
          ) {
            return (
              <PlantCheckbox
                updateForm={props.updateForm}
                plant={plant}
                key={plant.name}
                makeTaller={makeTaller}
                makeShorter={makeShorter}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
