import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import PersonComp from "./components/PersonComp";
import persons from "./Persons";

export type personType = {
  id: number;
  name: string;
  level: number;
  coordX: number;
  coordY: number;
  seqNumber: number;
  isDirect: boolean;
  birthday: number;
  sibling: Array<number>;
  spouse: Array<number>;
  children: Array<number>;
};

const LOB = 100;
const LBB = 50;

let count = 1;

let currentMassPersons: Array<personType>;

function App() {
  const [massPersons, setMassPersons] = useState<Array<personType>>(persons);

  currentMassPersons = massPersons;

  let addChild = (parentID: number): Array<personType> => {
    let newPerson: personType = {
      id: Date.now(),
      name: "noName" + count++,
      level: 0,
      coordX: 0,
      coordY: 0,
      seqNumber: 0,
      isDirect: true,
      birthday: 2005,
      sibling: [],
      spouse: [],
      children: [],
    };

    let parent = currentMassPersons.find((elem) => elem.id === parentID);
    if (parent) {
      parent.children.push(newPerson.id);
      newPerson.level = parent.level - 1;
      let massRelatives = currentMassPersons.filter(
        (elem) => elem.level === newPerson.level
      );

      // if (massPersonAtCurrentLevel) {
      //   let massCoordXAtCurrentLevel = massPersonAtCurrentLevel.map(
      //     (person) => person.coordX
      //   );
      //   let parentCoordX = Math.min(...massCoordXAtCurrentLevel);
      //   // if ()
      // }

      let massPossibleCoordX = [parent.coordX];
      if (parent.spouse.length) {
        let spouse = currentMassPersons.find(
          (elem) => elem.id === parent?.spouse[0]
        );
        if (spouse !== undefined) {
          massPossibleCoordX.push(spouse.coordX);
          spouse.children.push(newPerson.id);
        }
      }
      let parentCoordX = Math.min(...massPossibleCoordX);

      let countChild = parent.children.length;
      if (countChild > 0) {
        parent.children.forEach((childId) => {
          let child = currentMassPersons.find((elem) => elem.id === childId);
          if (child) {
            child.coordX = child.coordX - (LOB + LBB) / 2;
          }
          newPerson.sibling.push(childId);
        });
      }
      newPerson.coordX =
        parentCoordX + ((LOB + LBB) * (parent.spouse.length + countChild)) / 2;
      newPerson.coordY = parent.coordY + (LOB + LBB);
    }

    let copyOfCurrentMassPersons = [...currentMassPersons, newPerson];
    return copyOfCurrentMassPersons;
  };

  const addNewPerson = useCallback((parentID: number) => {
    let massNewPerson = addChild(parentID);
    setMassPersons(massNewPerson);
  }, []);

  const layerRef = useRef<HTMLDivElement>(null);

  const [viewport, setViewport] = useState({
    offset: {
      x: 0.0,
      y: 0.0,
    },
    zoom: 1,
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      return;
    }

    if (e.buttons !== 1) {
      setIsDragging(false);

      return;
    }

    setViewport((prev) => ({
      ...prev,
      offset: {
        x: prev.offset.x + e.movementX,
        y: prev.offset.y + e.movementY,
      },
    }));
  };

  console.log(viewport);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.onwheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey) {
          const speedFactor =
            (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * 1;
          // позиция курсора внутри элемента
          // // @ts-ignore
          // const offsetX = e.clientX - layerRef.current.getBoundingClientRect().left;
          // // @ts-ignore
          // const offsetY = e.clientY - layerRef.current.getBoundingClientRect().top;

          // // нормированные координаты (от 0 до 1)
          // // @ts-ignore
          // const normX = offsetX / layerRef.current.getBoundingClientRect().width;
          // // @ts-ignore
          // const normY = offsetY / layerRef.current.getBoundingClientRect().height;
          // const dx = (normX * layerRef.current.getBoundingClientRect().width) * (1 - scale / prevScale);
          // const dy = (normY * layerRef.current.getBoundingClientRect().height) * (1 - scale / prevScale);
          setViewport((prev) => {
            const pinchDelta = -e.deltaY * speedFactor;

            return {
              ...prev,
              zoom: Math.min(
                1.3,
                Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta / 3))
              ),
            };
          });
        }
      };
    }
  }, []);

  return (
    <div
      className="app"
      ref={layerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="container">
        <div
          className="nodes-container"
          style={{
            transform: `translate(${viewport.offset.x}px, ${viewport.offset.y}px) scale(${viewport.zoom})`,
          }}
        >
          {massPersons.map((person) => {
            return (
              <PersonComp
                key={person.id}
                personID={person.id}
                personCoordX={person.coordX}
                personCoordY={person.coordY}
                personName={person.name}
                addNewPerson={addNewPerson}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
