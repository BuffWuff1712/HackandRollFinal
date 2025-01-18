import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const DrowsinessDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [drowsyTime, setDrowsyTime] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playing, setPlaying] = useState(false); // Track if audio is playing
  const [isMuted, setIsMuted] = useState(false); // Track mute state

  const audioFiles = [
    '/music/ChineseGong.mp3',
    '/music/MetalPipes.mp3',
    '/music/wop_wop.mp3',
    '/music/rickroll.mp3',
    '/music/funny_car_alarm.mp3',
  ];

  useEffect(() => {
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
    const interval = setInterval(() => {
      captureFrame();
    }, 1000); // 1 second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMuted && drowsyTime >= 10 && !playing) {
      if (!currentAudio) {
        const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        setCurrentAudio(randomAudio);
      }

      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setPlaying(true);
        }).catch((err) => {
          console.error('Audio playback error:', err);
        });
      }
    } else if ((drowsyTime < 5 || isMuted) && playing) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlaying(false);
      setCurrentAudio(null);
    }
  }, [drowsyTime, playing, isMuted]);

  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL('image/jpeg');

      try {
        setIsProcessing(true);
        const response = await axios.post('http://127.0.0.1:5000/process_frame', { frame });
        const detectionStatus = response.data;

        if (detectionStatus.status === 'Drowsy') {
          setDrowsyTime((prevTime) => prevTime + 2);
        } else {
          setDrowsyTime(0);
        }

        setStatus(detectionStatus);
        setIsProcessing(false);
      } catch (err) {
        console.error('Error sending frame to backend:', err);
        setIsProcessing(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false); // Reset playing state
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Drowsiness Detector</h2>

      <video ref={videoRef} autoPlay muted width="640" height="480" className="border"></video>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>

      {status && (
        <div className="mt-4 alert alert-danger">
          <strong>{status.status}</strong>: {status.advice}
        </div>
      )}

      <div className="mt-4 alert alert-warning">
        <strong>Drowsiness Time:</strong> {drowsyTime} seconds
      </div>

      {currentAudio && (
        <audio
          ref={audioRef}
          src={currentAudio}
          preload="auto"
          onEnded={() => {
            setPlaying(false); // Reset playing state when audio ends
          }}
        />
      )}

      {/* Mute Toggle Button */}
      <button
        className={`mt-4 px-4 py-2 rounded ${isMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
        onClick={toggleMute}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default DrowsinessDetector;
