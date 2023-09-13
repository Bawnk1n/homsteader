import html2canvas from "html2canvas";
import "../assets/gardenPlan.css";
import jsPDF from "jspdf";
import { useState } from "react";
import { createShoppingList } from "../assets/apiCalls";

export function GardenPlan({ adjustmentsMade, garden, furtherAdvice }) {
  const [shoppingList, setShoppingList] = useState();
  const [isDisabled, setIsDisabled] = useState(false);

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
          {adjustmentsMade ? <p>{adjustmentsMade}</p> : <p>none</p>}
        </div>
        <div>
          <h3>Garden</h3>
          {Object.keys(garden).map((containerKey) => {
            const container = garden[containerKey];
            return (
              <div
                key={container.id + container.containerInfo}
                className="containerDiv"
              >
                <p>
                  <b>Container: </b>
                  {container.containerInfo}
                </p>
                <p>
                  <b>Plants: </b>
                </p>
                {Object.keys(container.plants).map((plantInfo) => {
                  const plant = container.plants[plantInfo];
                  return (
                    <div key={plant.id + plant.name} className="plantInfo">
                      <p>{plant.name ? plant.name : plantInfo}</p>
                      <p>
                        Number of plants: {plant.numberOfPlantsPerContainer}
                      </p>
                      <p>Space per plant: {plant.plantSpacing}</p>
                      <p>
                        Watering needs: {plant.detailedWateringInstructions}
                      </p>
                      <p>When to plant: {plant.whenToPlant}</p>
                      <p>First Yield: {plant.firstYield}</p>
                    </div>
                  );
                })}
                <p>
                  <b>Instructions: </b> {container.detailedInstructions}
                </p>
                <p>
                  <b>Shopping list: </b> {container.shoppingList}
                </p>
              </div>
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
