import React, { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleWheel = (event) => {
    event.preventDefault();
    const scaleAmount = 0.1;
    const rect = contentRef.current.getBoundingClientRect();

    // Получаем координаты курсора относительно содержимого
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    // Вычисляем новое значение масштаба
    const newScale =
      event.deltaY < 0
        ? Math.min(scale + scaleAmount, 3) // Максимальный масштаб 3
        : Math.max(scale - scaleAmount, 0.1); // Минимальный масштаб 0.1

    // Вычисляем новое смещение
    const scaleFactor = newScale / scale;
    const newOffsetX = cursorX * (1 - scaleFactor) + offset.x;
    const newOffsetY = cursorY * (1 - scaleFactor) + offset.y;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartCoords({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
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

  return (
    <div
      className="workspace"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        overflow: "hidden", // Скрыть переполнение
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
        <div className="element" style={{ top: "50px", left: "50px" }}>
          Элемент 1
        </div>
        <div className="element" style={{ top: "200px", left: "200px" }}>
          Элемент 2
        </div>
        <div className="element" style={{ top: "400px", left: "100px" }}>
          Элемент 3
        </div>
        {/* Добавьте больше элементов по мере необходимости */}
      </div>
    </div>
  );
};

export default App;
