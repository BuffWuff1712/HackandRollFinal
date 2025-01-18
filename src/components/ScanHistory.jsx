import React from 'react';

const ScanHistory = ({ scans }) => {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Scan History</h2>
      {scans.length === 0 ? (
        <p>No scans available.</p>
      ) : (
        <ul>
          {scans.map((scan, index) => (
            <li key={index} className="py-2 border-b">
              <p><strong>Outcome:</strong> {scan.outcome}</p>
              <p><strong>Timestamp:</strong> {new Date(scan.timestamp).toLocaleString()}</p>
              <p><strong>Advice:</strong> {scan.advice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScanHistory;
