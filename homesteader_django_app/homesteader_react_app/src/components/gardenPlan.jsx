import html2canvas from "html2canvas";
import "../assets/gardenPlan.css";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { Container } from "./containerDiv";
import PropTypes from "prop-types";
import { updateGardenPlan } from "../assets/apiCalls";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./navbar";

GardenPlan.propTypes = {
  plan: PropTypes.object,
  updatePlan: PropTypes.func,
  isAuthenticated: PropTypes.bool,
};

export function GardenPlan({ plan, updatePlan, isAuthenticated }) {
  const navigate = useNavigate();
  const [localPlan, setLocalPlan] = useState(() => {
    if (!plan || Object.keys(plan).length < 1) {
      return JSON.parse(localStorage.getItem("gardenPlan"));
    } else {
      return plan;
    }
  });

  let { specificRevisionsMade, singularContainers, furtherAdvice } = localPlan;
  const garden = singularContainers;

  const [isDisabled, setIsDisabled] = useState(false);
  const [visibleContainer, setVisibleContainer] = useState(0);
  const [changesTextArea, setChangesTextArea] = useState("");

  //! Doesn't work properly
  async function generatePDF() {
    const plan = document.querySelector(".content");
    const canvas = await html2canvas(plan);
    const imgData = canvas.toDataURL("image/png");
    let pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = imgProps.width / imgProps.height;

    let scaledWidth = pdfWidth;
    let scaledHeight = pdfWidth / aspectRatio;

    let heightLeft = scaledHeight;
    let position = 0;

    while (heightLeft >= 0) {
      pdf.addImage(imgData, "PNG", 0, position, scaledWidth, scaledHeight);
      heightLeft -= pdfHeight;
      position = -1 * heightLeft;

      if (heightLeft >= 0) {
        pdf.addPage();
      }
    }

    pdf.save("garden_plan.pdf");
  }

  async function updatePlanLocal(e) {
    e.preventDefault();
    if (!isDisabled) {
      alert("Making changes to the plan.. this may take a minute or two.");
      setIsDisabled(true);
      try {
        const newPlan = await updateGardenPlan(localPlan, changesTextArea);
        const parsedPlan = JSON.parse(newPlan);

        //updatePlan(parsedPlan);
        setLocalPlan(parsedPlan);

        setChangesTextArea("");
        setIsDisabled(false);

        //navigate("/plan");
      } catch (error) {
        console.log("an error occurred: ", error);
        setIsDisabled(false);
      }
    }
  }

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} />
      <div className="content">
        <div>
          <h1>Garden Plan</h1>
          <h2>Tentative Instructions and Advice</h2>
        </div>
        <div>
          <h3>Revisions</h3>
          {specificRevisionsMade ? (
            <div>
              {/* <p>{specificRevisionsMade}</p> */}
              <p>
                Plants removed:{" "}
                <b>
                  {specificRevisionsMade.plantsRemoved
                    ? specificRevisionsMade.plantsRemoved.join(", ")
                    : "none"}
                </b>
              </p>
              <p>
                Plants added:{" "}
                <b>
                  {specificRevisionsMade.plantsAdded
                    ? specificRevisionsMade.plantsAdded.join(", ")
                    : "none"}
                </b>
              </p>
              <p>
                Containers removed:{" "}
                <b>
                  {specificRevisionsMade.containersRemoved
                    ? specificRevisionsMade.containersRemoved.join(", ")
                    : "none"}
                </b>
              </p>
              <p>
                Containers added:{" "}
                <b>
                  {specificRevisionsMade.containersAdded
                    ? specificRevisionsMade.containersAdded.join(", ")
                    : "none"}
                </b>
              </p>
            </div>
          ) : (
            <p>none</p>
          )}
        </div>
        <div id="buttons">
          {garden.map((container) => {
            return (
              <button
                id={container.id}
                className="mybtn"
                key={container.id}
                onClick={() => {
                  setVisibleContainer(container.id);
                }}
              >
                {container.containerInfo}
              </button>
            );
          })}
        </div>
        <div>
          {garden.map((container) => {
            return (
              <Container
                container={container}
                id={`container ${container.id}`}
                key={`${container.id} ${container.containerInfo}`}
                isHidden={visibleContainer === container.id ? false : true}
              />
            );
          })}
        </div>
        <div id="furtherAdvice">
          <h3>Further Advice</h3>
          <p>{furtherAdvice}</p>
        </div>
        <div>
          <h4>
            Want to make changes to the plan? describe the changes you want to
            make below.
          </h4>
          <form>
            <input
              type="textarea"
              width="250px"
              placeholder="Add carrots, remove cucumbers..."
              value={changesTextArea}
              onChange={(e) => setChangesTextArea(e.target.value)}
            ></input>
            <button
              className={`mybtn ${isDisabled ? "disabled" : ""}`}
              onClick={updatePlanLocal}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
