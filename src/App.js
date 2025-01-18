import React, { useState } from 'react';
import DrowsinessDetector from './components/DrowsinessDetector';
import ScanHistory from './components/ScanHistory';

function App() {
  const [scans, setScans] = useState([]);

  const addScan = (scan) => {
    setScans((prevScans) => [scan, ...prevScans]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Drowsiness Detection App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DrowsinessDetector addScan={addScan} />
        <ScanHistory scans={scans} />
      </div>
    </div>
  );
}

export default App;
