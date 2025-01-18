import React, { useState, useEffect } from 'react';
import './Pomodoro.css';

const Pomodoro = () => {
    const WORK_TIME = 25 * 60; // 25 minutes
    const BREAK_TIME = 5 * 60; // 5 minutes
  
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [isWork, setIsWork] = useState(true);
  
    useEffect(() => {
      let timer;
      if (isRunning) {
        timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timer);
              setIsWork((prevIsWork) => !prevIsWork);
              return isWork ? BREAK_TIME : WORK_TIME; // Switch between work and break time
            }
            return prevTime - 1;
          });
        }, 1000);
      }
      return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [isRunning, isWork]);
  
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
  
    const handleStartPause = () => {
      setIsRunning((prev) => !prev);
    };
  
    const handleReset = () => {
      setIsRunning(false);
      setTimeLeft(isWork ? WORK_TIME : BREAK_TIME);
    };
  
    return (
      <div className="Pomorodo">
        <h1>Pomodoro Timer</h1>
        <h2>{isWork ? 'Work Time' : 'Break Time'}</h2>
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="controls">
          <button onClick={handleStartPause}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    );
  };
  
  export default Pomodoro;