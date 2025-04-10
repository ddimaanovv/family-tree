import React, { useState, useRef, useCallback } from "react";
import "./App.css";
import persons from "./utils/Persons";
import PersonComp from "./components/PersonComp";
import addChild from "./utils/addChild";
import { personType } from "./types/personType";

const App = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [massPersons, setMassPersons] = useState<Array<personType>>(persons);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const scaleAmount = 0.1;
    const rect = contentRef.current?.getBoundingClientRect();

    // координаты курсора относительно содержимого
    if (rect) {
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      // новое значение масштаба
      const newScale =
        event.deltaY < 0
          ? Math.min(scale + scaleAmount, 3) // Максимальный масштаб 3
          : Math.max(scale - scaleAmount, 0.1); // Минимальный масштаб 0.1

      // новое смещение
      const scaleFactor = newScale / scale;
      const newOffsetX = cursorX * (1 - scaleFactor) + offset.x;
      const newOffsetY = cursorY * (1 - scaleFactor) + offset.y;

      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setIsDragging(true);
    setStartCoords({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isDragging) {
      const dx = event.clientX - startCoords.x;
      const dy = event.clientY - startCoords.y;
      setOffset((prevOffset) => ({
        x: prevOffset.x + dx,
        y: prevOffset.y + dy,
      }));
      setStartCoords({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addNewPerson = useCallback((parentID: number) => {
    setMassPersons((prevMass) => addChild(parentID, prevMass));
  }, []);

  return (
    <div
      className="workspace"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        overflow: "hidden",
      }}
    >
      <div
        className="content"
        ref={contentRef}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
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
  );
};

export default App;
