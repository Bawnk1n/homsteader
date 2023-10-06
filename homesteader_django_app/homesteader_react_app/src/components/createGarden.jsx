import { useState, useEffect } from "react";
import { NavBar } from "./navbar";
import { commonClimates } from "../assets/presetPlants";
import "../assets/createGarden.css";
import { PlantList } from "./plantList";
import { Link } from "react-router-dom";
import { createGardenPlan, fillContainer } from "../assets/apiCalls";
import { useNavigate } from "react-router-dom";
import { Square } from "./square";
import PropTypes from "prop-types";
import { GardenPlan } from "./gardenPlan";
import { LoadingSquare } from "./loadingSquare";

CreateGarden.propTypes = {
  logout: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  updatePlan: PropTypes.func,
};

export function CreateGarden(props) {
  const [gardenWidth, setGardenWidth] = useState(10);
  const [gardenHeight, setGardenHeight] = useState(5);
  const [myStructures, setMyStructures] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    spaceAvailable: `${gardenWidth}ft x ${gardenHeight}ft`,
    preferredGrowingContainers: [
      { name: "Raised or Ground Bed", width: 4, height: 4 },
      { name: "Raised or Ground Bed", width: 4, height: 4 },
      { name: "Large Pot", width: 2, height: 2, diameter: "12 inches" },
      { name: "Large Pot", width: 2, height: 2, diameter: "12 inches" },
    ],
    experienceLevel: "beginner",
    climate: "Highlands / Mountainous",
    plants: [
      "Tomatoes",
      "Cucumbers",
      "Lettuce",
      "Bell Peppers",
      "Carrots",
      "Green Beans",
      "Zucchini",
      "Spinach",
      "Garlic",
      "Onions",
      "Kale",
      "Cherry Tomatoes",
    ],
  });

  const [newGardenPlan, setNewGardenPlan] = useState({
    containers: [],
    leftoverContainers: [],
    leftoverPlants: [],
  });

  console.log(newGardenPlan);
  //for API call button
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);
  //need these for for...of loop in make a plan button
  //have them scoped globally because I'm making a loading bar using their properties
  const [containersArray, setContainersArray] = useState([]);
  const [leftoverContainers, setLeftoverContainers] = useState([]);
  const [remainingPlants, setRemainingPlants] = useState(form.plants);
  const [done, setDone] = useState(false);

  const { updatePlan } = props;

  useEffect(() => {
    updatePlan({
      leftoverContainers: leftoverContainers,
      containers: containersArray,
      leftoverPlants: remainingPlants,
    });
    localStorage.setItem(
      "gardenPlan",
      JSON.stringify({
        leftoverContainers: leftoverContainers,
        containers: containersArray,
        leftoverPlants: remainingPlants,
      })
    );
  }, [containersArray, leftoverContainers]);

  useEffect(() => {
    setRemainingPlants(form.plants);
  }, [form.plants]);

  useEffect(() => {
    if (done) {
      navigate("/plan");
    }
  }, [done]);

  function updateForm(key, value, updateArray, removeElement) {
    //add plant to plant array
    if (updateArray && !removeElement) {
      setForm((old) => {
        return {
          ...old,
          [key]: [...old[key], value],
        };
      });
      //remove plant from plant array
    } else if (updateArray && removeElement) {
      setForm((old) => {
        return {
          ...old,
          [key]: [...old[key].filter((plant) => plant !== value)],
        };
      });
      // update other form properties
    } else {
      setForm((old) => {
        return {
          ...old,
          [key]: value,
        };
      });
    }
  }
  // Bools for hide/show buttons on form
  const [showVegetables, setShowVegetables] = useState(false);
  const [showFruits, setShowFruits] = useState(false);
  const [showHerbs, setShowHerbs] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  //------------------------Garden Grid Functionalities---------------------

  const [selectedArray, setSelectedArray] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const sizesArray = [2, 5, 10, 15, 20, 25];
  const [structure, setStructure] = useState({
    width: 1,
    height: 1,
    name: "Small or Med Pot",
  });
  const [structurePoints, setStructurePoints] = useState([
    { id: "", structureIds: [] },
  ]);
  //for storing a single point on a structure that also holds the structure size info to facilitate removing it properly
  const [hoverArray, setHoverArray] = useState([]);
  //for proper hover effects of structure, and also enforcing non-overlap rules on the onClick
  const [overlapped, setOverlapped] = useState(false);

  function updateSelectedArray(squareId, remove) {
    if (remove) {
      setSelectedArray((old) => old.filter((element) => element !== squareId));
    } else {
      setSelectedArray((old) => [...old, squareId]);
    }
  }

  //new API call (meant to be called for each container in an array)

  async function fillContainerOnClick(e, container, plants, id) {
    e.preventDefault();
    const info = `the climate I live in is ${form.climate}`;
    let response;
    try {
      response = await fillContainer(container, plants, info, id);
    } catch (error) {
      console.log("error ", error);
    }
    if (!response) {
      return false;
    }
    const responseObject = JSON.parse(response);
    console.log("responseObject", responseObject);
    return [responseObject.container, responseObject.leftoverPlants];
  }

  return (
    <div id="createGardenPage">
      <NavBar logout={props.logout} isAuthenticated={props.isAuthenticated} />
      <div id="gardenCreatorDiv">
        <div id="gardenSizeFormDiv">
          <form id="gardenSizeForm">
            <label htmlFor="gardenWidth">
              Estimate the amount of space you have for a garden: width (in
              feet)
            </label>
            <select
              name="gardenWidth"
              defaultValue={10}
              onChange={(e) => {
                setGardenWidth(e.target.value);
              }}
            >
              {sizesArray.map((size) => {
                return (
                  <option value={size} key={size}>
                    {size}
                  </option>
                );
              })}
            </select>
            <label htmlFor="gardenHeight">
              Estimate the amount of space you have for a garden: height (in
              feet)
            </label>
            <select
              name="gardenHeight"
              defaultValue={5}
              onChange={(e) => {
                setGardenHeight(e.target.value);
              }}
            >
              {sizesArray.map((size) => {
                return (
                  <option value={size} key={size}>
                    {size}
                  </option>
                );
              })}
            </select>
          </form>
        </div>
        <div id="gardenGrid" style={{ maxWidth: `${52 * gardenWidth}px` }}>
          {Array.from({ length: gardenHeight * gardenWidth }).map(
            (_, index) => (
              <Square
                key={index}
                id={
                  Math.floor(index / gardenWidth) + "-" + (index % gardenWidth)
                }
                updateSelectedArray={updateSelectedArray}
                selectedArray={selectedArray}
                setSelectedArray={setSelectedArray}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                setIsAdding={setIsAdding}
                isAdding={isAdding}
                width={gardenWidth}
                structure={structure}
                setStructurePoints={setStructurePoints}
                structurePoints={structurePoints}
                hoverArray={hoverArray}
                setHoverArray={setHoverArray}
                overlapped={overlapped}
                setOverlapped={setOverlapped}
                gardenWidth={gardenWidth}
                gardenHeight={gardenHeight}
                setMyStructures={setMyStructures}
                myStructures={myStructures}
                updateForm={updateForm}
                setForm={setForm}
              />
            )
          )}
        </div>
        <div id="structureBtns">
          <h2>Add Structures</h2>
          <button
            onClick={() =>
              setStructure({
                width: 1,
                height: 1,
                diameter: "six - eight inches",
                name: "Small or Med Pot",
              })
            }
            className="mybtn"
          >
            Small / Med Pot (1 x 1)
          </button>
          <button
            onClick={() =>
              setStructure({
                width: 2,
                height: 2,
                diameter: "12 inches",
                name: "Large Pot",
              })
            }
            className="mybtn"
          >
            Large Pot (2 x 2)
          </button>
          <button
            onClick={() =>
              setStructure({ height: 3, width: 3, name: "Raised Bed" })
            }
            className="mybtn"
          >
            Raised Bed (3 x 3)
          </button>
          <button
            onClick={() =>
              setStructure({
                height: 4,
                width: 4,
                name: "Raised or Ground Bed",
              })
            }
            className="mybtn"
          >
            Raised or Ground Bed (4 x 4)
          </button>
          <button
            onClick={() =>
              setStructure({
                height: 4,
                width: 8,
                name: "Raised or Ground Bed",
              })
            }
            className="mybtn"
          >
            Raised or Ground Bed (4 x 8)
          </button>
          <button
            onClick={() =>
              setStructure({ height: 3, width: 6, name: "Raised Bed" })
            }
            className="mybtn"
          >
            Raised Bed (3 x 6)
          </button>
          <button
            onClick={() =>
              setStructure({ height: 5, width: 10, name: "Ground Bed" })
            }
            className="mybtn"
          >
            Ground Bed (5 x 10)
          </button>
        </div>
      </div>
      <form id="createGardenForm">
        {/* Experience level */}
        <div className="labelAndBtn">
          <label htmlFor="experienceLevel" className="marginTwo">
            What is your gardening experience level?
          </label>
          <select
            name="experienceLevel"
            onChange={(e) => updateForm(e.target.name, e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        {/* Type of climate */}
        <div className="labelAndBtn">
          <label htmlFor="climate" className="marginTwo">
            Which type of climate best describes your area?
          </label>
          <select
            name="climate"
            onChange={(e) => updateForm(e.target.name, e.target.value)}
          >
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
          updateForm={updateForm}
          category="vegetables"
          showCategory={showVegetables}
          setShowCategory={setShowVegetables}
          maxHeight={75}
        />
        {/* Fruits you want to grow */}
        <PlantList
          updateForm={updateForm}
          category="fruits"
          showCategory={showFruits}
          setShowCategory={setShowFruits}
          maxHeight={30}
        />
        {/* Herbs you want to grow */}
        <PlantList
          updateForm={updateForm}
          category="herbs"
          showCategory={showHerbs}
          setShowCategory={setShowHerbs}
          maxHeight={40}
        />
        {/* Flowers you want to grow */}
        <PlantList
          updateForm={updateForm}
          category="flowers"
          showCategory={showFlowers}
          setShowCategory={setShowFlowers}
          maxHeight={40}
        />
        {/* Other you want to grow */}
        <PlantList
          updateForm={updateForm}
          category="others"
          showCategory={showOthers}
          setShowCategory={setShowOthers}
          maxHeight={8}
        />
        {/* Is for food production? */}
        <div className="checkboxDiv">
          <label htmlFor="isForFoodProduction" className="checkboxLabel ">
            Is this garden for food production?
            <input
              type="checkbox"
              name="isForFoodProduction"
              onChange={(e) => updateForm(e.target.name, e.target.checked)}
            ></input>
          </label>
        </div>
        {/* Is for aesthetics? */}
        <div className="checkboxDiv">
          <label htmlFor="isForAesthetics" className="checkboxLabel ">
            Is this garden for aesthetics?
            <input
              type="checkbox"
              name="isForAesthetics"
              onChange={(e) => updateForm(e.target.name, e.target.checked)}
            ></input>
          </label>
        </div>
        <button
          onClick={async (e) => {
            e.preventDefault();
            if (!isDisabled) {
              setIsDisabled(true);
              setLoadingBar(true);

              let plants = form.plants;
              let index = 0;
              for (const container of form.preferredGrowingContainers) {
                if (plants.length < 1) {
                  setLeftoverContainers((prev) => [...prev, container]);
                } else {
                  const response = await fillContainerOnClick(
                    e,
                    container,
                    plants,
                    index
                  );
                  console.log(response[0]);
                  setContainersArray((prev) => [...prev, response[0]]);
                  setRemainingPlants(response[1]);
                  plants = response[1];
                  index++;
                }
              }
              setNewGardenPlan((old) => {
                return {
                  leftoverContainers: leftoverContainers,
                  containers: containersArray,
                  leftoverPlants: remainingPlants,
                };
              });
              setIsDisabled(false);

              setDone(true);
            }
          }}
          className={`mybtn ${isDisabled ? "disabled" : ""}`}
        >
          Make A Plan
        </button>
        {loadingBar && (
          <div id="loadingDiv">
            <h4>
              Filling containers..
              {`${containersArray.length + leftoverContainers.length} / ${
                form.preferredGrowingContainers.length
              }`}
            </h4>
            <div id="loadingSquareDiv">
              {form.preferredGrowingContainers.map((container, index) => {
                return (
                  <LoadingSquare
                    key={index}
                    id={index}
                    unloaded={
                      index > containersArray.length + leftoverContainers.length
                    }
                    next={
                      index ===
                      containersArray.length + leftoverContainers.length
                    }
                    loaded={
                      index < containersArray.length + leftoverContainers.length
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
