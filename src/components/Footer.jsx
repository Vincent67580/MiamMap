import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <p className="footer-brand">
        <strong>MiamMap</strong> · Créé par{' '}
        <a
          href="https://github.com/Vincent67580/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vincent (Vincent67580)
        </a>
      </p>
      <p className="footer-credits">
        Données :{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap
        </a>{' '}
        (Nominatim &amp; Overpass) · © {currentYear}
      </p>
    </footer>
  );
}