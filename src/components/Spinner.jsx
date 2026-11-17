// Fichier : src/components/Spinner.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Spinner.css';

export default function Spinner({ text = "Recherche des meilleurs spots miam..." }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="spinner-container">
      <div className="spinner-circle" />
      {text && <p className="spinner-text">{text}</p>}
      {seconds > 4 && (
        <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '8px' }}>
          ⏳ Les serveurs OpenStreetMap mettent un peu de temps à répondre... (Patientez encore quelques secondes)
        </p>
      )}
    </div>
  );
}