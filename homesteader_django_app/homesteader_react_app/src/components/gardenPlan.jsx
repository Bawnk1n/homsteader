import html2canvas from "html2canvas";
import "../assets/gardenPlan.css";
import jsPDF from "jspdf";
import { useState } from "react";
import { createShoppingList } from "../assets/apiCalls";

export function GardenPlan({ revisions, garden, finalAdvice }) {
  const [shoppingList, setShoppingList] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
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
          {revisions ? <p>{revisions}</p> : <p>none</p>}
        </div>
        <div>
          <h3>Garden</h3>
          {garden.map((plant) => {
            return (
              <div key={plant.plantName} className="plantDiv">
                <p>
                  <b>Plant: </b>
                  {plant.plantName}
                </p>
                <p>
                  <b>Number: </b>
                  {plant.numberOfPlants}
                </p>
                <p>
                  <b>Tools needed: </b>
                  {plant.toolsNeeded}
                </p>
                <p>
                  <b>Recommended growing apparatus: </b>{" "}
                  {plant.recommendedGrowingApparatus}
                </p>
                <p>
                  <b>Recommended plant container: </b>{" "}
                  {plant.recommendedPlantContainer}
                </p>
                <p>
                  <b>Watering needs: </b> {plant.wateringNeeds}
                </p>
                <p>
                  <b>Best soil: </b> {plant.bestSoilType}
                </p>
                <p>
                  <b>Space needed: </b> {plant.spaceNeeded}
                </p>
                <p>
                  <b>Other Advice: </b>
                  {plant.otherAdvice}
                </p>
              </div>
            );
          })}
        </div>
        <div>
          <h3>Final Advice</h3>
          <p>{finalAdvice}</p>
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
