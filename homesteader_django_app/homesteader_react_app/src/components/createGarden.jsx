import { useState, useEffect } from "react";
import { NavBar } from "./navbar";
import { commonClimates } from "../assets/presetPlants";
import "../assets/createGarden.css";
import { PlantList } from "./plantList";
import { Link } from "react-router-dom";
import { createGardenPlan } from "../assets/apiCalls";
import { useNavigate } from "react-router-dom";
import { Square } from "./square";

export function CreateGarden(props) {
  const [gardenWidth, setGardenWidth] = useState(10);
  const [gardenHeight, setGardenHeight] = useState(5);
  const [myStructures, setMyStructures] = useState([]);
  const [form, setForm] = useState({
    spaceAvailable: `${gardenWidth} x ${gardenHeight}ft`,
    preferredGrowingContainers: [],
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

  // useEffect(() => {
  //   setForm((old) => {
  //     return {
  //       ...old,
  //       preferredGrowingContainers: myStructures,
  //     };
  //   });
  // }, [myStructures]);

  const [plan, setPlan] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();

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

  const [showVegetables, setShowVegetables] = useState(false);
  const [showFruits, setShowFruits] = useState(false);
  const [showHerbs, setShowHerbs] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  function renderPlan() {
    try {
      console.log(plan);
      props.updatePlan(plan);
      navigate("/plan");
    } catch (TypeError) {
      return <p>yeet</p>;
    }
  }

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
  ]); //for storing a single point on a structure that also holds the structure size info to facilitate removing it properly
  const [hoverArray, setHoverArray] = useState([]); //for proper hover effects of structure, and also enforcing non-overlap rules on the onClick
  const [overlapped, setOverlapped] = useState(false);

  function updateSelectedArray(squareId, remove) {
    if (remove) {
      setSelectedArray((old) => old.filter((element) => element !== squareId));
    } else {
      setSelectedArray((old) => [...old, squareId]);
    }
  }

  //----------ORIGINAL API CALL FUNCTION-------------------
  async function origApiCall(e) {
    e.preventDefault();
    setIsDisabled(true);
    e.target.setAttribute("disabled", "disabled");
    const newPlan = await createGardenPlan(form);
    console.log(newPlan);
    const cleanedPlan = newPlan.replace(/\\n/g, "").replace(/\s+/g, " ").trim();
    console.log(cleanedPlan);
    const parsedPlan = JSON.parse(cleanedPlan);
    console.log("parsedPlan: ", parsedPlan);
    setPlan(parsedPlan);
    e.target.removeAttribute("disabled");
    setIsDisabled(false);
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
              setStructure({ height: 1, width: 1, name: "Small or Med Pot" })
            }
            className="mybtn"
          >
            Small / Med Pot (1 x 1)
          </button>
          <button
            onClick={() =>
              setStructure({ height: 2, width: 2, name: "Large Pot" })
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
          // onClick={origApiCall}
          onClick={async (e) => {
            e.preventDefault();
            setIsDisabled(true);
            const newPlan = await createGardenPlan(form);
            const parsedPlan = JSON.parse(newPlan);
            console.log(parsedPlan);
            setPlan(parsedPlan);
            setIsDisabled(false);
          }}
          className={`mybtn ${isDisabled ? "disabled" : ""}`}
        >
          Make A Plan
        </button>
      </form>
      {plan && renderPlan()}

      <Link to="/" className="mybtn">
        Exit
      </Link>
    </div>
  );
}
