import React, { useState, useEffect, useRef } from "react";

const ReactTime = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reactionTime, setReactionTime] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [intervalTime, setIntervalTime] = useState(1);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const squareRef = useRef(null);
  const timerRef = useRef(null);
  const intervalDelay = useRef(null);
  const squareSize = 10;

  const getRandomPosition = () => {
    const container = squareRef.current.parentElement;
    const { clientWidth, clientHeight } = container;
    const maxWidth = clientWidth - squareSize;
    const maxHeight = clientHeight - squareSize;
    const randomTop = Math.random() * maxHeight;
    const randomLeft = Math.random() * maxWidth;
    return { top: randomTop, left: randomLeft };
  };
  const startGame = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      intervalDelay.current = setTimeout(() => setStartTime(Date.now));
    } else {
      moveSquare();
    }
    setIsRunning(true);
  };
  const pauseGame = () => {
    setIsRunning(false);
    setIsPaused(true);
    clearTimeout(timerRef.current);
  };
  const resetGame = () => {
    setIsRunning(false);
    setIsPaused(false);
    setReactionTime([]);
    setPosition({ top: "50%", left: "50%" });
    clearTimeout(timerRef.current);
  };
  const moveSquare = () => {
    if (isRunning) {
      const newPosition = getRandomPosition();
      setPosition(newPosition);
      setStartTime(Date.now());
      timerRef.current = setTimeout(moveSquare, intervalTime * 100);
    }
  };
  const handleSquareClick = () => {
    if (isRunning && !isPaused) {
      const reactionTime = (Date.now() - startTime) / 1000;
      setReactionTime((prevTimes) => [...prevTimes, reactionTime]);
      moveSquare();
    }
  };
  const handleIntervalChange = (e) => {
    const newInterval = Math.min(Math.max(e.target.value, 1), 10);
    setIntervalTime(newInterval);
  };
  useEffect(() => {
    if (!isRunning) {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning]);

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <button onClick={startGame}> Start </button>
        <button onClick={pauseGame}> Pause </button>
        <button onClick={resetGame}> Reset </button>
        <input
          type="number"
          min="1"
          max="10"
          value={intervalTime}
          onChange={handleIntervalChange}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          border: "1px solid black",
          marginTop: "20px",
        }}
      >
        {isRunning && !isPaused && (
          <div
            ref={squareRef}
            onClick={handleSquareClick}
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              backgroundColor: "red",
              cursor: "pointer",
            }}
          />
        )}
      </div>
      <table border="1" style={{ marginTop: "20px", width: "300px" }}>
        <thead>
          <tr>
            <th>Mouse Click Number</th>
            <th> Reaction Time (s) </th>
          </tr>
        </thead>
        <tbody>
          {reactionTime.map((time, index) => (
            <tr key={index}>
              <td> {index + 1} </td>
              <td> {time.toFixed(2)}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReactTime;
