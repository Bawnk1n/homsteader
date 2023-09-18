import { useEffect, useState } from "react";

import PropTypes from "prop-types";

Square.propTypes = {
  id: PropTypes.string,
  updateSelectedArray: PropTypes.func,
  selectedArray: PropTypes.array,
  setSelectedArray: PropTypes.func,
  isDragging: PropTypes.bool,
  setIsDragging: PropTypes.func,
  setIsAdding: PropTypes.func,
  isAdding: PropTypes.bool,
  width: PropTypes.number,
  structure: PropTypes.object,
  setStructurePoints: PropTypes.func,
  structurePoints: PropTypes.array,
  hoverArray: PropTypes.array,
  setHoverArray: PropTypes.func,
  overlapped: PropTypes.bool,
  setOverlapped: PropTypes.func,
  gardenHeight: PropTypes.number,
  gardenWidth: PropTypes.number,
  myStructures: PropTypes.array,
  setMyStructures: PropTypes.func,
  updateForm: PropTypes.func,
  setForm: PropTypes.func,
};

export function Square(props) {
  let currentStructure = [];
  let localHoverArray = [];

  const [id_x, setId_x] = useState();
  const [id_y, setId_y] = useState();

  //isolate id numbers to use in for loops
  useEffect(() => {
    let id = isolateId();
    setId_x(id[0]);
    setId_y(id[1]);
  }, [props.gardenHeight, props.gardenWidth]);

  function isolateId() {
    let myId = props.id;
    let firstNumber = myId.match(/^(\d+)-/);
    let secondNumber = myId.match(/-(\d+)/);
    firstNumber ? (firstNumber = Number(firstNumber[1])) : null;
    secondNumber ? (secondNumber = Number(secondNumber[1])) : null;
    return [firstNumber, secondNumber];
  }
  function startDrag() {
    //if this square is not currently in the selectedArray
    if (!props.selectedArray.includes(props.id) && !props.overlapped) {
      //reset currentStructure
      currentStructure = [];
      //add the structure to the selectedArray and create a local currentStructure array
      for (let i = 0; i < props.structure.height; i++) {
        for (let j = 0; j < props.structure.width; j++) {
          currentStructure.push(`${id_x + i}-${id_y + j}`);
          props.updateSelectedArray(`${id_x + i}-${id_y + j}`, false);
        }
      }
      //use localCurrentStructure to make a new structurePoint object in createGarden.jsx
      props.setStructurePoints((old) => {
        return [
          ...old,
          {
            id: props.id,
            structureIds: currentStructure,
            name: props.structure.name,
          },
        ];
      });
      props.setHoverArray([]);
      // set this structure into myStructures array to send to AI API
      props.setMyStructures((old) => [
        ...old,
        {
          name: props.structure.name,
          width: `${props.structure.width} ft`,
          height: `${props.structure.height} ft`,
        },
      ]);
      props.setForm((old) => {
        return {
          ...old,
          preferredGrowingContainers: [
            ...old.preferredGrowingContainers,
            {
              name: props.structure.name,
              width: `${props.structure.width} ft`,
              height: `${props.structure.height} ft`,
              diameter: `${
                props.structure.diameter ? props.structure.diameter : ""
              }`,
            },
          ],
        };
      });
      //if the current square is a structurePoint
    } else if (props.structurePoints.some((obj) => obj.id === props.id)) {
      const thisStructurePoint = props.structurePoints.filter((obj) => {
        return obj.id === props.id;
      });
      props.setSelectedArray((old) => {
        return old.filter(
          (id) => !thisStructurePoint[0].structureIds.includes(id)
        );
      });
      props.setMyStructures((old) => {
        let targetName = props.structurePoints.find(
          (obj) => obj.id === props.id
        )?.name;
        if (targetName) {
          return old.filter((structure) => structure.name !== targetName);
        } else {
          return old;
        }
      });
      props.setForm((old) => {
        let targetName = props.structurePoints.find(
          (obj) => obj.id === props.id
        )?.name;
        if (targetName) {
          return {
            ...old,
            preferredGrowingContainers: old.preferredGrowingContainers.filter(
              (structure) => structure.name !== targetName
            ),
          };
        } else {
          return old;
        }
      });
      props.setStructurePoints((old) => {
        return old.filter((obj) => obj.id !== props.id);
      });
    }
  }

  function drag() {
    localHoverArray = [];
    props.setOverlapped(false);
    for (let i = 0; i < props.structure.height; i++) {
      for (let j = 0; j < props.structure.width; j++) {
        localHoverArray.push(`${id_x + i}-${id_y + j}`);
        if (
          props.selectedArray.includes(`${id_x + i}-${id_y + j}`) ||
          id_x + i >= props.gardenHeight ||
          id_y + j >= props.gardenWidth
        ) {
          props.setOverlapped(true);
        }
      }
    }
    if (props.structurePoints.some((obj) => obj.id === props.id)) {
      props.setOverlapped(false);
      localHoverArray = [];
      props.setHoverArray([]);
    }
    props.setHoverArray(localHoverArray);
    if (
      props.isDragging &&
      !props.selectedArray.includes(props.id) &&
      props.isAdding
    ) {
      props.updateSelectedArray(props.id, false);
    } else if (
      props.isDragging &&
      props.selectedArray.includes(props.id) &&
      !props.isAdding
    ) {
      props.updateSelectedArray(props.id, true);
    }
  }

  function stopDragging() {
    if (props.isDragging) {
      props.setIsDragging(false);
    }
  }
  return (
    <div
      className={`square ${
        props.selectedArray.includes(props.id) ? "selected" : ""
      } ${
        props.structurePoints.some((point) => point.id === props.id)
          ? "structurePoint"
          : ""
      } ${
        props.hoverArray.includes(props.id)
          ? props.overlapped
            ? "overlapped"
            : "hovered"
          : ""
      }
      `}
      onMouseDown={startDrag}
      onMouseOver={drag}
      onMouseUp={stopDragging}
    ></div>
  );
}
