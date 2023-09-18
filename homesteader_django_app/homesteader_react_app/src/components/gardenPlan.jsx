import html2canvas from "html2canvas";
import "../assets/gardenPlan.css";
import jsPDF from "jspdf";
import { useState } from "react";
import { createShoppingList } from "../assets/apiCalls";
import { Container } from "./containerDiv";

export function GardenPlan({ specificRevisionsMade, garden, furtherAdvice }) {
  const [shoppingList, setShoppingList] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [visibleContainer, setVisibleContainer] = useState(0);

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

  return (
    <>
      <div className="content">
        <div>
          <h1>Garden Plan</h1>
          <h2>Tentative Instructions and Advice</h2>
        </div>
        <div>
          <h3>Revisions</h3>
          {specificRevisionsMade ? <p>{specificRevisionsMade}</p> : <p>none</p>}
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
          <h3>Garden</h3>
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
        <div>
          <h3>Further Advice</h3>
          <p>{furtherAdvice}</p>
        </div>
      </div>
      <button className="mybtn" onClick={generatePDF}>
        Download as PDF
      </button>
      <button
        onClick={async (e) => {
          e.preventDefault();
          setIsDisabled(true);
          e.target.setAttribute("disabled", "disabled");
          const shopping = await createShoppingList(garden);
          setShoppingList(shopping);
          e.target.removeAttribute("disabled");
          setIsDisabled(false);
        }}
        className={`mybtn ${isDisabled ? "disabled" : ""}`}
      >
        Create shopping list
      </button>

      {shoppingList && (
        <div dangerouslySetInnerHTML={{ __html: shoppingList }}></div>
      )}
    </>
  );
}
