import { useState } from "react";
import { commonClimates } from "../assets/presetPlants";
import "../assets/createGarden.css";
import { PlantList } from "./plantList";
import { Link } from "react-router-dom";

export function CreateGarden() {
  const [form, setForm] = useState({
    spaceAvailable: "",
    experienceLevel: "",
    climate: "",
    plants: [],
    forAesthetics: false,
    forFoodProduction: false,
    timePerDayCommitment: 0,
    attractOrDeterWildlife: "deter",
  });

  const [showVegetables, setShowVegetables] = useState(false);
  const [showFruits, setShowFruits] = useState(false);
  const [showHerbs, setShowHerbs] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  return (
    <div id="createGardenPage">
      <form id="createGardenForm">
        {/* Available space for a garden */}
        <div className="labelAndBtn ">
          <label htmlFor="spaceAvailable" className="marginTwo">
            How much space do you have available for a garden? (sq ft)
          </label>
          <input
            type="number"
            name="spaceAvailable"
            step={1}
            min={0}
            defaultValue={0}
          ></input>
        </div>
        {/* Experience level */}
        <div className="labelAndBtn">
          <label htmlFor="experienceLevel" className="marginTwo">
            What is your gardening experience level?
          </label>
          <select name="experienceLevel">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        {/* Type of climate */}
        <div className="labelAndBtn">
          <label htmlFor="climates" className="marginTwo">
            Which type of climate best describes your area?
          </label>
          <select name="climates">
            {commonClimates.map((climate) => {
              return (
                <option key={climate.title} value={climate.title}>
                  {climate.title}
                </option>
              );
            })}
          </select>
        </div>
        {/* Vegetables you want to grow */}
        <PlantList
          category="vegetables"
          showCategory={showVegetables}
          setShowCategory={setShowVegetables}
          maxHeight="80rem"
        />
        {/* Fruits you want to grow */}
        <PlantList
          category="fruits"
          showCategory={showFruits}
          setShowCategory={setShowFruits}
          maxHeight="30rem"
        />
        {/* Herbs you want to grow */}
        <PlantList
          category="herbs"
          showCategory={showHerbs}
          setShowCategory={setShowHerbs}
          maxHeight="40rem"
        />
        {/* Flowers you want to grow */}
        <PlantList
          category="flowers"
          showCategory={showFlowers}
          setShowCategory={setShowFlowers}
          maxHeight="40rem"
        />
        {/* Other you want to grow */}
        <PlantList
          category="others"
          showCategory={showOthers}
          setShowCategory={setShowOthers}
          maxHeight="8rem"
        />
      </form>
      <Link to="/" className="mybtn">
        Exit
      </Link>
    </div>
  );
}
