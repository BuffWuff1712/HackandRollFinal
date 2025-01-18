import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const DrowsinessDetector = ({ addScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
      detectDrowsiness();
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsDetecting(false);
  };

  const detectDrowsiness = async () => {
    setIsDetecting(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      if (detections.length > 0) {
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const earLeft = calculateEAR(leftEye);
        const earRight = calculateEAR(rightEye);
        const earAvg = (earLeft + earRight) / 2;

        if (earAvg < 0.2) {
          const timestamp = new Date().toISOString();
          addScan({
            outcome: 'Drowsy',
            timestamp,
            advice: 'Take a break and rest',
          });
          clearInterval(interval);
        }
      }
    }, 100);
  };

  const calculateEAR = (eye) => {
    const verticalDist1 = distance(eye[1], eye[5]);
    const verticalDist2 = distance(eye[2], eye[4]);
    const horizontalDist = distance(eye[0], eye[3]);
    return (verticalDist1 + verticalDist2) / (2 * horizontalDist);
  };

  const distance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Drowsiness Detector</h2>
      <video ref={videoRef} className="border" autoPlay muted width="640" height="480"></video>
      <canvas ref={canvasRef} className="absolute top-0 left-0"></canvas>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={startVideo}
          disabled={isDetecting}
        >
          Start Detection
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={stopVideo}
        >
          Stop Detection
        </button>
      </div>
    </div>
  );
};

export default DrowsinessDetector;
