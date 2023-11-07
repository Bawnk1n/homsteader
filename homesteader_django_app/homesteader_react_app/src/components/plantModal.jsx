import { useEffect, useState } from "react";
import { CountdownSquare } from "./plantModalCountdownSquare";
import { getCookie } from "../assets/getCookie";
import PropTypes from "prop-types";

PlantModal.propTypes = {
  plant: PropTypes.object,
  containerId: PropTypes.number,
  closeModal: PropTypes.func,
};

export function PlantModal({ plant, containerId, closeModal }) {
  const [startDate, setStartDate] = useState(
    plant.startDate ? plant.startDate : null
  );
  const [todaysDate, setTodaysDate] = useState();
  const [daysPassed, setDaysPassed] = useState();
  const [planted, setPlanted] = useState(false);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    const start = `${year}-${month}-${day}`;
    setTodaysDate(start);
    console.log();
  }, []);

  useEffect(() => {
    const start = new Date(startDate);
    const today = new Date(todaysDate);

    // Calculate the difference in milliseconds
    const differenceInTime = today.getTime() - start.getTime();

    // Convert the difference in milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // console.log(differenceInDays); // Outputs the number of days difference
    setDaysPassed(differenceInDays);
  }, [todaysDate, startDate]);

  //width = 30rem
  //box width = 30 / countdownStart rem

  async function postStartDate(date) {
    const response = await fetch("http://localhost:8000/set_plant_start_date", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
      body: JSON.stringify({
        plant: plant,
        containerId: containerId,
        startDate: date,
      }),
    });
    const data = await response.json();
    console.log(data.message);
    if (data.status === "success") {
      setStartDate(date);
      setPlanted(true);
    }
  }
  function startCountdown() {
    postStartDate(todaysDate);
  }

  return (
    <div
      className="modal-background"
      onClick={() => {
        if (planted) {
          window.location.reload();
        }
        closeModal(false);
      }}
    >
      <div className="plantModal" onClick={(e) => e.stopPropagation()}>
        <h3>{plant.name}</h3>
        {startDate && (
          <div className="plantedInfo">
            <div id="firstYieldCountdown">
              {Array.from({ length: plant.firstYieldCountdownStart }).map(
                (_, index) => (
                  <CountdownSquare
                    width={`${300 / plant.firstYieldCountdownStart}px`}
                    key={index}
                    done={index < daysPassed} //
                  />
                )
              )}
            </div>
            <div className="smalls">
              <p>
                <small>
                  Planted {plant.startDate ? `on ${plant.startDate}` : "today"}
                </small>
              </p>
              <p>|</p>
              <p>
                <small>Number of plants: {plant.numberOfPlants}</small>
              </p>
              <p>|</p>
              <p>
                <small>{`Roughly ${
                  plant.firstYieldCountdownStart - daysPassed
                } days until first harvest`}</small>
              </p>
            </div>
          </div>
        )}
        <div className="plantCardInfo">
          <p>
            <b>Yield interval</b>: {plant.firstYield}
          </p>
          <p>
            <b>Planting instructions</b>: {plant.plantingInstructions}
          </p>
          <p>
            <b>General tips</b>: {plant.generalTipsAndTricks}
          </p>
          <p>
            <b>When to plant</b>: {plant.whenToPlant}
          </p>
          <p>
            <b>Advanced tip</b>: {plant.advancedGardeningTip}
          </p>
          <p>
            <b>Little known fact</b>: {plant.littleKnownFact}
          </p>
        </div>

        {!startDate && (
          <button onClick={startCountdown} className="mybtn">
            Plant me!
          </button>
        )}
      </div>
    </div>
  );
}

//<button onClick={() => {}}>Dev</button>;
