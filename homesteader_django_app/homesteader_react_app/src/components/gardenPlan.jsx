import html2canvas from "html2canvas";
import "../assets/gardenPlan.css";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { Container } from "./containerDiv";
import PropTypes from "prop-types";
import { updateGardenPlan } from "../assets/apiCalls";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./navbar";
import Unknown from "../assets/images/question-circle.svg";

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

  let { containers, leftoverContainers, leftoverPlants } = localPlan;

  useEffect(() => {
    localStorage.setItem("gardenPlan", JSON.stringify(localPlan));
  }, [localPlan]);

  const [isDisabled, setIsDisabled] = useState(false);
  const [visibleContainer, setVisibleContainer] = useState();
  const [changesTextArea, setChangesTextArea] = useState("");
  const [isRevising, setIsRevising] = useState(false);

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
          <p>
            Leftover containers:{" "}
            {leftoverContainers.length > 0
              ? leftoverContainers.join(", ")
              : "None"}
          </p>

          <p>
            Leftover plants:{" "}
            {leftoverPlants.length > 0 ? leftoverPlants.join(", ") : "None"}
          </p>
          <div className="flex">
            {leftoverPlants.map((plant) => {
              return (
                <div key={plant} className="leftoverPlant">
                  <h6>{plant}</h6>
                  <button
                    className={`mybtn ${!visibleContainer ? "disabled" : null}`}
                    onClick={() => {
                      //dont do anything if no container is selected
                      if (!visibleContainer) {
                        return null;
                      }
                      setLocalPlan((old) => {
                        const newContainers = old.containers.map(
                          (container) => {
                            if (container.id === visibleContainer) {
                              return {
                                ...container,
                                plants: [
                                  ...container.plants,
                                  {
                                    name: plant,
                                    numberOfPlants: "?",
                                    plantingInstructions: "?",
                                    whenToPlant: "?",
                                    firstYield: "?",
                                    generalTipsAndTricks: "?",
                                    littleKnownFact: "?",
                                    advancedGardeningTip: "?",
                                  },
                                ],
                                //added needsRevision here to make sure we know which containers need to be sent back to the ai
                                needsRevision: true,
                              };
                            } else {
                              return container;
                            }
                          }
                        );
                        return {
                          ...old,
                          containers: newContainers,
                          leftoverPlants: old.leftoverPlants.filter(
                            (name) => name !== plant
                          ),
                        };
                      });
                    }}
                  >
                    Add to current container
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div id="buttons">
          <h3>Containers</h3>
          {containers.map((container) => {
            let result = container.name.match(
              /Large Pot|Raised or Ground Bed/i
            );
            let src;
            if (result === null) {
              src = Unknown;
            } else {
              switch (result[0]) {
                case null:
                  src = Unknown;
                  break;
                case "Large Pot":
                  src = "Large Pot";
                  break;
                case "Raised or Ground Bed":
                  src = "Raised or Ground Bed";
                  break;
                case "Small Pot":
                  src = "Small Pot";
              }
            }

            return (
              <img
                src={
                  src === Unknown ? Unknown : `../src/assets/images/${src}.png`
                }
                key={container.id}
                onClick={() => {
                  if (!isRevising) {
                    setVisibleContainer(container.id);
                  }
                }}
                alt={container.name}
                className="btnImg"
              />
            );
          })}
        </div>
        <div>
          {containers.map((container) => {
            return (
              <div key={`${container.id} ${container.name}`}>
                {visibleContainer === container.id && (
                  <h4 className="containerHeader">{container.name}</h4>
                )}
                <Container
                  container={container}
                  id={`container ${container.name} ${container.id}`}
                  isHidden={visibleContainer === container.id ? false : true}
                  setLocalPlan={setLocalPlan}
                  localPlan={localPlan}
                  setIsRevising={setIsRevising}
                  isRevising={isRevising}
                />
              </div>
            );
          })}
          <button className="mybtn border-radius">Save Garden</button>
        </div>
      </div>
    </>
  );
}
