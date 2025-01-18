import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Play, Pause, RotateCcw, BellOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  const [workTime, setWorkTime] = useState(5); // Editable work time in minutes
  const [breakTime, setBreakTime] = useState(10); // Editable break time in minutes
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // Timer in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [selectedApp, setSelectedApp] = useState('');
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  const alarmSoundRef = useRef(new Audio('/music/alarm_clock.mp3'));

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);

            // Toggle isWork state and reset timeLeft
            setIsWork((prevIsWork) => {
              const nextIsWork = !prevIsWork;
              const nextTime = nextIsWork ? workTime * 60 : breakTime * 60;
              setTimeLeft(nextTime); // Set the time for the next session
              return nextIsWork; // Return the toggled session type
            });

            // Play the alarm
            playAlarm();

            setIsRunning(false); // Stop the timer
            return 0; // Reset timeLeft temporarily
          }
          return prevTime - 1; // Decrement timeLeft
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup timer when `isRunning` changes
  }, [isRunning, workTime, breakTime]);

  const playAlarm = () => {
    const alarmSound = alarmSoundRef.current; // Get the persisted Audio object
    setIsAlarmPlaying(true);
    alarmSound.loop = true;
    alarmSound.play();

    // Automatically stop the alarm after 20 seconds
    setTimeout(() => {
      stopAlarm();
    }, 20000);
  };

  const stopAlarm = () => {
    const alarmSound = alarmSoundRef.current; // Get the persisted Audio object
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset audio to the start
    setIsAlarmPlaying(false);
  };

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
    setTimeLeft(isWork ? workTime * 60 : breakTime * 60);
    stopAlarm(); // Ensure alarm is stopped on reset
  };

  const totalTime = isWork ? workTime * 60 : breakTime * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

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

            {/* Stop Alarm Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={stopAlarm}
              className="w-12 h-12"
              disabled={!isAlarmPlaying} // Only enable when alarm is playing
            >
              <BellOff className="h-6 w-6" />
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

          {/* Editable Pomodoro Times */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              Work Time (minutes):
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={workTime}
              min={1}
              onChange={(e) => setWorkTime(Number(e.target.value))}
            />

            <label className="block text-sm font-medium mt-4 mb-1">
              Break Time (minutes):
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={breakTime}
              min={1}
              onChange={(e) => setBreakTime(Number(e.target.value))}
            />
          </div>
          <div className="text-center text-sm text-gray-500">
              Hit the reset button to update work / break time
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pomodoro;
