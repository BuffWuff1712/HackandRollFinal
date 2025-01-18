import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Play, Pause, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const WORK_TIME = 1 * 5;
const BREAK_TIME = 1 * 10;

const APPLICATIONS = [
  "Visual Studio Code",
  "Chrome",
  "Slack",
  "Microsoft Word",
  "Excel",
  "Email",
  "Other"
];

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [selectedApp, setSelectedApp] = useState('');

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setIsWork((prevIsWork) => !prevIsWork);
            return isWork ? BREAK_TIME : WORK_TIME;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isWork]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (selectedApp) {
      setIsRunning((prev) => !prev);
    } else {
      alert("Please select an application to focus on before starting the timer.");
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWork ? WORK_TIME : BREAK_TIME);
  };

  const progress = ((isWork ? WORK_TIME : BREAK_TIME) - timeLeft) / (isWork ? WORK_TIME : BREAK_TIME) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isWork ? "Work Time" : "Break Time"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <span className="text-6xl font-mono font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <Progress value={progress} className="h-2 w-full" />
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleStartPause}
              className="w-12 h-12"
              disabled={!selectedApp}
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="w-12 h-12"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>

          <div className="mt-6">
            <Select value={selectedApp} onValueChange={setSelectedApp}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select application to focus on" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATIONS.map((app) => (
                  <SelectItem key={app} value={app}>
                    {app}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedApp && (
            <div className="text-center text-sm text-gray-500">
              Focusing on: {selectedApp}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pomodoro;