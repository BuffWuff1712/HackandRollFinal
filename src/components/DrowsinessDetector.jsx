import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const DrowsinessDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [drowsyTime, setDrowsyTime] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null); // Store the current audio file

  const audioFiles = ['/music/ChineseGong.mp3', '/music/MetalPipes.mp3']; // List of audio files

  useEffect(() => {
    // Start the webcam when the component mounts
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };
    startVideo();
  }, []);

  useEffect(() => {
    // Automate frame capture every 0.5 seconds
    const interval = setInterval(() => {
      captureFrame();
    }, 500); // 0.5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []); // Empty dependency array ensures this runs once when the component mounts

  useEffect(() => {
    // Play the audio if drowsy for more than 5 seconds
    if (drowsyTime >= 5) {
      if (!currentAudio) {
        // Randomly select an audio file
        const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        setCurrentAudio(randomAudio);
      }

      if (audioRef.current) {
        audioRef.current.pause(); // Ensure the audio stops before replaying
        audioRef.current.currentTime = 0; // Reset the audio playback position
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio
        setCurrentAudio(null); // Clear the current audio selection
      }
    }
  }, [drowsyTime]);

  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to image data (Base64 string)
      const frame = canvas.toDataURL('image/jpeg');

      // Send frame to backend for processing
      try {
        setIsProcessing(true);
        const response = await axios.post('http://127.0.0.1:5000/process_frame', { frame });
        const detectionStatus = response.data;

        // Update drowsy time if "Drowsy" is detected
        if (detectionStatus.status === 'Drowsy') {
          setDrowsyTime((prevTime) => prevTime + 2); // Increment by 2 seconds
        } else {
          setDrowsyTime(0); // Reset if not drowsy
        }

        setStatus(detectionStatus); // Update detection status
        setIsProcessing(false);
      } catch (err) {
        console.error('Error sending frame to backend:', err);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Drowsiness Detector</h2>

      {/* Video feed */}
      <video ref={videoRef} autoPlay muted width="640" height="480" className="border"></video>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>

      {/* Status */}
      {status && (
        <div className="mt-4 alert alert-danger">
          <strong>{status.status}</strong>: {status.advice}
        </div>
      )}

      {/* Drowsiness Time Counter */}
      <div className="mt-4 alert alert-warning">
        <strong>Drowsiness Time:</strong> {drowsyTime} seconds
      </div>

      {/* Audio for alert */}
      {currentAudio && <audio ref={audioRef} src={currentAudio} preload="auto" />}
    </div>
  );
};

export default DrowsinessDetector;
